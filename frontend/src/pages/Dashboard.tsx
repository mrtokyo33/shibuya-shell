import React from 'react'
import { useNavigate } from 'react-router-dom'
import { colors } from '../theme/colors'

export function Dashboard() {
    const navigate = useNavigate()

    const cardStyle: React.CSSProperties = {
        background: colors.background.glass,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${colors.glass.border}`,
        borderRadius: '16px',
        padding: '48px 32px',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        textAlign: 'center',
        position: 'relative',
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.borderColor = colors.glass.borderHover
        e.currentTarget.style.boxShadow = `0 0 40px rgba(124, 93, 255, 0.15)`
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.borderColor = colors.glass.border
        e.currentTarget.style.boxShadow = 'none'
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'scale(0.98)'
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'scale(1)'
    }

    const iconStyle: React.CSSProperties = {
        fontSize: '48px',
        marginBottom: '16px',
        color: colors.accent.purple,
    }

    const settingsButtonStyle: React.CSSProperties = {
        position: 'fixed',
        top: '48px',
        right: '32px',
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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)',
            padding: '32px',
        }}>
            <button
                style={settingsButtonStyle}
                onClick={() => navigate('/settings')}
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
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                    <path d="M19.07 4.93l-4.24 4.24m-5.66 0L4.93 4.93m14.14 14.14l-4.24-4.24m-5.66 0l-4.24 4.24"></path>
                </svg>
            </button>

            <h1 style={{
                fontSize: '48px',
                fontWeight: '400',
                color: colors.text.primary,
                marginBottom: '64px',
                fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
                letterSpacing: '2px',
                textTransform: 'uppercase',
            }}>
                Shibuya Shell
            </h1>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '32px',
            }}>
                <div
                    style={cardStyle}
                    onClick={() => navigate('/ai-assistant')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    <div style={iconStyle}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '500',
                        color: colors.text.primary,
                        marginBottom: '8px',
                        fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
                    }}>
                        IA Assistant
                    </h2>
                    <p style={{
                        color: colors.text.secondary,
                        fontSize: '14px',
                        fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
                    }}>
                        Chat with AI
                    </p>
                </div>

                <div
                    style={cardStyle}
                    onClick={() => navigate('/analysis')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    <div style={iconStyle}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                    </div>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '500',
                        color: colors.text.primary,
                        marginBottom: '8px',
                        fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
                    }}>
                        Analysis
                    </h2>
                    <p style={{
                        color: colors.text.secondary,
                        fontSize: '14px',
                        fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
                    }}>
                        Analyze data
                    </p>
                </div>

                <div
                    style={cardStyle}
                    onClick={() => navigate('/report-creator')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    <div style={iconStyle}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '500',
                        color: colors.text.primary,
                        marginBottom: '8px',
                        fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
                    }}>
                        Report Creator
                    </h2>
                    <p style={{
                        color: colors.text.secondary,
                        fontSize: '14px',
                        fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
                    }}>
                        Create reports
                    </p>
                </div>
            </div>
        </div>
    )
}