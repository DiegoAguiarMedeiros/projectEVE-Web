import { CONFIG } from 'src/config-global';

import { SettingsView } from 'src/sections/settings/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
        <title> {`Configurações - ${CONFIG.appName}`}</title>

      <SettingsView />
    </>
  );
}
