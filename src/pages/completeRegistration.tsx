import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CompleteRegistrationView } from 'src/sections/completeRegistration';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Completar cadastro - ${CONFIG.appName}`}</title>
      </Helmet>

      <CompleteRegistrationView />
    </>
  );
}
