import React from 'react';
import { Check, X, RotateCcw, AlertTriangle, CheckCircle, RefreshCw, Trophy, BookOpen, HelpCircle } from 'lucide-react';

function ResultPage({ result, onRetry, onResetAll }) {
  if (!result) return null;

  const { score, totalStatements, overallCorrect, corrections, message } = result;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Score Summary Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          background: overallCorrect 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(20, 13, 33, 0.8))'
            : 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(20, 13, 33, 0.8))',
          borderColor: overallCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}
      >
        {/* Score Circle & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          
          {/* Radial circular score indicator */}
          <div 
            style={{
              position: 'relative',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: `conic-gradient(${overallCorrect ? 'hsl(var(--success-glow))' : 'hsl(var(--warning-glow))'} ${score * 120}deg, rgba(255,255,255,0.06) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 25px ${overallCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)'}`
            }}
          >
            <div 
              style={{
                width: '82px',
                height: '82px',
                borderRadius: '50%',
                background: 'hsl(var(--bg-deep-obsidian))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>/ {totalStatements}</span>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>
              {overallCorrect ? 'Grammar Perfect!' : 'Almost There!'}
            </h2>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem', maxWidth: '480px', lineHeight: 1.4 }}>
              {message} {overallCorrect 
                ? 'Your corrections met all spelling, punctuation, capitalization, and grammar rules.' 
                : 'Check the checklists below to see which specific rules you missed.'}
            </p>
          </div>
        </div>

        {/* Dynamic Badge */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            borderRadius: '16px',
            background: overallCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            color: overallCorrect ? 'hsl(var(--success-glow))' : 'hsl(var(--warning-glow))',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: `inset 0 0 10px ${overallCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'}`
          }}
        >
          {overallCorrect ? <Trophy size={20} /> : <AlertTriangle size={20} />}
          <span>{overallCorrect ? '100% ERROR-FREE' : 'NEEDS TWEAKING'}</span>
        </div>
      </div>

      {/* 2. Detailed Checklist Breakdown */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} /> Sentence Analysis Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {corrections.map((c, index) => (
            <div 
              key={c.statementId}
              className="glass-panel"
              style={{
                padding: '2rem',
                borderRadius: '20px',
                borderLeft: `4px solid ${c.isCorrect ? 'hsl(var(--success-glow))' : 'hsl(var(--error-glow))'}`
              }}
            >
              {/* Header: Status and label */}
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: '0.75rem'
                }}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white' }}>
                  Sentence #{index + 1}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {c.isCorrect ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'hsl(var(--success-glow))', fontSize: '0.85rem', fontWeight: 700 }}>
                      <CheckCircle size={15} /> Error-Free
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'hsl(var(--error-glow))', fontSize: '0.85rem', fontWeight: 700 }}>
                      <X size={15} /> Errors Remaining
                    </div>
                  )}
                </div>
              </div>

              {/* Text Comparison Box */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '1.5rem',
                  marginBottom: '1.5rem'
                }}
              >
                {/* User Input Column */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
                    Your Submission
                  </div>
                  <p style={{ fontSize: '1.05rem', color: 'white', fontWeight: 500, fontStyle: 'italic', background: 'rgba(0,0,0,0.12)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    "{c.correctedText}"
                  </p>
                </div>

                {/* Original/Explanation Column */}
                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                      Original text
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', textDecoration: 'line-through', opacity: 0.6 }}>
                      "{c.originalText}"
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--primary-glow))', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                      Grammar Tip
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.4 }}>
                      {c.explanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rules Checklist Panel */}
              <div 
                style={{ 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid rgba(255,255,255,0.04)', 
                  borderRadius: '12px', 
                  padding: '1.25rem 1.5rem' 
                }}
              >
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HelpCircle size={14} color="hsl(var(--primary-glow))" /> Grading Criteria Checklist:
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                  {c.grammarAnalysis && c.grammarAnalysis.map((rule, rIdx) => (
                    <div 
                      key={rIdx}
                      style={{
                        background: 'rgba(0,0,0,0.1)',
                        border: `1px solid ${rule.passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'}`,
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                      }}
                    >
                      <div 
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: rule.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '2px',
                          flexShrink: 0
                        }}
                      >
                        {rule.passed ? (
                          <Check size={12} color="hsl(var(--success-glow))" strokeWidth={3} />
                        ) : (
                          <X size={12} color="hsl(var(--error-glow))" strokeWidth={3} />
                        )}
                      </div>
                      
                      <div>
                        <span 
                          style={{ 
                            fontSize: '0.85rem', 
                            fontWeight: 600, 
                            color: rule.passed ? 'white' : 'hsl(var(--text-secondary))',
                            display: 'block'
                          }}
                        >
                          {rule.rule}
                        </span>
                        {!rule.passed && (
                          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--error-glow))', display: 'block', marginTop: '2px', opacity: 0.8 }}>
                            Tip: {rule.hint}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 3. Action controls */}
      <div 
        className="glass-panel"
        style={{
          padding: '1.5rem 2rem',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap'
        }}
      >
        <button 
          className="btn btn-secondary" 
          onClick={onResetAll}
          style={{ padding: '0.85rem 1.5rem', borderRadius: '12px' }}
        >
          <RotateCcw size={16} />
          Reset Test
        </button>

        {!overallCorrect && (
          <button 
            className="btn btn-primary" 
            onClick={onRetry}
            style={{ 
              padding: '0.85rem 2rem', 
              borderRadius: '12px',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' 
            }}
          >
            <RefreshCw size={16} className="animate-spin-slow" />
            Fix Remaining Errors
          </button>
        )}
      </div>

    </div>
  );
}

export default ResultPage;
