"use client";

import Image from "next/image";

const ExploreBtn = () => {

  const buttonAttributes = {
    type: 'button' as const,
    id: 'explore-btn',
    className: 'mt-7 mx-auto',
    onClick() { }
  };

  const arrowImageAttributes = {
    src: '/icons/arrow-down.svg',
    alt: 'arrow-down',
    width: 24,
    height: 24
  };

  return (
    <button {...buttonAttributes}>
      <a href="#events">
        Explore Events
        <Image {...arrowImageAttributes} />
      </a>
    </button>
  );

};

export default ExploreBtn; 