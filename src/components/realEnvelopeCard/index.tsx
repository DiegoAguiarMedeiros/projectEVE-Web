import React from 'react';
import { Card, Box, Typography, IconButton, Switch, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { getContrastColor, adjustBrightness } from 'src/utils/colorUtils';
import { useNavigate } from "react-router-dom";
import { fCurrency, fNumberToCurrency } from 'src/utils/format-number';
import { useTranslation } from "react-i18next";
import { Envelopes } from 'src/types/Envelopes';


interface RealEnvelopesCardProps {
    envelope: Envelopes;
    activeCard: boolean;
    fullWidth?: boolean;
}

export const RealEnvelopesCard: React.FC<RealEnvelopesCardProps> = ({ envelope, activeCard, fullWidth }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const textColor = getContrastColor(envelope.color);
    const used = envelope?.used ?? 0;

    const finalColor = alpha(envelope.color, 0.7);
    const cardHeight = fullWidth ? 130 : 140;
    const flapHeight = (cardHeight * 0.5) - 2;

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                minHeight: cardHeight,
                maxHeight: cardHeight,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                transform: activeCard ? 'scale(1.06)' : 'scale(0.96)',
                opacity: activeCard ? 1 : 0.7,
                boxShadow: 'none',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, opacity 0.3s ease',
                px: fullWidth ? 1 : 0,
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: fullWidth ? 300 : 240,
                    minHeight: cardHeight,
                    position: 'relative',
                    overflow: 'visible',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    mx: 'auto',
                }}
            >
                {/* Envelope Base (Back/Inside) - Same Color */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.55)',
                        borderRadius: '8px',
                        zIndex: 0,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: finalColor,
                        borderRadius: '8px',
                        zIndex: 1,
                    }}
                />

                {/* Envelope Flap (Triangle) - Same Color + Strong Shadow for the V */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: '2%',
                        width: '96%',
                        height: flapHeight,
                        zIndex: 3,
                        borderRadius: '8px',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.55))',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: finalColor,
                            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                            borderRadius: '4px',
                        }}
                    />
                </Box>

                {/* Envelope Body (Bottom Pockets visual) - Same Color */}
                {/* Left Triangle */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 2,
                        borderRadius: '8px',
                        backgroundColor: finalColor,
                        clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
                    }}
                />
                {/* Right Triangle */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 2,
                        borderRadius: '8px',
                        backgroundColor: finalColor,
                        clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
                    }}
                />
                {/* Bottom Triangle (Main Face) */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 2,
                        borderRadius: '8px',
                        backgroundColor: finalColor,
                        clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)',
                    }}
                />

                {/* Content Layer */}
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 11,
                        p: 2,
                        pt: `${flapHeight + 8}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        height: cardHeight,
                        borderRadius: '8px',
                        color: textColor
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, fontSize: '1rem', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                            {t(envelope.name)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.9 }}>
                            {fNumberToCurrency(envelope.amount)}
                        </Typography>
                    </Box>

                    {/* Custom Progress Bar with Dual Layer Text */}
                    <Box
                        sx={{
                            width: '100%',
                            height: 18,
                            bgcolor: 'rgba(255,255,255,0.4)',
                            borderRadius: 1,
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                        }}
                    >
                        {/* Background Text */}
                        <Typography
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '0.70rem',
                                fontWeight: 800,
                                color: textColor,
                                zIndex: 0,
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                                opacity: 0.8
                            }}
                        >
                            {envelope?.used}%
                        </Typography>

                        {/* Foreground Bar */}
                        <Box
                            sx={{
                                height: '100%',
                                width: `${envelope?.used}%`,
                                bgcolor: textColor, // Use text color for high contrast bar
                                borderRadius: 1,
                                transition: 'width 0.5s ease-out',
                                position: 'relative',
                                overflow: 'hidden',
                                zIndex: 1,
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
                                        fontSize: '0.70rem',
                                        fontWeight: 800,
                                        color: envelope.color, // Inverse color
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
            </Card>
        </Box>
    );
};
