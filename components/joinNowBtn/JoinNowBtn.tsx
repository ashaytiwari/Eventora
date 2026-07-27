"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const JoinNowBtn = () => {

  const router = useRouter();

  const buttonAttributes = {
    type: 'button' as const,
    id: 'explore-btn',
    className: 'mt-7 mx-auto',
    onClick() {
      router.push('/auth/signin');
    }
  };

  return (
    <button {...buttonAttributes}>
      Join Now
      <span className="ml-2">
        <ArrowRight />
      </span>
    </button>
  );

};

export default JoinNowBtn; 