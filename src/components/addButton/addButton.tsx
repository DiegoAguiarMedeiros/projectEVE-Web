import { Add } from "@mui/icons-material";
import { Portal, Fab } from "@mui/material";
import { t } from "i18next";
import { Dispatch, SetStateAction } from "react";

type AddButtonProps = {
    onClick: Dispatch<SetStateAction<boolean>>;
}

export default function AddButton({ onClick }: AddButtonProps) {
    return (<Portal>
        <Fab
            aria-label={t('common.add')}
            sx={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 1300,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
            }}
            onClick={() => onClick(true)}
        >
            <Add />
        </Fab>
    </Portal>)
}