import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export function getAuthErrorMessage(error: string): string {
  switch (error) {
    case "CredentialsSignin":
      return "Invalid email or password";
    case "OAuthSignin":
      return "OAuth sign in failed";
    case "OAuthCallback":
      return "OAuth callback failed";
    case "OAuthCreateAccount":
      return "Could not create OAuth account";
    case "EmailCreateAccount":
      return "Could not create email account";
    case "Callback":
      return "Callback error";
    case "OAuthAccountNotLinked":
      return "Email already exists with different provider";
    case "EmailSignin":
      return "Email sign in failed";
    case "CredentialsCreateAccount":
      return "Could not create credentials account";
    case "SessionRequired":
      return "Session required";
    default:
      return "An error occurred during authentication";
  }
}

export function isAuthError(error: string): boolean {
  const authErrors = [
    "CredentialsSignin",
    "OAuthSignin", 
    "OAuthCallback",
    "OAuthCreateAccount",
    "EmailCreateAccount",
    "Callback",
    "OAuthAccountNotLinked",
    "EmailSignin",
    "CredentialsCreateAccount",
    "SessionRequired"
  ];
  return authErrors.includes(error);
} 