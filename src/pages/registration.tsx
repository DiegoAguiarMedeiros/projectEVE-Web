import { CONFIG } from "src/config-global";

import { RegistrationView } from "src/sections/registration";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
        <title> {`Cadastro - ${CONFIG.appName}`}</title>

      <RegistrationView />
    </>
  );
}
