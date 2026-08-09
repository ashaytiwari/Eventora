import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import EventCard from '@/components/eventCard/EventCard';
import JoinNowBtn from '@/components/joinNowBtn/JoinNowBtn';

import { getNavigationRedirectPath } from '@/lib/utils/navigationHelper';
import { events } from '@/lib/constants/events';

import { authOptions } from './api/auth/[...nextauth]/auth';

async function Page() {

  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect(getNavigationRedirectPath(session.user));
  }

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