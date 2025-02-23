import { getGoogleOAuthURL } from "@/utils/google-o-auth";

export default function ScopeError() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">Scope Error</h1>
      <p className="text-sm mb-6">
        You need to grant the required scopes to use this application. Please grant the required scopes.
    </p>
      <a href={getGoogleOAuthURL()}>Link YouTube Account</a>
    </div>
  );
}
