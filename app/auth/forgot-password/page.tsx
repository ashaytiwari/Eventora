'use client';

import React from 'react';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { validateYupFormSchema } from '@/lib/utils/validation';

import Loader from '@/app/loading';

import FormInputControl from '@/components/formControls/FormInputControl';

import { useAuthForgotPassword } from './service';

import { forgotPasswordValidationSchema } from './utilities';

import styles from './styles.module.css';

function Page() {

  const router = useRouter();

  const forgotPasswordMutation = useAuthForgotPassword();

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validate: (values) => validateYupFormSchema(values, forgotPasswordValidationSchema),
    onSubmit: handleFormSubmit
  });
  const formikValues = formik.values;

  async function handleFormSubmit() {
    try {

      const response = await forgotPasswordMutation.mutateAsync({ email: formikValues.email });

      if (response.status === 200) {
        toast.success(response.data.message, {
          duration: 10000
        });
        router.push('/');
      } else {
        toast.error(response.data.message);
      }

    } catch (error: any) {
      toast.error(JSON.stringify(error));
    }
  }

  function renderSectionHeader() {

    return (
      <div className="flex justify-between items-center mb-10">
        <div className='flex flex-col gap-3'>
          <h1 className='text-gradient text-3xl font-semibold'>Forgot Password</h1>
          <p className='text-light-200 text-lg font-normal'>Enter your registered email address to proceed with password reset.</p>
        </div>
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

  function renderSubmitControl() {

    return (
      <button
        type="submit"
        className="bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black mt-2 transition-colors duration-200"
      >
        Submit
      </button>
    );

  }

  if (forgotPasswordMutation.isPending) {
    return <Loader />;
  }

  return (
    <section className='flex justify-center items-center min-h-[80vh] px-4'>
      <div className={styles.container}>

        {renderSectionHeader()}

        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-6'>
          {renderEmailControl()}
          {renderSubmitControl()}
        </form>

      </div>
    </section>
  );

}

export default Page;