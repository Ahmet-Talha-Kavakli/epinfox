import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/** Google OAuth dönüş noktası — Clerk session'ı tamamlar, sonra ana sayfaya. */
export default function SSOCallback() {
  return <AuthenticateWithRedirectCallback signInForceRedirectUrl="/" signUpForceRedirectUrl="/" />;
}
