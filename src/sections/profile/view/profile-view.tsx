
import Grid from "@mui/material/Grid2";
import { DashboardContent } from "src/layouts/dashboard";
import { ProfileInfoForm } from "../profile-info-form";
import { ProfilePasswordForm } from "../profile-password-form";
import { ProfileAppearanceSettings } from "../profile-appearance-settings";
import { ProfileLocaleSettings } from "../profile-locale-settings";
import { ProfileFormatSettings } from "../profile-format-settings";
import { ProfileDeleteAccount } from "../profile-delete-account";

export function ProfileView() {
    return (
        <DashboardContent sx={{ p: 1 }}>
            <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ProfileInfoForm sx={{ flex: 1 }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ProfilePasswordForm sx={{ flex: 1 }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ProfileAppearanceSettings sx={{ flex: 1 }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ProfileLocaleSettings sx={{ flex: 1 }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, lg: 4 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ProfileFormatSettings sx={{ flex: 1 }} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <ProfileDeleteAccount />
                </Grid>
            </Grid>
        </DashboardContent>
    );
}
