import React from 'react';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Card, Typography, IconButton } from '@mui/material';
import { alpha } from "@mui/material/styles";
import { Envelopes } from 'src/types/Envelopes';
import { fNumberToCurrency } from 'src/utils/format-number';
import { useTranslation } from "react-i18next";


interface EnvelopeCardProps {
    envelope: Envelopes;
    handleActiveEnvelope: (envelope: Envelopes) => void;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({ envelope, handleActiveEnvelope }) => {
    const { t } = useTranslation();
    const softenedColor = alpha(envelope.color, 0.7);

    return (<Card
        key={envelope.id}
        sx={{
            backgroundColor: (theme) => theme.palette.background.neutral,
            borderTop: 4,
            borderColor: softenedColor,
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            position: 'relative',
            '&:hover .actions': {
                opacity: 1
            }
        }}
        onClick={() => handleActiveEnvelope(envelope)}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

            <Typography variant="h6" fontWeight="bold">
                {t(envelope.name)}
            </Typography>
            <Box
                className="actions"
                sx={{
                    display: 'flex',
                    gap: 1,
                    opacity: 0,
                    transition: 'opacity 0.2s'
                }}
            >
                {/*
                <IconButton onClick={() => handleActiveEnvelope(envelope)} size="small">
                    <EditIcon fontSize="small" />
                </IconButton>
                 <IconButton onClick={() => console.log(envelope.id)} size="small" color="error">
                    <DeleteIcon fontSize="small" />
                </IconButton> */}
            </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box
                sx={{
                    flex: 1,
                    height: 18,
                    bgcolor: `${envelope.color}20`,
                    borderRadius: 1,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        width: `${envelope.percentage}%`,
                        bgcolor: softenedColor,
                        borderRadius: 1,
                        transition: 'width 0.5s ease-out'
                    }}
                />
                <Typography
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'text.primary',
                        textShadow: '0 0 2px rgba(255,255,255,0.8)',
                        width: '100%',
                        textAlign: 'center'
                    }}
                >
                    {envelope.percentage}%
                </Typography>
            </Box>
        </Box>
    </Card>
    );
}