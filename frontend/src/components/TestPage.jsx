import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, BookOpen, Check, X, Award, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';

const quizStatements = [
  {
    id: "s1",
    originalText: "She dont have any idea how to fix it.",
    question: "Choose the correct version of Statement #1:",
    options: [
      { text: "She dont have any idea how to fix it.", isCorrect: false },
      { text: "She doesn't have any idea how to fix it", isCorrect: false },
      { text: "She doesn't have any idea how to fix it.", isCorrect: true }
    ],
    explanation: "Why Option 3 is correct:\n• 'doesn't' is the correct singular third-person contraction (does not) agreeing with the subject 'She'. 'dont' lacks proper singular agreement.\n• The sentence must conclude with a period (.) for correct end punctuation."
  },
  {
    id: "s2",
    originalText: "The dogs chased it's tail around in circles.",
    question: "Choose the correct version of Statement #2:",
    options: [
      { text: "The dogs chased it's tail around in circles.", isCorrect: false },
      { text: "The dogs chased its tail around in circles.", isCorrect: false },
      { text: "The dog chased its tail around in circles.", isCorrect: true }
    ],
    explanation: "Why Option 3 is correct:\n• 'its' is the possessive pronoun indicating ownership of the tail. 'it's' is a contraction meaning 'it is', which would incorrectly translate to 'chased it is tail'.\n• 'dog' is singular, matching the singular possessive pronoun 'its' and singular noun 'tail' correctly."
  },
  {
    id: "s3",
    originalText: "We should of gone to the store earlier.",
    question: "Choose the correct version of Statement #3:",
    options: [
      { text: "We should of gone to the store earlier.", isCorrect: false },
      { text: "We should of gone to the store earlier", isCorrect: false },
      { text: "We should have gone to the store earlier.", isCorrect: true }
    ],
    explanation: "Why Option 3 is correct:\n• 'should have' (or contraction 'should've') is the correct modal verb structure for the past conditional. 'should of' is a common spoken misspelling and is grammatically incorrect.\n• The sentence concludes with a period (.) for proper punctuation."
  }
];

function TestPage({ onEdit }) {
  const [isTesting, setIsTesting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // 0, 1, 2 = statements; 3 = Score Card
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [sId]: optionIndex }
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleNext = () => {
    if (currentIndex < quizStatements.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSelectOption = (sId, optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [sId]: optionIdx
    }));
  };

  const calculateScore = () => {
    let score = 0;
    quizStatements.forEach(s => {
      const selectedIdx = selectedAnswers[s.id];
      if (selectedIdx !== undefined && s.options[selectedIdx].isCorrect) {
        score += 1;
      }
    });
    return score;
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowAnalysis(false);
  };

  // --- View 1: Splash Dashboard Screen (Centered Dark Slate Card) ---
  if (!isTesting) {
    return (
      <div 
        className="fade-in" 
        style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '2rem 0',
          minHeight: 'calc(100vh - 130px)' // Takes full available page height below header
        }}
      >
        <div 
          style={{
            width: '100%',
            maxWidth: '620px',
            minHeight: '520px',
            padding: '3.5rem 3.5rem',
            borderRadius: '16px',
            background: '#545C68', // Lighter elegant slate gray matching the mockup exactly
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35), 0 20px 40px -10px rgba(94, 47, 116, 0.15)', // Premium multi-layered shadow
            border: '1px solid rgba(255, 255, 255, 0.15)', // Subtle glossy rim
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '2.5rem'
          }}
        >
          {/* Mockup Heading */}
          <div style={{ textAlign: 'left', width: '100%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Test 1
            </h2>
          </div>

          {/* Mockup 3 Underlined Sentences */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.25rem' }}>
            {quizStatements.map((s, idx) => (
              <div 
                key={s.id} 
                style={{ 
                  color: '#EDF2F7', 
                  fontSize: '0.95rem', 
                  fontWeight: 500,
                  padding: '1.25rem 0.25rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.25)', // Thin line underneath sentence
                  textAlign: 'left'
                }}
              >
                {s.originalText}
              </div>
            ))}
          </div>

          {/* Centered Edit Button */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <button 
              onClick={onEdit}
              style={{
                background: '#E2E8F0', // Soft light gray pill button matching mockup exactly
                color: '#4A5568',
                border: 'none',
                borderRadius: '8px', // Border-radius matching submit button
                padding: '0.65rem 3.5rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#CBD5E0';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#E2E8F0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Edit
            </button>
          </div>

        </div>
      </div>
    );
  }

  // --- View 2: Active Multiple Choice Flashcards (Single Compact White Card) ---
  if (currentIndex < quizStatements.length) {
    const s = quizStatements[currentIndex];
    const selectedIdx = selectedAnswers[s.id];

    return (
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
        <div 
          style={{
            width: '100%',
            maxWidth: '480px', // Matching login card exactly
            minHeight: '380px', // More compact vertical size
            background: '#545C68', // Lighter elegant slate gray matching mockup exactly
            borderRadius: '16px',
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35), 0 20px 40px -10px rgba(94, 47, 116, 0.15)', // Premium multi-layered shadow
            border: '1px solid rgba(255, 255, 255, 0.15)', // Subtle glossy rim
            padding: '2.5rem 2.25rem', // Compact elegant padding
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem',
            position: 'relative'
          }}
          key={currentIndex}
        >
          {/* Integrated Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#E2E8F0' }}>
              Statement {currentIndex + 1} of {quizStatements.length}
            </span>
            <button 
              onClick={handleRetry}
              style={{ 
                background: 'none',
                border: 'none',
                color: '#CBD5E1',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.target.style.color = '#CBD5E1'}
            >
              Reset Test
            </button>
          </div>

          {/* Original Statement (Incorrect) */}
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#EDF2F7', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem', letterSpacing: '0.5px' }}>
              Original Text
            </span>
            <blockquote 
              style={{ 
                fontSize: '0.95rem', 
                fontWeight: 600, 
                color: '#FFFFFF', 
                borderLeft: '3px solid #EF4444', 
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.6rem 0.85rem',
                borderRadius: '0 8px 8px 0',
                fontStyle: 'italic'
              }}
            >
              "{s.originalText}"
            </blockquote>
          </div>

          {/* Question / Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
              <HelpCircle size={14} color="#FFFFFF" /> {s.question}
            </div>
            
            {s.options.map((opt, oIdx) => {
              const isSelected = selectedIdx === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectOption(s.id, oIdx)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.12)'}`,
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  <div 
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)'}`,
                      background: isSelected ? '#FFFFFF' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isSelected && <Check size={9} color="#545C68" strokeWidth={3} />}
                  </div>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Integrated Card Footer Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{ 
                opacity: currentIndex === 0 ? 0.35 : 1,
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.45rem 0.85rem', 
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              <ChevronLeft size={12} />
              Previous
            </button>

            <span style={{ fontSize: '0.75rem', color: '#E2E8F0', fontWeight: 700 }}>
              {currentIndex + 1} of {quizStatements.length}
            </span>

            <button 
              onClick={handleNext}
              disabled={selectedIdx === undefined}
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.45rem 1.1rem', 
                borderRadius: '8px',
                border: 'none',
                background: selectedIdx === undefined ? 'rgba(255, 255, 255, 0.05)' : '#E2E8F0',
                color: selectedIdx === undefined ? 'rgba(255, 255, 255, 0.3)' : '#4A5568',
                fontSize: '0.75rem',
                fontWeight: 700,
                opacity: selectedIdx === undefined ? 0.4 : 1,
                cursor: selectedIdx === undefined ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedIdx !== undefined) e.target.style.background = '#CBD5E0';
              }}
              onMouseLeave={(e) => {
                if (selectedIdx !== undefined) e.target.style.background = '#E2E8F0';
              }}
            >
              {currentIndex === quizStatements.length - 1 ? 'Finish Challenge' : 'Next'}
              <ChevronRight size={12} />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // --- View 3: Card #4 - Score Flashcard & Detailed Analysis (Centered White Cards) ---
  const finalScore = calculateScore();
  const isPerfect = finalScore === quizStatements.length;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '680px', margin: '0 auto', width: '100%', padding: '2rem 0' }}>
      
      {/* Visual score card */}
      <div 
        style={{
          width: '100%',
          minHeight: '520px',
          padding: '4.5rem 3rem',
          borderRadius: '16px',
          background: '#545C68', // Lighter elegant slate gray matching mockup exactly
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35), 0 20px 40px -10px rgba(94, 47, 116, 0.15)', // Premium multi-layered shadow
          border: '1px solid rgba(255, 255, 255, 0.15)', // Subtle glossy rim
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Trophy icon */}
        <div 
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: isPerfect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}
        >
          <Award size={34} color={isPerfect ? '#10B981' : '#FFFFFF'} />
        </div>

        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.5px', color: '#FFFFFF' }}>
          Your Score Report
        </h2>

        {/* Circular radial score */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <div 
            style={{
              position: 'relative',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `conic-gradient(${isPerfect ? '#10B981' : '#FFFFFF'} ${finalScore * 120}deg, rgba(255,255,255,0.1) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
            }}
          >
            <div 
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#545C68', // Matches card background
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>{finalScore}</span>
              <span style={{ fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>/ {quizStatements.length}</span>
            </div>
          </div>
        </div>

        <p style={{ color: '#EDF2F7', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
          {isPerfect 
            ? "Congratulations! You recognized all the correct statements perfectly."
            : `You scored ${finalScore} out of ${quizStatements.length}. Click the Analysis button below to check your errors.`}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <button 
            className="btn"
            onClick={handleRetry}
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px', // Rectangular pill style
              padding: '0.75rem 2rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.25s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            <RefreshCw size={14} />
            Re-Take Test
          </button>
          
          <button 
            className="btn"
            onClick={() => setShowAnalysis(!showAnalysis)}
            style={{ 
              background: '#E2E8F0', // Clean rectangular button matching Submit
              color: '#4A5568',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 2.25rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.25s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={(e) => e.target.style.background = '#CBD5E0'}
            onMouseLeave={(e) => e.target.style.background = '#E2E8F0'}
          >
            <BookOpen size={14} />
            {showAnalysis ? 'Hide Analysis' : 'Detailed Analysis'}
          </button>
        </div>
      </div>

      {/* --- Detailed Grammar Analysis Section (Centered White Cards) --- */}
      {showAnalysis && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            <AlertCircle size={16} /> Explanation of Corrections
          </h3>

          {quizStatements.map((s, index) => {
            const userChoiceIdx = selectedAnswers[s.id];
            const isUserCorrect = s.options[userChoiceIdx]?.isCorrect;

            return (
              <div 
                key={s.id} 
                style={{
                  width: '100%',
                  padding: '2.5rem 2.5rem',
                  borderRadius: '16px',
                  background: '#545C68', // Lighter elegant slate gray matching mockup exactly
                  boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35), 0 20px 40px -10px rgba(94, 47, 116, 0.15)', // Premium multi-layered shadow
                  border: '1px solid rgba(255, 255, 255, 0.15)', // Subtle glossy rim
                  borderLeft: `4px solid ${isUserCorrect ? '#10B981' : '#EF4444'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>Sentence #{index + 1} Analysis</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isUserCorrect ? '#10B981' : '#EF4444' }}>
                    {isUserCorrect ? 'CORRECT' : 'INCORRECT'}
                  </span>
                </div>

                {/* Original */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EDF2F7', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                    Original Text:
                  </span>
                  <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#CBD5E1', textDecoration: 'line-through', opacity: 0.7 }}>
                    "{s.originalText}"
                  </p>
                </div>

                {/* MCQ Options visual comparison */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EDF2F7', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                    Options Comparison:
                  </span>
                  
                  {s.options.map((opt, oIdx) => {
                    const isChosen = userChoiceIdx === oIdx;
                    
                    let cardBg = 'rgba(255,255,255,0.04)';
                    let cardBorder = 'rgba(255,255,255,0.12)';
                    let badge = null;

                    if (opt.isCorrect) {
                      cardBg = 'rgba(16, 185, 129, 0.08)';
                      cardBorder = 'rgba(16, 185, 129, 0.3)';
                      badge = (
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <img src="/Group 3.png" alt="Correct" style={{ width: '12px', height: '12px', objectFit: 'contain' }} /> Correct Answer
                        </span>
                      );
                    } else if (isChosen && !opt.isCorrect) {
                      cardBg = 'rgba(239, 68, 68, 0.08)';
                      cardBorder = 'rgba(239, 68, 68, 0.3)';
                      badge = (
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#EF4444', background: 'rgba(239, 68, 68, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <img src="/Group 5.png" alt="Incorrect" style={{ width: '12px', height: '12px', objectFit: 'contain' }} /> Your Choice (Incorrect)
                        </span>
                      );
                    }

                    return (
                      <div 
                        key={oIdx}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          background: cardBg,
                          border: `1px solid ${cardBorder}`,
                          fontSize: '0.85rem',
                          color: '#FFFFFF',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1rem',
                          opacity: isChosen || opt.isCorrect ? 1 : 0.45
                        }}
                      >
                        <span style={{ fontWeight: isChosen ? 700 : 500 }}>
                          Option {oIdx + 1}: "{opt.text}"
                        </span>
                        {badge}
                      </div>
                    );
                  })}
                </div>

                {/* Grammar Explanation Box */}
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '1rem 1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                    Grammar Analysis Breakdown:
                  </span>
                  <p style={{ fontSize: '0.85rem', color: '#EDF2F7', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                    {s.explanation}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default TestPage;
