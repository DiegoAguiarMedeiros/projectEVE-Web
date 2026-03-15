
import * as React from "react";
import Grid from "@mui/material/Grid2";
import { Container } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { ProfileInfoForm } from "../profile-info-form";
import { ProfilePasswordForm } from "../profile-password-form";
import { ProfileLayoutSettings } from "../profile-layout-settings";
import { ProfileLanguageSettings } from "../profile-language-settings";
import { ProfileCurrencySettings } from "../profile-currency-settings";
import { ProfileNotificationSettings } from "../profile-notification-settings";
import { ProfileNumberFormatSettings } from "../profile-numberformat-settings";
import { ProfileDateFormatSettings } from "../profile-dateformat-settings";
import { ProfileDeleteAccount } from "../profile-delete-account";

export function ProfileView() {
    return (
        <DashboardContent sx={{ width: '99%', my: 1, mx: 'auto', p: 1 }}>
            <Container sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProfileInfoForm />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProfilePasswordForm />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProfileLayoutSettings />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProfileNotificationSettings />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProfileLanguageSettings />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProfileCurrencySettings />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProfileNumberFormatSettings />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProfileDateFormatSettings />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <ProfileDeleteAccount />
                    </Grid>
                </Grid>
            </Container>
        </DashboardContent>
    );
}
