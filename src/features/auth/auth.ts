import {
  createAuthLogin,
  createAuthRegister,
  getUsersCurrent,
  LoginRequest,
  RegisterRequest,
} from '@/api/api.gen';
import { setAccessToken } from '@/api/bootstrap-fetch-client';
import { store } from '@/redux/store';
import { addUser } from '@/redux/user.slice';

export const signUp = async (credentials: RegisterRequest): Promise<void> => {
  const { token } = await createAuthRegister(credentials);

  if (token) {
    setAccessToken(token);
  }

  const user = await getUsersCurrent();
  store.dispatch(addUser(user));
};

export const signIn = async (credentials: LoginRequest): Promise<void> => {
  const { token } = await createAuthLogin(credentials);

  if (token) {
    setAccessToken(token);
  }

  const user = await getUsersCurrent();
  store.dispatch(addUser(user));
};

export const signOut = (): void => {
  setAccessToken(null);
  store.dispatch(addUser(null as never));
};
