'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import styles from './styles.module.css';

const Page = () => {

  function renderImage() {

    const imageAttributes = {
      src: '/images/access_denied.svg',
      alt: 'Access Denied',
      width: 250,
      height: 250,
      priority: true,
      className: 'mx-auto animate-pulse',
    };

    return <Image {...imageAttributes} />;

  }

  function renderMessage() {

    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-gradient text-3xl font-semibold">Access Denied</h1>
        <p className="text-light-200 text-sm">
          You do not have the required permissions to view this resource. Please contact an administrator or return to the home page.
        </p>
      </div>
    );

  }

  function renderActionButtons() {

    return (
      <Link
        href="/"
        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        Back to Home
      </Link>
    );

  }

  return (
    <section className="flex justify-center items-center min-h-[80vh] px-4">
      <div className={styles.container}>

        {renderImage()}

        {renderMessage()}

        {renderActionButtons()}

      </div>
    </section>
  );

};

export default Page;
