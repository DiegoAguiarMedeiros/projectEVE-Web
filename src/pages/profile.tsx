
import { CONFIG } from "src/config-global";
import { ProfileView } from "src/sections/profile/view/profile-view";

export default function Page() {
    return (
        <>
            <title> {`Meu Perfil - ${CONFIG.appName}`}</title>
            <ProfileView />
        </>
    );
}
