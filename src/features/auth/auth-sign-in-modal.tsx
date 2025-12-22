import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import React, { useCallback, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import { BaseInput } from '@/shared/ui/base-input';
import { BaseModal } from '@/shared/ui/base-modal';
import { Button } from '@/shared/ui/button';
import { PasswordInput } from '@/shared/ui/password-input';

import { signIn } from './auth';
import { SignInFormData, signInSchema } from './auth-validation';

export const SignInModal: React.FC = () => {
  const { closeModal, openModal } = useModals();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    mode: 'onSubmit',
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { email, password } = useWatch({ control });
  const isFormEmpty = !email || !password;
  const [isLoading, setIsLoading] = useState(false);

  const close = useCallback(() => {
    closeModal(MODAL_TYPES.SIGN_IN);
  }, [closeModal]);

  const switchToSignUp = useCallback(() => {
    closeModal(MODAL_TYPES.SIGN_IN);
    openModal(MODAL_TYPES.SIGN_UP);
  }, [closeModal, openModal]);

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      await signIn(data);
      close();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        'Failed to sign in. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal onClose={close}>
      <h2 className="mb-8 text-[28px] font-bold uppercase leading-tight text-black md:text-[32px]">
        Sign in
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <BaseInput
          label="Email"
          type="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <Controller
          name="password"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <PasswordInput
              label="Password"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        <Button
          type="submit"
          label={isLoading ? 'Signing in...' : 'Sign in'}
          disabled={isFormEmpty || isLoading}
          className="mt-4 w-full py-[14px] md:py-[18px]"
        />
      </form>

      <p className="mt-4 text-center text-xs text-light-grey">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={switchToSignUp}
          className="font-semibold text-black transition-opacity hover:opacity-70"
        >
          Create an account
        </button>
      </p>
    </BaseModal>
  );
};
