import { CONFIG } from 'src/config-global';

import { CompleteRegistrationView } from 'src/sections/completeRegistration';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
        <title> {`Completar cadastro - ${CONFIG.appName}`}</title>

      <CompleteRegistrationView />
    </>
  );
}
