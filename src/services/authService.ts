import { signIn, signUp, signOut, getCurrentUser } from 'aws-amplify/auth';

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

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  try {
    const user = await getCurrentUser();
    return { username: user.username, userId: user.userId };
  } catch {
    return null;
  }
}