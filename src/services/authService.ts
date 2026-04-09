import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export interface AuthUser {
  username: string;
  userId: string;
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

export async function getIdToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  try {
    const user = await getCurrentUser();
    return { username: user.username, userId: user.userId };
  } catch {
    return null;
  }
}