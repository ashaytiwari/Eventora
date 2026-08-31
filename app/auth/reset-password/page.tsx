'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useFormik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { validateYupFormSchema } from '@/lib/utils/validation';

import FormInputControl from '@/components/formControls/FormInputControl';

import Loader from '@/app/loading';

import { resetPasswordValidationSchema } from './utilities';
import { useAuthResetPassword } from './service';

import styles from './styles.module.css';

function Page() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const resetPasswordMutation = useAuthResetPassword();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validate: (values) => validateYupFormSchema(values, resetPasswordValidationSchema),
    onSubmit: handleFormSubmit
  });
  const formikValues = formik.values;

  useEffect(() => {

    if (!token) {
      toast.error('Reset Password Failed, Pleas try again!');
      router.push('/');
      return;
    };

  }, [token]);

  async function handleFormSubmit() {
    try {

      const response = await resetPasswordMutation.mutateAsync({ password: formikValues.password, token: token! });

      if (response.status === 200) {
        toast.success(response.data.message, {
          duration: 10000
        });
        router.push('/auth/signin');
      } else {
        toast.error(response.data.message);
        router.push('/');
      }

    } catch (error: any) {
      toast.error(JSON.stringify(error));
    }
  }

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

  if (resetPasswordMutation.isPending) {
    return <Loader />;
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