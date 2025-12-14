import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import { BaseInput } from '@/shared/ui/base-input';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
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
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.7)]"
        onClick={close}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[560px] rounded-[30px] bg-white px-[30px] pb-[60px] pt-12 md:p-[80px]">
        <button
          type="button"
          onClick={close}
          className="absolute right-5 top-5 text-black transition-opacity hover:opacity-70"
          aria-label="Close modal"
        >
          <Icon name="close" size={24} />
        </button>

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
      </div>
    </div>
  );
};
