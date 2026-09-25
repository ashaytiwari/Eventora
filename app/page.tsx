import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowRight, ArrowUpRight, Calendar, Clock, Compass, Layers, MapPin, Sparkles, Users, Video } from "lucide-react";

import { authOptions } from "./api/auth/[...nextauth]/auth";
import { connectDB } from "@/lib/utils/db";
import { eventsService } from "@/services/events.service";
import { getNavigationRedirectPath } from "@/lib/utils/navigationHelper";
import { events as fallbackEvents } from "@/lib/constants/events";

interface LandingEvent {
  _id?: string;
  title: string;
  image?: string;
  location?: string;
  date?: string;
  time?: string;
  isVirtualEvent?: boolean;
  organizationName?: string;
}

async function Page() {

  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect(getNavigationRedirectPath(session.user));
  }

  let upcomingEvents: LandingEvent[] = [];

  try {
    await connectDB();
    const result = await eventsService.getUpcomingEvents({ page: 1, limit: 6 });

    if (result?.events && result.events.length > 0) {
      upcomingEvents = result.events.map((event: any) => {
        const startDate = event.startAt ? new Date(event.startAt) : new Date();
        const formattedDate = startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const formattedTime = startDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          _id: event._id?.toString(),
          title: event.title,
          image: event.image || "/images/event1.png",
          location: event.eventLocation || "Venue TBA",
          date: formattedDate,
          time: formattedTime,
          isVirtualEvent: Boolean(event.isVirtualEvent),
          organizationName: event.organization?.organizationName || "Tech Community",
        };
      });
    }
  } catch {
    upcomingEvents = [];
  }

  if (upcomingEvents.length === 0) {
    upcomingEvents = fallbackEvents.map((event, index) => ({
      _id: `fallback-${index}`,
      title: event.title,
      image: event.image,
      location: event.location,
      date: event.date,
      time: event.time,
      isVirtualEvent: event.location.toLowerCase().includes("remote"),
      organizationName: "Developer Community",
    }));
  }

  function renderHeroBadge() {

    const badgeWrapperAttributes = {
      className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-100 border border-primary/30 text-xs font-medium text-primary shadow-[0_0_20px_rgba(93,254,202,0.15)] mb-6",
    };

    return (
      <div {...badgeWrapperAttributes}>
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>The Premier Developer Events Platform</span>
        <Sparkles className="w-3.5 h-3.5 text-primary" />
      </div>
    );

  }

  function renderHeroSection() {

    const heroSectionAttributes = {
      className: "relative flex flex-col items-center text-center pt-8 pb-16 sm:pt-14 sm:pb-24 max-w-4xl mx-auto px-4",
    };

    const primaryCtaAttributes = {
      href: "/auth/signup",
      className: "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-black font-semibold text-sm sm:text-base hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(93,254,202,0.25)] hover:scale-105 active:scale-95 cursor-pointer",
    };

    const secondaryCtaAttributes = {
      href: "/auth/signin",
      className: "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-dark-100 border border-dark-200 text-light-100 font-medium text-sm sm:text-base hover:border-primary/40 hover:text-white transition-all cursor-pointer",
    };

    return (
      <section {...heroSectionAttributes}>

        {renderHeroBadge()}

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
          The Hub for Every Dev <br />
          <span className="text-gradient">Event You Can't Miss</span>
        </h1>

        <p className="text-base sm:text-lg text-light-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Discover hackathons, developer conferences, and tech meetups. Seamlessly register, manage passes, or organize your own community gathering.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">

          <Link {...primaryCtaAttributes}>
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link {...secondaryCtaAttributes}>
            <span>Host an Event</span>
            <ArrowUpRight className="w-4 h-4 text-light-200" />
          </Link>

        </div>

      </section>
    );

  }

  function renderMetricsStrip() {

    const metricsContainerAttributes = {
      className: "w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl bg-dark-100/60 border border-dark-200 backdrop-blur-xl mb-24",
    };

    return (
      <div {...metricsContainerAttributes}>

        <div className="flex flex-col items-center text-center p-3">
          <span className="text-3xl sm:text-4xl font-bold text-white font-mono mb-1">500+</span>
          <span className="text-xs sm:text-sm text-light-200">Curated Tech Events</span>
        </div>

        <div className="flex flex-col items-center text-center p-3 sm:border-x sm:border-dark-200">
          <span className="text-3xl sm:text-4xl font-bold text-primary font-mono mb-1">50k+</span>
          <span className="text-xs sm:text-sm text-light-200">Active Developers</span>
        </div>

        <div className="flex flex-col items-center text-center p-3">
          <span className="text-3xl sm:text-4xl font-bold text-blue font-mono mb-1">120+</span>
          <span className="text-xs sm:text-sm text-light-200">Tech Communities</span>
        </div>

      </div>
    );

  }

  function renderFeaturePillars() {

    const pillarsSectionAttributes = {
      className: "w-full max-w-6xl mx-auto mb-24",
    };

    const pillarCardClass = "flex flex-col p-6 sm:p-8 rounded-2xl bg-dark-100/80 border border-dark-200 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 group";

    return (
      <section {...pillarsSectionAttributes}>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Engineered for the Modern Tech Ecosystem
          </h2>
          <p className="text-sm sm:text-base text-light-200 font-light">
            Everything you need to discover, participate in, and host world-class developer gatherings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className={pillarCardClass}>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Discovery</h3>
            <p className="text-xs sm:text-sm text-light-200 leading-relaxed font-light">
              Explore hackathons, workshops, and tech summits tailored by city, format, and technical focus tags.
            </p>
          </div>

          <div className={pillarCardClass}>
            <div className="w-12 h-12 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Registration</h3>
            <p className="text-xs sm:text-sm text-light-200 leading-relaxed font-light">
              One-click passes for individuals and team members. Easily track registered events in your personal portal.
            </p>
          </div>

          <div className={pillarCardClass}>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Organizer Dashboard</h3>
            <p className="text-xs sm:text-sm text-light-200 leading-relaxed font-light">
              Create events in minutes, monitor attendee rosters with real-time member analytics, and publish live updates.
            </p>
          </div>

        </div>

      </section>
    );

  }

  function renderFeaturedEventsSection() {

    const featuredSectionAttributes = {
      className: "w-full max-w-6xl mx-auto mb-24",
    };

    const viewAllLinkAttributes = {
      href: "/auth/signin",
      className: "inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dark-100 border border-dark-200 text-light-100 hover:border-primary/40 hover:text-white transition-all text-xs sm:text-sm font-medium",
    };

    return (
      <section {...featuredSectionAttributes}>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">

          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-primary font-mono mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>FEATURED GATHERINGS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Upcoming Events & Hackathons
            </h2>
          </div>

          <Link {...viewAllLinkAttributes}>
            <span>Browse All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {upcomingEvents.map((event, idx) => {
            const cardLinkAttributes = {
              key: event._id || idx,
              href: "/auth/signin",
              className: "group flex flex-col bg-dark-100/90 border border-dark-200 hover:border-primary/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(93,254,202,0.1)] hover:-translate-y-1",
            };

            const imageAttributes = {
              src: event.image || "/images/event1.png",
              alt: event.title,
              width: 500,
              height: 280,
              className: "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500",
            };

            return (
              <Link {...cardLinkAttributes}>

                <div className="relative w-full h-48 overflow-hidden bg-dark-200">

                  <Image {...imageAttributes} />

                  <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-dark-100/90 text-primary border border-primary/30 backdrop-blur-md">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span>{event.date}</span>
                  </div>

                  <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-dark-100/90 text-light-100 border border-dark-200 backdrop-blur-md">
                    {event.isVirtualEvent ? (
                      <>
                        <Video className="w-3 h-3 text-blue" />
                        <span className="text-blue">Virtual</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="truncate max-w-[100px]">{event.location}</span>
                      </>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent opacity-80" />

                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">

                  <div>

                    <div className="flex items-center gap-1.5 text-xs text-light-200 mb-2 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>

                    <h3 className="font-semibold text-white text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {event.title}
                    </h3>

                    <p className="text-xs text-light-200 truncate font-light">
                      Hosted by <span className="text-light-100 font-medium">{event.organizationName}</span>
                    </p>

                  </div>

                  <div className="mt-4 pt-3 border-t border-dark-200 flex items-center justify-between text-xs font-medium text-light-200 group-hover:text-primary transition-colors">
                    <span>Register & Details</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>

                </div>

              </Link>
            );
          })}

        </div>

      </section>
    );

  }

  function renderHowItWorksSection() {

    const workflowSectionAttributes = {
      className: "w-full max-w-6xl mx-auto mb-24 p-8 sm:p-12 rounded-3xl bg-dark-100/40 border border-dark-200 backdrop-blur-sm",
    };

    return (
      <section {...workflowSectionAttributes}>

        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary font-mono mb-2">
            <span>SEAMLESS WORKFLOW</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            How Eventora Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-dark-200 border border-primary/40 flex items-center justify-center text-primary font-mono font-bold text-base mb-4 shadow-[0_0_15px_rgba(93,254,202,0.15)]">
              01
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Discover</h3>
            <p className="text-xs sm:text-sm text-light-200 font-light leading-relaxed">
              Explore handpicked tech conferences, hackathons, and meetups filtered by your interests.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-dark-200 border border-blue/40 flex items-center justify-center text-blue font-mono font-bold text-base mb-4 shadow-[0_0_15px_rgba(148,234,255,0.15)]">
              02
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Register</h3>
            <p className="text-xs sm:text-sm text-light-200 font-light leading-relaxed">
              Sign up in seconds for yourself and your team. Get instant confirmation and access pass.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-dark-200 border border-primary/40 flex items-center justify-center text-primary font-mono font-bold text-base mb-4 shadow-[0_0_15px_rgba(93,254,202,0.15)]">
              03
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Connect & Build</h3>
            <p className="text-xs sm:text-sm text-light-200 font-light leading-relaxed">
              Attend high-impact sessions, meet engineers and founders, and accelerate your tech career.
            </p>
          </div>

        </div>

      </section>
    );

  }

  function renderCtaSection() {

    const ctaContainerAttributes = {
      className: "w-full max-w-5xl mx-auto mb-20 p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-dark-100 to-dark-200 border border-primary/30 text-center relative overflow-hidden shadow-[0_0_50px_rgba(93,254,202,0.08)]",
    };

    const ctaButtonAttributes = {
      href: "/auth/signup",
      className: "inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-black font-semibold text-sm sm:text-base hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(93,254,202,0.3)] hover:scale-105 active:scale-95 cursor-pointer",
    };

    return (
      <section {...ctaContainerAttributes}>

        <div className="absolute -top-24 -left-24 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Experience Your Next Dev Event?
          </h2>

          <p className="text-sm sm:text-base text-light-200 mb-8 font-light leading-relaxed">
            Join thousands of developers, organizers, and tech communities on Eventora. Start discovering or host your own meetup today.
          </p>

          <Link {...ctaButtonAttributes}>
            <span>Get Started for Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>

      </section>
    );

  }

  function renderFooter() {

    const footerAttributes = {
      className: "w-full max-w-6xl mx-auto pt-10 pb-6 border-t border-dark-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-light-200",
    };

    return (
      <footer {...footerAttributes}>

        <div className="flex items-center gap-2">
          <Image src="/images/app_logo.png" alt="logo" width={22} height={22} />
          <span className="font-bold text-white">Eventora</span>
          <span className="text-light-200">© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/auth/signin" className="hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/auth/signup" className="hover:text-primary transition-colors">
            Sign Up
          </Link>
          <Link href="/auth/signin" className="hover:text-primary transition-colors">
            Host Event
          </Link>
        </div>

      </footer>
    );

  }

  return (
    <div className="w-full flex flex-col items-center">

      {renderHeroSection()}

      {renderMetricsStrip()}

      {renderFeaturePillars()}

      {renderFeaturedEventsSection()}

      {renderHowItWorksSection()}

      {renderCtaSection()}

      {renderFooter()}

    </div>
  );

}

export default Page;