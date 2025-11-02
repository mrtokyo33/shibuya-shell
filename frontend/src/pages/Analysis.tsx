import React from 'react'
import { useNavigate } from 'react-router-dom'
import { colors } from '../theme/colors'

export function Analysis() {
    const navigate = useNavigate()

    const backButtonStyle: React.CSSProperties = {
        position: 'fixed',
        top: '48px',
        left: '32px',
        background: colors.background.glass,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${colors.glass.border}`,
        borderRadius: '12px',
        padding: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        color: colors.accent.purple,
    }

    return (
        <div style={{
            padding: '32px',
            fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
        }}>
            <button
                style={backButtonStyle}
                onClick={() => navigate('/')}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.glass.borderHover
                    e.currentTarget.style.boxShadow = `0 0 20px rgba(124, 93, 255, 0.15)`
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.glass.border
                    e.currentTarget.style.boxShadow = 'none'
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </button>

            <h1 style={{
                fontSize: '32px',
                fontWeight: '400',
                color: colors.text.primary,
                marginBottom: '16px',
                marginTop: '48px',
            }}>
                Analysis
            </h1>
            <p style={{ color: colors.text.secondary }}>
                Data analysis tools coming soon...
            </p>
        </div>
    )
}
