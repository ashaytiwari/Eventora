interface Events {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Array<Events> = [
  {
    title: 'Global AI Hackathon 2026',
    image: '/images/event1.png',
    slug: 'global-ai-hackathon-2026',
    location: 'Bengaluru, India',
    date: '15 Aug 2026',
    time: '09:00 AM'
  },
  {
    title: 'React Native Developers Summit',
    image: '/images/event2.png',
    slug: 'react-native-developers-summit',
    location: 'Hyderabad, India',
    date: '22 Aug 2026',
    time: '10:30 AM'
  },
  {
    title: 'Cloud & DevOps Conference',
    image: '/images/event3.png',
    slug: 'cloud-devops-conference',
    location: 'Pune, India',
    date: '05 Sep 2026',
    time: '11:00 AM'
  },
  {
    title: 'Open Source Contributors Meetup',
    image: '/images/event4.png',
    slug: 'open-source-contributors-meetup',
    location: 'Delhi, India',
    date: '12 Sep 2026',
    time: '04:00 PM'
  },
  {
    title: 'AI Agents & Automation Bootcamp',
    image: '/images/event5.png',
    slug: 'ai-agents-automation-bootcamp',
    location: 'Remote',
    date: '03 Oct 2026',
    time: '06:00 PM'
  },
  {
    title: 'Startup Tech Fest & Hackathon',
    image: '/images/event6.png',
    slug: 'startup-tech-fest-hackathon',
    location: 'Ahmedabad, India',
    date: '24 Oct 2026',
    time: '08:30 AM'
  }
];