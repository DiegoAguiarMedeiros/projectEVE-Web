import { useSearchParams } from "react-router-dom";
import { CONFIG } from "src/config-global";
import { ResetPasswordView } from "src/sections/auth";

// ----------------------------------------------------------------------

export default function Page() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <>
      <title>{`Reset Password - ${CONFIG.appName}`}</title>
      <ResetPasswordView token={token} />
    </>
  );
}
