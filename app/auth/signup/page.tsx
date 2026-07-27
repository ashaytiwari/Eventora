'use client';

import { useFormik } from 'formik';
import Link from 'next/link';
import { X } from 'lucide-react';

import FormInputControl from '@/components/formControls/FormInputControl';

import { validateSignupForm, getPasswordStrength, PasswordStrength } from './utilities';

import styles from './styles.module.css';

const Page = () => {

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: validateSignupForm,
    onSubmit: handleRegister,
  });
  const formikValues = formik.values;

  async function handleRegister() {
    console.log('Register:', formikValues);
  }

  function renderSectionHeader() {

    return (
      <div className="flex justify-between items-center mb-8">
        <h1 className='text-gradient text-3xl font-semibold'>Sign Up</h1>
        <Link
          href="/"
          className="text-light-200 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-all duration-200"
          aria-label="Close and return to homepage"
        >
          <X size={20} />
        </Link>
      </div>
    );

  }

  function renderNameRow() {

    const firstNameAttributes = {
      label: 'First Name',
      name: 'firstName',
      type: 'text',
      value: formikValues.firstName,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : undefined,
      placeholder: 'e.g. John',
    };

    const lastNameAttributes = {
      label: 'Last Name',
      name: 'lastName',
      type: 'text',
      value: formikValues.lastName,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : undefined,
      placeholder: 'e.g. Doe',
    };

    return (
      <div className="flex gap-4">

        <FormInputControl {...firstNameAttributes} className="flex-1" />

        <FormInputControl {...lastNameAttributes} className="flex-1" />

      </div>
    );

  }

  function renderEmailControl() {

    const emailControlAttributes = {
      label: 'Email Address',
      name: 'email',
      type: 'email',
      value: formikValues.email,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: formik.touched.email && formik.errors.email ? formik.errors.email : undefined,
      placeholder: 'e.g. john@example.com',
    };

    return <FormInputControl {...emailControlAttributes} />;

  }

  function renderPasswordStrengthIndicator() {

    const password = formikValues.password;
    if (!password) return null;

    const strength: PasswordStrength = getPasswordStrength(password);

    const strengthConfig = {
      weak: {
        label: 'Weak',
        filledBars: 1,
        color: '#ef4444',
      },
      moderate: {
        label: 'Moderate',
        filledBars: 2,
        color: '#f59e0b',
      },
      strong: {
        label: 'Strong',
        filledBars: 3,
        color: '#22c55e',
      },
    };

    const config = strengthConfig[strength];

    return (
      <div className="flex items-center gap-2 mt-1">

        <div className="flex gap-1 flex-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: index < config.filledBars ? config.color : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>

        <span className="text-xs font-medium" style={{ color: config.color }}>
          {config.label}
        </span>

      </div>
    );

  }

  function renderPasswordControl() {

    const passwordControlAttributes = {
      label: 'Password',
      name: 'password',
      type: 'password',
      value: formikValues.password,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: formik.touched.password && formik.errors.password ? formik.errors.password : undefined,
      placeholder: '••••••••',
    };

    return (
      <div className="flex flex-col gap-1">

        <FormInputControl {...passwordControlAttributes} />

        {renderPasswordStrengthIndicator()}

      </div>
    );

  }

  function renderConfirmPasswordControl() {

    const confirmPasswordControlAttributes = {
      label: 'Confirm Password',
      name: 'confirmPassword',
      type: 'password',
      value: formikValues.confirmPassword,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined,
      placeholder: '••••••••',
    };

    return <FormInputControl {...confirmPasswordControlAttributes} />;

  }

  function renderAlreadyHaveAnAccountSection() {

    return (
      <div className="text-center mt-6 text-sm text-light-200">
        Already have an account?{' '}
        <Link
          href="/auth/signin"
          className="text-blue hover:underline font-medium transition-colors duration-200"
        >
          Signin here.
        </Link>
      </div>
    );

  }

  return (
    <section className='flex justify-center items-center min-h-[80vh] px-4'>
      <div className={styles.container}>

        {renderSectionHeader()}

        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-6'>

          {renderNameRow()}

          {renderEmailControl()}

          {renderPasswordControl()}

          {renderConfirmPasswordControl()}

          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black mt-2 transition-colors duration-200"
          >
            Create Account
          </button>

        </form>

        {renderAlreadyHaveAnAccountSection()}

      </div>
    </section>
  );

};

export default Page;
