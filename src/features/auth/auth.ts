import {
  createAuthLogin,
  createAuthRegister,
  getUsersCurrent,
  LoginRequest,
  RegisterRequest,
} from '@/api/api.gen';
import { getAccessToken, setAccessToken } from '@/api/bootstrap-fetch-client';
import { store } from '@/redux/store';
import { addUser } from '@/redux/user.slice';

const fetchAndSetCurrentUser = async (): Promise<void> => {
  const user = await getUsersCurrent();
  store.dispatch(addUser(user));
};

export const signUp = async (credentials: RegisterRequest): Promise<void> => {
  const { token } = await createAuthRegister(credentials);

  if (token) {
    setAccessToken(token);
  }

  await fetchAndSetCurrentUser();
};

export const signIn = async (credentials: LoginRequest): Promise<void> => {
  const { token } = await createAuthLogin(credentials);

  if (token) {
    setAccessToken(token);
  }

  await fetchAndSetCurrentUser();
};

export const signOut = (): void => {
  setAccessToken(null);
  store.dispatch(addUser(null as never));
};

export const refreshUser = async (): Promise<void> => {
  const token = getAccessToken();

  if (!token) {
    return;
  }

  try {
    await fetchAndSetCurrentUser();
  } catch {
    setAccessToken(null);
  }
};
