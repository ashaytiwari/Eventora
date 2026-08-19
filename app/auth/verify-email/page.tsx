'use client'

import Image from 'next/image';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { FadeLoader } from 'react-spinners';

import { useAuthVerifyEmail } from './service';

import styles from './styles.module.css';

const Page = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const authVerifyEmailMutation = useAuthVerifyEmail();

  useEffect(() => {

    if (token) {
      verifyEmail();
      return;
    };

    handleEmailVerificationFailed();

  }, [token]);

  function handleEmailVerificationFailed() {
    router.replace('/');
    toast.error('Email Verification Failed!');
  }

  async function verifyEmail() {
    try {

      const response = await authVerifyEmailMutation.mutateAsync({ token: token! });

      if (response.status !== 200) {
        handleEmailVerificationFailed();
        return;
      }

      toast.success('Email Verification Successfull! Please login to continue...', { duration: 10000 });
      router.push('/auth/signin');

    } catch (error) {
      handleEmailVerificationFailed();
    }
  }

  function renderImage() {

    const imageAttributes = {
      src: '/images/email_verification.svg',
      alt: 'Access Denied',
      width: 350,
      height: 350,
      priority: true,
      className: 'mx-auto animate-pulse',
    };

    return <Image {...imageAttributes} />;

  }

  function renderContent() {

    const loaderAttributes = {
      size: 60,
      color: '#5dfeca',
    };

    return (
      <div className="flex flex-col gap-4 items-center mt-10">
        <FadeLoader {...loaderAttributes} />
        <h1 className="text-gradient text-3xl font-semibold mt-5">Verifying Email</h1>
        <p className="text-light-200 text-sm">
          Please wait while we verify your email address.
        </p>
      </div>
    );

  }

  return (
    <section className="flex justify-center items-center min-h-[80vh] px-4">
      <div className={styles.container}>
        {renderImage()}
        {renderContent()}
      </div>
    </section>
  );

};

export default Page;