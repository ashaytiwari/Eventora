'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import EventCard from '@/components/eventCard/EventCard';
import JoinNowBtn from '@/components/joinNowBtn/JoinNowBtn';

import { events } from '@/lib/constants/events';
import { getNavigationRedirectPath } from '@/lib/utils/navigationHelper';

function Page() {

  const router = useRouter();
  const { status, data: session }: any = useSession();

  useEffect(() => {

    if (status !== "authenticated") return;

    router.replace(getNavigationRedirectPath(session.user));

  }, [status, session]);

  return (
    <section>

      <h1 className='text-center'>The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className='text-center mt-5'>Hackathons, Meetups, and Conferences, All in One Place</p>

      <JoinNowBtn />

      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>

        <ul className='events'>
          {
            events.map((event, index) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))
          }
        </ul>
      </div>

    </section>
  );

}

export default Page;