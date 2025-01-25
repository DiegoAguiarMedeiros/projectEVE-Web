import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RegistrationView } from 'src/sections/registration';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Cadastro - ${CONFIG.appName}`}</title>
      </Helmet>

      <RegistrationView />
    </>
  );
}
