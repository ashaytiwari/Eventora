'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import FormInputControl from '@/components/formControls/FormInputControl';
import Loader from '@/app/loading';
import { useUserProfile } from '@/app/service';

import { getNavigationRedirectPath } from '@/lib/utils/navigationHelper';
import { validateYupFormSchema } from '@/lib/utils/validation';

import { changePasswordValidationSchema } from './utilities';
import { useAuthChangePassword } from './service';

import styles from './styles.module.css';

function Page() {

  const router = useRouter();
  const { status, data: session }: any = useSession();

  const { data: userProfile } = useUserProfile(session?.user?.id);
  const isMandatory = Boolean(userProfile?.mustChangePassword);

  const changePasswordMutation = useAuthChangePassword();

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validate: (values) => validateYupFormSchema(values, changePasswordValidationSchema),
    onSubmit: handleFormSubmit
  });
  const formikValues = formik.values;

  useEffect(() => {

    if (status === 'unauthenticated') {
      toast.error('Please sign in to change your password');
      router.push('/auth/signin');
    }

  }, [status, router]);

  async function handleFormSubmit() {

    try {

      const response = await changePasswordMutation.mutateAsync({
        oldPassword: formikValues.oldPassword,
        newPassword: formikValues.newPassword
      });

      if (response.status === 200) {
        toast.success(response.data.message || 'Password changed successfully!', {
          duration: 6000
        });

        const redirectPath = getNavigationRedirectPath(session?.user);
        router.push(redirectPath);
      } else {
        toast.error(response.data.message || 'Failed to change password');
      }

    } catch (error: any) {

      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to change password';
      toast.error(errorMessage);

    }

  }

  function renderSectionHeader() {

    const closeHref = session?.user ? getNavigationRedirectPath(session.user) : '/';

    return (
      <div className="flex justify-between items-center mb-10">
        <div className='flex flex-col gap-3'>
          <h1 className='text-gradient text-3xl font-semibold'>Change Password</h1>

          <p className='text-light-200 text-lg font-normal'>
            {isMandatory
              ? "You must update your password before accessing your account"
              : "Update your password to keep your account secure"}
          </p>
        </div>

        {!isMandatory && (
          <Link
            href={closeHref}
            className="text-light-200 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-all duration-200"
            aria-label="Close and return"
          >
            <X size={20} />
          </Link>
        )}
      </div>
    );

  }

  function renderPasswordControl(label: string, name: string) {

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

    return (
      <FormInputControl {...passwordControlAttributes} />
    );

  }

  function renderSubmitControl() {

    const isSubmitting = changePasswordMutation.isPending;

    const buttonAttributes = {
      type: "submit" as const,
      disabled: isSubmitting,
      className:
        "bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black mt-2 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed",
    };

    return (
      <button {...buttonAttributes}>
        {isSubmitting ? "Changing Password..." : "Change Password"}
      </button>
    );

  }

  if (status === 'loading' || changePasswordMutation.isPending) {
    return <Loader />;
  }

  return (
    <section className='flex justify-center items-center min-h-[80vh] px-4'>
      <div className={styles.container}>

        {renderSectionHeader()}

        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-6'>
          {renderPasswordControl("Old Password", "oldPassword")}
          {renderPasswordControl("New Password", "newPassword")}
          {renderPasswordControl("Confirm Password", "confirmPassword")}
          {renderSubmitControl()}
        </form>

      </div>
    </section>
  );

}

export default Page;
