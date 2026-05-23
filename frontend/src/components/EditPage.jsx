import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, AlertCircle, FileEdit, HelpCircle } from 'lucide-react';

function EditPage({ statements, initialValues, onBack, onSubmit }) {
  const [corrections, setCorrections] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Initialize form with initialValues or pre-populate with original text for quick editing!
  useEffect(() => {
    const defaultVals = {};
    statements.forEach(s => {
      const id = s._id || s.id;
      // Pre-fill with original text if no correction has been typed yet to make editing extremely fast and easy!
      defaultVals[id] = initialValues[id] || s.text;
    });
    setCorrections(defaultVals);
  }, [statements, initialValues]);

  const handleChange = (id, val) => {
    setCorrections(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const handleReset = (id, originalText) => {
    setCorrections(prev => ({
      ...prev,
      [id]: originalText
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Format corrections: [{ statementId, correctedText }]
    const payload = Object.keys(corrections).map(id => ({
      statementId: id,
      correctedText: corrections[id]
    }));

    try {
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={onBack} style={{ padding: '0.6rem 1rem', borderRadius: '12px' }}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Edit Workspace</h2>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>Correct all grammatical errors below</p>
          </div>
        </div>

        {/* Tip Box */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(139, 92, 246, 0.05)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            padding: '0.6rem 1rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: 'hsl(var(--text-secondary))'
          }}
        >
          <HelpCircle size={15} color="hsl(var(--primary-glow))" />
          <span>Capitalization, homophones, and end punctuation are all graded!</span>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {statements.map((s, index) => {
          const id = s._id || s.id;
          const currentText = corrections[id] || '';
          const originalText = s.text;
          const isModified = currentText !== originalText && currentText.trim() !== '';

          return (
            <div 
              key={id} 
              className="glass-panel" 
              style={{ 
                padding: '2rem 1.75rem', 
                borderRadius: '20px',
                position: 'relative'
              }}
            >
              {/* Header Label */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileEdit size={16} color="hsl(var(--primary-glow))" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>Sentence #{index + 1}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {isModified && (
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => handleReset(id, originalText)}
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', display: 'flex', gap: '0.25rem', borderRadius: '8px' }}
                    >
                      <RotateCcw size={12} /> Reset to Original
                    </button>
                  )}
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>
                    {currentText.length} chars
                  </span>
                </div>
              </div>

              {/* Text Areas Section (Double Column Layout on Wide Screens) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                
                {/* Column 1: Workspace input */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                    Your Correction
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Type your corrected version here..."
                    value={currentText}
                    onChange={(e) => handleChange(id, e.target.value)}
                    style={{ 
                      resize: 'vertical', 
                      fontSize: '1.05rem', 
                      lineHeight: '1.5',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: isModified ? '1px dashed hsl(var(--primary-glow))' : '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Column 2: Live Comparison View */}
                <div 
                  style={{ 
                    background: 'rgba(0,0,0,0.15)', 
                    border: '1px solid rgba(255,255,255,0.04)', 
                    borderRadius: '12px', 
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
                      Original (Broken Grammar)
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'hsl(var(--text-secondary))', fontStyle: 'italic', textDecoration: 'line-through', opacity: 0.65 }}>
                      "{originalText}"
                    </p>
                  </div>

                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--primary-glow))', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
                      Live Preview (Your Edit)
                    </div>
                    <p style={{ fontSize: '0.95rem', color: isModified ? 'white' : 'hsl(var(--text-muted))', fontWeight: 500 }}>
                      {currentText ? `"${currentText}"` : '— Waiting for input —'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {/* Global Submit Actions */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '1.5rem 2rem', 
            borderRadius: '20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1.5rem',
            marginTop: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} color="hsl(var(--primary-glow))" />
            <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', maxWidth: '500px' }}>
              By submitting, your corrections will be evaluated by the grammar engine. 
              You will receive detailed rule breakdown checks on the next screen.
            </p>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              padding: '0.95rem 2rem', 
              borderRadius: '14px', 
              fontSize: '1.05rem', 
              boxShadow: '0 0 25px rgba(236, 72, 153, 0.3)',
              flexShrink: 0
            }}
            disabled={submitting}
          >
            <CheckCircle2 size={18} />
            {submitting ? 'Evaluating...' : 'Grade My Corrections'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPage;
