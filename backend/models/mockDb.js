const bcrypt = require('bcryptjs');

// Seed statements with expected correct versions and helpful grammar tips
const initialStatements = [
  {
    id: "s1",
    text: "She dont have any idea how to fix it.",
    corrections: [
      "She doesn't have any idea how to fix it.",
      "She does not have any idea how to fix it."
    ],
    explanation: "Use singular third-person subject agreement ('doesn't' or 'does not' instead of 'dont') and end with a period.",
    errors: [
      { type: "spelling/grammar", description: "Use singular third-person contraction 'doesn't' or 'does not' instead of 'dont' to match 'She'." },
      { type: "punctuation", description: "Sentences must conclude with a period ('.')." }
    ]
  },
  {
    id: "s2",
    text: "The dogs chased it's tail around in circles.",
    corrections: [
      "The dog chased its tail around in circles."
    ],
    explanation: "Use possessive 'its' instead of the contraction 'it's' (it is) and align third-person singular noun agreement ('dog' -> 'its tail').",
    errors: [
      { type: "grammar", description: "Change 'it's' to possessive 'its' to indicate ownership." },
      { type: "grammar", description: "Match the singular pronoun 'its' with singular 'dog'." }
    ]
  },
  {
    id: "s3",
    text: "We should of gone to the store earlier.",
    corrections: [
      "We should have gone to the store earlier.",
      "We should've gone to the store earlier."
    ],
    explanation: "Use the correct modal helper verb 'should have' (or contraction 'should've') instead of 'should of'.",
    errors: [
      { type: "spelling/grammar", description: "Replace 'should of' with 'should have' (or 'should've') for correct conditional past tense." }
    ]
  }
];

const users = [];
const submissions = [];
const statements = [...initialStatements];

// Helper to seed standard mock user for testing if needed
const seedMockUser = async () => {
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    users.push({
      id: "u1",
      username: "testuser",
      password: hashedPassword,
      createdAt: new Date()
    });
  }
};

seedMockUser();

module.exports = {
  users,
  statements,
  submissions,
  initialStatements
};
