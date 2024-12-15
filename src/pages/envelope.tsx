import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EnvelopeView } from 'src/sections/envelope/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Envelope - ${CONFIG.appName}`}</title>
      </Helmet>

      <EnvelopeView />
    </>
  );
}
