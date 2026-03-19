import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

import { RouterLink } from "src/routes/components";
import { usePaths } from "src/hooks/usePaths";

import { SimpleLayout } from "src/layouts/simple";

// ----------------------------------------------------------------------

export function NotFoundView() {
  const { t } = useTranslation();
  const paths = usePaths();

  return (
    <SimpleLayout>
      <Container>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t("not_found_page.title")}
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          {t("not_found_page.description")}
        </Typography>

        <Box
          component="img"
          src="/assets/illustrations/illustration-404.svg"
          sx={{
            width: 320,
            height: "auto",
            my: { xs: 5, sm: 10 },
          }}
        />

        <Button component={RouterLink} href={paths.home} size="large" variant="contained" color="inherit">
          {t("not_found_page.go_home")}
        </Button>
      </Container>
    </SimpleLayout>
  );
}
