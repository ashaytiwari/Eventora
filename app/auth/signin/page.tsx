'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import { useFormik } from 'formik';
import { X } from 'lucide-react';

import FormInputControl from '@/components/formControls/FormInputControl';

import { validateSigninForm } from './utilities';

import styles from './styles.module.css';

const Page = () => {

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validate: validateSigninForm,
    onSubmit: handleLogin
  });
  const formikValues = formik.values;

  async function handleLogin() {

    const response = await signIn("credentials", {
      email: formikValues.email,
      password: formikValues.password,
      redirect: false,
    });

    console.log(response);
  }

  function renderOrDivider() {
    return (
      <div className="flex items-center my-4">
        <hr className="flex-1 border-t border-gray-300" />
        <span className="px-2 text-gray-500">or</span>
        <hr className="flex-1 border-t border-gray-300" />
      </div>
    );
  }

  function renderEmailControl() {

    const emailControlAttributes = {
      label: "Email Address",
      name: "email",
      type: "email",
      value: formikValues.email,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: formik.touched.email && formik.errors.email ? formik.errors.email : undefined,
      placeholder: "e.g. john@example.com"
    };

    return <FormInputControl {...emailControlAttributes} />;

  }

  function renderPasswordControl() {

    const passwordControlAttributes = {
      label: "Password",
      name: "password",
      type: "password",
      value: formikValues.password,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: formik.touched.password && formik.errors.password ? formik.errors.password : undefined,
      placeholder: "••••••••"
    };

    return <FormInputControl {...passwordControlAttributes} />;

  }

  function renderSectionHeader() {

    return (
      <div className="flex justify-between items-center mb-8">
        <h1 className='text-gradient text-3xl font-semibold'>Signin</h1>
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

  function renderGoogleButton() {

    const handleGoogleSignIn = async () => {
      const user = await signIn('google');
      console.log('Signing User details', user);
    };

    return (
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center w-full gap-2 bg-white hover:bg-gray-100 rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black transition-colors duration-200"
      >
        <Image src="/images/google_logo.webp" alt="Google" width={25} height={25} />
        Continue with Google
      </button>
    );
  }

  function renderDontHaveAnAccountSection() {

    return (
      <div className="text-center mt-6 text-sm text-light-200">
        Don't have an account?{' '}
        <Link
          href="/auth/signup"
          className="text-blue hover:underline font-medium transition-colors duration-200"
        >
          Signup
        </Link>
      </div>
    );

  }

  function renderSigninControl() {

    return (
      <button
        type="submit"
        className="bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black mt-2 transition-colors duration-200"
      >
        Sign In
      </button>
    );

  }

  function renderForgotPasswordSection() {

    return (
      <div className="flex justify-start">
        <Link
          href="/auth/forgot-password"
          className="text-xs text-blue hover:underline transition-colors duration-200"
        >
          Forgot password?
        </Link>
      </div>
    );

  }

  return (
    <section className='flex justify-center items-center min-h-[80vh] px-4'>
      <div className={styles.container}>

        {renderSectionHeader()}

        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-6'>
          {renderEmailControl()}

          <div className="flex flex-col gap-1.5">
            {renderPasswordControl()}
            {renderForgotPasswordSection()}
          </div>

          {renderSigninControl()}
          {renderOrDivider()}
          {renderGoogleButton()}

        </form>

        {renderDontHaveAnAccountSection()}

      </div>
    </section>
  );

};

export default Page;