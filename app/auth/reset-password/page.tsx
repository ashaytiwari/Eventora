'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useFormik } from 'formik';

import { validateYupFormSchema } from '@/lib/utils/validation';

import FormInputControl from '@/components/formControls/FormInputControl';

import { resetPasswordValidationSchema } from './utilities';

import styles from './styles.module.css';

function Page() {

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validate: (values) => validateYupFormSchema(values, resetPasswordValidationSchema),
    onSubmit: () => { }
  });
  const formikValues = formik.values;

  function renderSectionHeader() {

    return (
      <div className="flex justify-between items-center mb-10">
        <div className='flex flex-col gap-3'>
          <h1 className='text-gradient text-3xl font-semibold'>Reset Password</h1>
          <p className='text-light-200 text-lg font-normal'>Enter your new password</p>
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

  function renderPasswordControl(label: string, name: string,) {

    const keyConst = name as keyof typeof formikValues;

    const passwordControlAttributes = {
      label: label,
      name: name,
      type: "password",
      value: formikValues[keyConst],
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: formik.touched[keyConst] && formik.errors[keyConst] ? formik.errors[keyConst] : undefined,
      placeholder: "••••••••"
    };

    return <FormInputControl {...passwordControlAttributes} />;

  }

  function renderSubmitControl() {

    return (
      <button
        type="submit"
        className="bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black mt-2 transition-colors duration-200"
      >
        Reset Password
      </button>
    );

  }

  return (
    <section className='flex justify-center items-center min-h-[80vh] px-4'>
      <div className={styles.container}>

        {renderSectionHeader()}

        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-6'>
          {renderPasswordControl("Password", "password")}
          {renderPasswordControl("Confirm Password", "confirmPassword")}
          {renderSubmitControl()}
        </form>

      </div>
    </section>
  );
}

export default Page;