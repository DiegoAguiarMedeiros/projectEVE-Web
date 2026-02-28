import { CONFIG } from "src/config-global";
import { VerifyEmailView } from "src/sections/verify-email";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Verificar E-mail - ${CONFIG.appName}`}</title>
      <VerifyEmailView />
    </>
  );
}
