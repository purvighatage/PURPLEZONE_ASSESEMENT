const Statement = require('../models/Statement');
const Submission = require('../models/Submission');
const { getDbMode } = require('../config/db');
const mockDb = require('../models/mockDb');

// Helper to sanitize and normalize text for exact comparison
const normalizeText = (text) => {
  if (!text) return '';
  // Trim, replace multiple spaces with single space, keep casing intact for grammar checks
  return text.trim().replace(/\s+/g, ' ');
};

// Grammar Engine: Evaluates a user's corrected text against specific rules for the 3 statements
const analyzeGrammar = (statementId, text) => {
  const norm = normalizeText(text);
  const feedback = [];
  
  if (statementId === 's1' || statementId.toString().includes('s1')) {
    // Statement 1: "she dont like going to the store on sundays"
    const hasCapitalShe = /^[S]he\b/.test(norm);
    const hasCorrectDoesnt = /\b(doesn't|does not)\b/i.test(norm);
    const hasProperDoesnt = /\b(doesn't|does not)\b/.test(norm); // case sensitive check
    const hasCapitalSundays = /\bSundays\b/.test(norm);
    const hasPeriod = norm.endsWith('.');

    feedback.push({
      rule: "Capitalize the first letter of the sentence ('She')",
      passed: hasCapitalShe,
      hint: "Make sure 'She' starts with a capital 'S'."
    });
    feedback.push({
      rule: "Use correct singular subject agreement ('doesn't' or 'does not')",
      passed: hasCorrectDoesnt && hasProperDoesnt,
      hint: "Replace 'dont' with 'doesn't' or 'does not' (spelled exactly)."
    });
    feedback.push({
      rule: "Capitalize days of the week ('Sundays')",
      passed: hasCapitalSundays,
      hint: "The proper noun 'Sundays' must be capitalized."
    });
    feedback.push({
      rule: "End the sentence with a period ('.')",
      passed: hasPeriod,
      hint: "Add a period at the very end of the sentence."
    });
  } else if (statementId === 's2' || statementId.toString().includes('s2')) {
    // Statement 2: "their going to there house because they're car is broken"
    const startsWithTheyre = /^They're\b/.test(norm);
    const hasTheirHouse = /\btheir house\b/i.test(norm);
    const hasTheirCar = /\btheir car\b/i.test(norm);
    const hasPeriod = norm.endsWith('.');

    feedback.push({
      rule: "Start with 'They're' (contraction of 'They are')",
      passed: startsWithTheyre,
      hint: "Use 'They're' to start the sentence (homophone fix)."
    });
    feedback.push({
      rule: "Use possessive 'their' for 'their house'",
      passed: hasTheirHouse,
      hint: "Change 'there house' to possessive 'their house'."
    });
    feedback.push({
      rule: "Use possessive 'their' for 'their car'",
      passed: hasTheirCar,
      hint: "Change 'they're car' to possessive 'their car'."
    });
    feedback.push({
      rule: "End the sentence with a period ('.')",
      passed: hasPeriod,
      hint: "Add a period at the very end of the sentence."
    });
  } else if (statementId === 's3' || statementId.toString().includes('s3')) {
    // Statement 3: "the dog wagged its tail when it saw it's owner"
    const startsWithThe = /^The\b/.test(norm);
    const hasItsTail = /\bits tail\b/i.test(norm);
    const hasItsOwner = /\bits owner\b/.test(norm); // case sensitive & no apostrophe
    const hasPeriod = norm.endsWith('.');

    feedback.push({
      rule: "Capitalize the first letter of the sentence ('The')",
      passed: startsWithThe,
      hint: "Make sure 'The' starts with a capital 'T'."
    });
    feedback.push({
      rule: "Use correct possessive 'its' for 'its tail'",
      passed: hasItsTail,
      hint: "'its' represents ownership. Ensure there is no apostrophe."
    });
    feedback.push({
      rule: "Use correct possessive 'its' for 'its owner'",
      passed: hasItsOwner,
      hint: "'it's' means 'it is'. Change it to possessive 'its owner'."
    });
    feedback.push({
      rule: "End the sentence with a period ('.')",
      passed: hasPeriod,
      hint: "Add a period at the very end of the sentence."
    });
  }

  return feedback;
};

// @desc    Get all statements (without correct answers for security)
// @route   GET /api/statements
// @access  Private
exports.getStatements = async (req, res) => {
  try {
    const isMock = getDbMode();

    if (isMock) {
      // Map statements to hide correct answers
      const safeStatements = mockDb.statements.map(s => ({
        id: s.id,
        text: s.text,
        explanation: s.explanation,
        errors: s.errors
      }));
      return res.json(safeStatements);
    } else {
      // Get from MongoDB, project to exclude 'corrections'
      const statements = await Statement.find({}, '-corrections');
      return res.json(statements);
    }
  } catch (error) {
    console.error('getStatements error:', error);
    return res.status(500).json({ message: 'Server error retrieving statements' });
  }
};

// @desc    Submit corrected statements and get results
// @route   POST /api/statements/submit
// @access  Private
exports.submitCorrections = async (req, res) => {
  const { corrections } = req.body; // Array: [{ statementId, correctedText }]

  if (!corrections || !Array.isArray(corrections) || corrections.length === 0) {
    return res.status(400).json({ message: 'Please provide corrections' });
  }

  try {
    const isMock = getDbMode();
    let score = 0;
    const gradedCorrections = [];

    for (const correction of corrections) {
      const { statementId, correctedText } = correction;
      const normalizedInput = normalizeText(correctedText);
      let isCorrect = false;
      let originalText = '';
      let correctionsList = [];
      let explanation = '';

      if (isMock) {
        // Query from mock db
        const statement = mockDb.statements.find(s => s.id === statementId);
        if (statement) {
          originalText = statement.text;
          correctionsList = statement.corrections;
          explanation = statement.explanation;
          
          // Check if normalized matches any normalized accepted corrections
          isCorrect = correctionsList.some(
            correctAns => normalizeText(correctAns) === normalizedInput
          );
        }
      } else {
        // Query from MongoDB
        const statement = await Statement.findById(statementId);
        if (statement) {
          originalText = statement.text;
          correctionsList = statement.corrections;
          explanation = statement.explanation;

          isCorrect = correctionsList.some(
            correctAns => normalizeText(correctAns) === normalizedInput
          );
        }
      }

      if (isCorrect) score += 1;

      // Run detailed rule evaluation
      const grammarAnalysis = analyzeGrammar(statementId, correctedText);

      gradedCorrections.push({
        statementId,
        originalText,
        correctedText,
        isCorrect,
        explanation,
        grammarAnalysis
      });
    }

    const overallCorrect = score === gradedCorrections.length;

    let submissionId = `sub_${Date.now()}`;

    if (!isMock) {
      // Save to MongoDB using mongoose
      const mongoCorrections = gradedCorrections.map(c => ({
        statementId: c.statementId,
        originalText: c.originalText,
        correctedText: c.correctedText,
        isCorrect: c.isCorrect
      }));

      const newSubmission = await Submission.create({
        user: req.user.id,
        corrections: mongoCorrections,
        score,
        overallCorrect
      });
      submissionId = newSubmission._id;
    } else {
      // Save to mock storage
      const mockSubmission = {
        id: submissionId,
        userId: req.user.id,
        corrections: gradedCorrections.map(c => ({
          statementId: c.statementId,
          originalText: c.originalText,
          correctedText: c.correctedText,
          isCorrect: c.isCorrect
        })),
        score,
        overallCorrect,
        submittedAt: new Date()
      };
      mockDb.submissions.push(mockSubmission);
    }

    return res.json({
      submissionId,
      score,
      totalStatements: gradedCorrections.length,
      overallCorrect,
      corrections: gradedCorrections,
      message: overallCorrect 
        ? "Congratulations! All statements are completely error-free."
        : `Some corrections were incorrect. You scored ${score} out of ${gradedCorrections.length}.`
    });

  } catch (error) {
    console.error('submitCorrections error:', error);
    return res.status(500).json({ message: 'Server error processing corrections' });
  }
};
