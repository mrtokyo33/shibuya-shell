import React from 'react';
import { colors } from '../theme/colors';

export const Background: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      background: colors.background.abyss,
    }}>
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(124, 93, 255, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(124, 93, 255, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(100, 80, 200, 0.05) 0%, transparent 60%)
        `,
        animation: 'aurora 30s ease-in-out infinite',
      }}>
        <div style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          top: '-25%',
          left: '-25%',
          background: `
            radial-gradient(ellipse at 60% 40%, rgba(124, 93, 255, 0.04) 0%, transparent 40%),
            radial-gradient(ellipse at 30% 80%, rgba(100, 80, 200, 0.05) 0%, transparent 45%)
          `,
          animation: 'aurora2 40s ease-in-out infinite reverse',
        }} />
      </div>
      <style>{`
        @keyframes aurora {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          33% {
            transform: translate(20px, -30px) scale(1.05);
            opacity: 0.8;
          }
          66% {
            transform: translate(-30px, 20px) scale(0.95);
            opacity: 0.9;
          }
        }
        @keyframes aurora2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translate(30px, 30px) rotate(90deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
