import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';

export interface AuthUser {
  username: string;
  userId: string;
  email: string;
}

export async function login(email: string, password: string): Promise<void> {
  await signIn({ username: email, password });
}

export async function register(email: string, password: string): Promise<void> {
  await signUp({
    username: email,
    password,
    options: {
      userAttributes: { email },
    },
  });
}

export async function logout(): Promise<void> {
  await signOut();
}
// Here it retrieves the Cognito JWT which is attached to every API request in api.ts for backend auth.

export async function getIdToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() ?? null;
  } catch {
    return null;
  }
}

// This fetches user identity and attributes in parallel, merged into the AuthUser shape.

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  try {
    const [user, attributes] = await Promise.all([getCurrentUser(), fetchUserAttributes()]);
    return { username: user.username, userId: user.userId, email: attributes.email ?? user.username };
  } catch {
    return null;
  }
}