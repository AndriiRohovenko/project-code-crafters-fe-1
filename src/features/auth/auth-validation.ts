import * as yup from 'yup';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const emailSchema = yup
  .string()
  .required('Email is required')
  .min(5, 'Email must be between 5 and 254 characters')
  .max(254, 'Email must be between 5 and 254 characters')
  .matches(EMAIL_REGEX, 'Email has invalid format');

const passwordSchema = yup
  .string()
  .required('Password is required')
  .min(6, 'Password must be at least 6 characters long')
  .max(32, 'Password must be less than 32 characters');

export const signInSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be between 2 and 50 characters')
    .max(50, 'Name must be between 2 and 50 characters'),
  email: emailSchema,
  password: passwordSchema,
});

export type SignInFormData = yup.InferType<typeof signInSchema>;
export type SignUpFormData = yup.InferType<typeof signUpSchema>;
