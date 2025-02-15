import { CONFIG } from 'src/config-global';

import { EnvelopeView } from 'src/sections/envelope/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
        <title> {`Envelope - ${CONFIG.appName}`}</title>

      <EnvelopeView />
    </>
  );
}
