import React, { useState } from 'react';
import { Check, X, RotateCcw, RefreshCw, BookOpen } from 'lucide-react';

function ResultPage({ result, username, onRetry, onResetAll }) {
  const [showDetailed, setShowDetailed] = useState(false);

  if (!result) return null;

  const { score, totalStatements, overallCorrect, corrections, message } = result;

  // Helper to calculate corrected errors out of 5 across all 3 statements
  const calculateErrorsCorrected = (corrections) => {
    let correctedCount = 0;
    
    corrections.forEach(c => {
      const norm = (c.correctedText || '').trim().replace(/\s+/g, ' ');
      
      if (c.statementId === 's1' || c.statementId.toString().includes('s1')) {
        // Error 1: dont -> doesn't
        if (/\b(doesn't|does not)\b/i.test(norm)) correctedCount++;
        // Error 2: period
        if (norm.endsWith('.')) correctedCount++;
      } else if (c.statementId === 's2' || c.statementId.toString().includes('s2')) {
        // Error 3: dogs -> dog
        if (/\bdog\b/i.test(norm) && !/\bdogs\b/i.test(norm)) correctedCount++;
        // Error 4: it's -> its
        if (/\bits tail\b/i.test(norm)) correctedCount++;
      } else if (c.statementId === 's3' || c.statementId.toString().includes('s3')) {
        // Error 5: should of -> should have
        if (/\b(should have|should've)\b/i.test(norm)) correctedCount++;
      }
    });
    
    return correctedCount;
  };

  // Helper to return the correct grammatical answer for display
  const getCorrectAnswer = (id) => {
    const idStr = String(id);
    if (idStr.includes('s1')) return "She doesn't have any idea how to fix it.";
    if (idStr.includes('s2')) return "The dog chased its tail around in circles.";
    if (idStr.includes('s3')) return "We should have gone to the store earlier.";
    return "";
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Unified Score Summary & Controls Card */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '1rem 0'
        }}
      >
        <div 
          style={{
            width: '100%',
            maxWidth: '620px',
            minHeight: '520px',
            padding: '3.5rem 3.5rem',
            borderRadius: '16px',
            background: '#545C68', // Lighter elegant slate gray matching mockup exactly
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35), 0 20px 40px -10px rgba(94, 47, 116, 0.15)', // Premium multi-layered shadow
            border: '1px solid rgba(255, 255, 255, 0.15)', // Subtle glossy rim
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '2rem'
          }}
        >
          {/* Card Header Title */}
          <div style={{ textAlign: 'left', width: '100%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              <span style={{ color: '#48BB78' }}>Congratulations: </span>
              <span style={{ color: '#FFFFFF' }}>{username || 'User'}</span>
            </h2>
          </div>

          {/* Underlined Corrected Sentences */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.25rem' }}>
            {corrections.map((c, idx) => (
              <div 
                key={c.statementId || idx} 
                style={{ 
                  color: '#EDF2F7', 
                  fontSize: '0.95rem', 
                  fontWeight: 500,
                  padding: '1.25rem 0.25rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.25)', // Thin line underneath sentence
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ wordBreak: 'break-word', paddingRight: '1rem' }}>
                    {c.correctedText || '— No Correction Provided —'}
                  </span>
                  <div style={{ flexShrink: 0 }}>
                    {c.isCorrect ? (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#48BB78',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Check size={12} color="#FFFFFF" strokeWidth={4} />
                      </div>
                    ) : (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#718096', // Slate/grey circle for incorrect
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <X size={12} color="#FFFFFF" strokeWidth={4} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Show Correct Answer directly inside the card when showDetailed is true */}
                {showDetailed && (
                  <div 
                    style={{ 
                      fontSize: '0.85rem', 
                      color: '#48BB78', 
                      fontWeight: 700,
                      marginTop: '0.25rem',
                      background: 'rgba(72, 187, 120, 0.08)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(72, 187, 120, 0.15)'
                    }}
                  >
                    <span style={{ color: '#CBD5E1', marginRight: '0.35rem', fontWeight: 600 }}>Correct Answer:</span>
                    "{getCorrectAnswer(c.statementId)}"
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Centered Success Text & Unified Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '1.5rem' }}>
            <p style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              You successfully corrected <span style={{ color: '#48BB78' }}>{calculateErrorsCorrected(corrections)}/5</span> errors.
            </p>

            {/* Action Buttons Row */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              {/* Detailed Analysis Button */}
              <button 
                type="button" 
                onClick={() => setShowDetailed(!showDetailed)}
                style={{ 
                  padding: '0.65rem 1.5rem', 
                  borderRadius: '8px', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  color: '#FFFFFF', 
                  border: '1px solid rgba(255, 255, 255, 0.15)', 
                  fontSize: '0.85rem', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                <BookOpen size={14} />
                {showDetailed ? 'Hide Correct Answers' : 'Detailed Analysis'}
              </button>

              {/* Reset Test Button */}
              <button 
                onClick={onResetAll}
                style={{ 
                  padding: '0.65rem 1.5rem', 
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <RotateCcw size={14} />
                Reset Test
              </button>

              {/* Fix Remaining Errors Button */}
              {!overallCorrect && (
                <button 
                  onClick={onRetry}
                  style={{ 
                    padding: '0.65rem 1.5rem', 
                    borderRadius: '8px', 
                    border: 'none',
                    background: '#E2E8F0', // Soft light gray
                    color: '#4A5568',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'background 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#CBD5E0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#E2E8F0'}
                >
                  <RefreshCw size={14} />
                  Fix Remaining Errors
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default ResultPage;
