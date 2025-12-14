import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import { BaseInput } from '@/shared/ui/base-input';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { PasswordInput } from '@/shared/ui/password-input';

import { signUp } from './auth';
import { SignUpFormData, signUpSchema } from './auth-validation';

export const SignUpModal: React.FC = () => {
  const { closeModal, openModal } = useModals();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    mode: 'onSubmit',
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { name, email, password } = useWatch({ control });
  const isFormEmpty = !name || !email || !password;
  const [isLoading, setIsLoading] = useState(false);

  const close = useCallback(() => {
    closeModal(MODAL_TYPES.SIGN_UP);
  }, [closeModal]);

  const switchToSignIn = useCallback(() => {
    closeModal(MODAL_TYPES.SIGN_UP);
    openModal(MODAL_TYPES.SIGN_IN);
  }, [closeModal, openModal]);

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      await signUp(data);
      close();
    } catch (error) {
      console.error('Sign up error:', error);
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

        <h2 className="mb-8 text-[28px] font-extrabold uppercase leading-tight text-black md:text-[32px]">
          Sign up
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <BaseInput
            label="Name"
            required
            error={errors.name?.message}
            {...register('name')}
          />

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
            label={isLoading ? 'Creating...' : 'Create'}
            disabled={isFormEmpty || isLoading}
            className="mt-4 w-full py-[14px] md:py-[18px]"
          />
        </form>

        <p className="mt-4 text-center text-xs text-light-grey">
          I already have an account?{' '}
          <button
            type="button"
            onClick={switchToSignIn}
            className="font-semibold text-black transition-opacity hover:opacity-70"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
