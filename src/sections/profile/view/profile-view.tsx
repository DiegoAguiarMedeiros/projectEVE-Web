
import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Typography, Container, Stack } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { ProfileInfoForm } from "../profile-info-form";
import { ProfilePasswordForm } from "../profile-password-form";

export function ProfileView() {
    return (
        <DashboardContent>
            <Container sx={{ mt: 3 }}>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Meu Perfil
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProfileInfoForm />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProfilePasswordForm />
                    </Grid>
                </Grid>
            </Container>
        </DashboardContent>
    );
}
