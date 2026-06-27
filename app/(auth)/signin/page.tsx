'use client';

import { useFormik } from 'formik';
import Link from 'next/link';
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
    onSubmit: values => {
      console.log(values);
    }
  });

  function renderEmailControl() {

    const emailControlAttributes = {
      label: "Email Address",
      name: "email",
      type: "email",
      value: formik.values.email,
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
      value: formik.values.password,
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

  function renderDontHaveAnAccountSection() {

    return (
      <div className="text-center mt-6 text-sm text-light-200">
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="text-blue hover:underline font-medium transition-colors duration-200"
        >
          Signup
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

            <div className="flex justify-start">
              <Link
                href="/forgot-password"
                className="text-xs text-blue hover:underline transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black mt-2 transition-colors duration-200"
          >
            Sign In
          </button>

        </form>

        {renderDontHaveAnAccountSection()}

      </div>
    </section>
  );

};

export default Page;