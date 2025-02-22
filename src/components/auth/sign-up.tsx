import { getGoogleOAuthURL } from "@/utils/google-o-auth";

export default function SignUp() {
  return (
    <div>
      <a href={getGoogleOAuthURL()}>Link YouTube Account</a>
    </div>
  );
}