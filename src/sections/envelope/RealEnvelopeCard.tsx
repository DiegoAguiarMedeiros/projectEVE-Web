import React from 'react';
import { Card, Box, Typography, IconButton, Switch, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Envelopes } from 'src/types/Envelopes';
import { getContrastColor, adjustBrightness } from 'src/utils/colorUtils';
import { fNumberToCurrency } from 'src/utils/format-number';

interface RealEnvelopesCardProps {
    envelope: Envelopes;
    activeCard: boolean
}

export const RealEnvelopesCard: React.FC<RealEnvelopesCardProps> = ({ envelope, activeCard }) => {
    const textColor = getContrastColor(envelope.color);
    const darkerColor = adjustBrightness(envelope.color, -15);
    const used = envelope?.used ?? 0;

    return (
        <Card
            sx={{
                boxSizing: 'border-box!important',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                minHeight: 130,
                maxHeight: 130,
                p: '10px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: darkerColor,
                color: textColor,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: activeCard ? 'scale(1.02)' : 'none',
                boxShadow: activeCard ? `0 0 0 4px ${envelope.color}, 0 12px 24px rgba(0,0,0,0.2)` : 3,
                maxWidth: 240,
                width: '100%',
                mx: 'auto',
                border: activeCard ? `2px solid ${textColor}` : 'none',
                justifyContent: 'end'
            }}
            elevation={activeCard ? 8 : 3}
        >
            {/* Flap Effect */}
            < Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />
            < Box
                className="envelope-flap"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    backgroundColor: envelope.color,
                    clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                    zIndex: 1,
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
                }}
            />

            < Box sx={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '1.1rem' }}>
                            {envelope.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, opacity: 0.9 }}>
                            {fNumberToCurrency(envelope.amount)}
                        </Typography>
                    </Box>

                    {/* Custom Progress Bar with Dual Layer Text */}
                    <Box
                        sx={{
                            width: '100%',
                            height: 18,
                            bgcolor: 'rgba(255,255,255,0.3)',
                            borderRadius: 1,
                            overflow: 'hidden',
                            backdropFilter: 'blur(4px)',
                            position: 'relative'
                        }}
                    >
                        {/* Background Text */}
                        <Typography
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: textColor,
                                zIndex: 0,
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none'
                            }}
                        >
                            {envelope?.used}%
                        </Typography>

                        {/* Foreground Bar */}
                        <Box
                            sx={{
                                height: '100%',
                                width: `${envelope?.used}%`,
                                bgcolor: textColor,
                                borderRadius: 1,
                                transition: 'width 0.5s ease-out',
                                position: 'relative',
                                overflow: 'hidden',
                                zIndex: 1
                            }}
                        >
                            {/* Foreground Text (Clipped) */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: `${used > 0 ? 10000 / used : 100}%`,
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: darkerColor,
                                        whiteSpace: 'nowrap',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    {used}%
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box >
        </Card >
    );
};
