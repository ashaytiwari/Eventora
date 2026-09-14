import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  Globe,
  MapPin,
  Sparkles,
  User,
  Tag,
  Loader2,
  FileText,
} from "lucide-react";

import FormInputControl from "@/components/formControls/FormInputControl";
import FormTextareaControl from "@/components/formControls/FormTextareaControl";

import { EventStatus } from "@/lib/constants/eventStatus";
import { cn } from "@/lib/utils/common";
import { validateYupFormSchema } from "@/lib/utils/validation";

import { useCreateEvent, useUpdateEvent } from "../service";

import ImagePreview from "./ImagePreview";
import {
  defaultEventFormValues,
  eventValidationSchema,
  formatEventToFormValues,
  formatFormValuesToDto,
  IEventFormValues,
} from "./utilities";

interface EventEditorProps {
  mode?: "create" | "edit";
  eventId?: string;
  initialData?: any;
  onSuccess?: (event: any) => void;
}

const statusDescriptions: Record<EventStatus, { label: string; desc: string; colorClass: string }> = {
  [EventStatus.DRAFT]: {
    label: "Draft",
    desc: "Visible only to you while preparing.",
    colorClass: "text-amber-400 bg-amber-400",
  },
  [EventStatus.PUBLISHED]: {
    label: "Published",
    desc: "Live and open for registrations.",
    colorClass: "text-emerald-400 bg-emerald-400",
  },
  [EventStatus.INACTIVE]: {
    label: "Inactive",
    desc: "Temporarily hidden from attendees.",
    colorClass: "text-slate-400 bg-slate-400",
  },
  [EventStatus.CANCELLED]: {
    label: "Cancelled",
    desc: "Event has been cancelled.",
    colorClass: "text-rose-400 bg-rose-400",
  },
};

const EventEditor = ({
  mode = "create",
  eventId,
  initialData,
  onSuccess,
}: EventEditorProps) => {

  const router = useRouter();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent(eventId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: IEventFormValues = initialData
    ? formatEventToFormValues(initialData)
    : defaultEventFormValues;

  const formik = useFormik<IEventFormValues>({
    initialValues,
    enableReinitialize: true,
    validate: (values) => validateYupFormSchema(values, eventValidationSchema),
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values: IEventFormValues) {

    try {
      setIsSubmitting(true);

      const dto = formatFormValuesToDto(values);

      const response: any =
        mode === "edit" && eventId
          ? await updateEventMutation.mutateAsync(dto)
          : await createEventMutation.mutateAsync(dto);

      if (response?.data?.success || response?.status === 201 || response?.status === 200) {
        toast.success(
          mode === "edit"
            ? "Event updated successfully!"
            : "Event created successfully!"
        );

        if (onSuccess) {
          onSuccess(response?.data?.data);
        } else {
          router.push("/organizer");
        }
      } else {
        const errorMsg =
          response?.data?.message ||
          (response?.data?.errors
            ? Object.values(response.data.errors).join(", ")
            : "Failed to save event");
        toast.error(errorMsg);
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred while saving the event";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }

  }

  const backLinkAttributes = {
    href: "/organizer",
    className:
      "inline-flex items-center gap-2 text-xs font-mono text-light-200 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-dark-200/60 border border-transparent hover:border-white/10 w-fit",
  };

  const titleInputAttributes = {
    label: "Event Title *",
    name: "title",
    value: formik.values.title,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched.title && formik.errors.title ? formik.errors.title : undefined,
    placeholder: "e.g. Next.js Global Developer Summit 2026",
  };

  const aboutTextareaAttributes = {
    label: "About Description *",
    name: "about",
    value: formik.values.about,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched.about && formik.errors.about ? formik.errors.about : undefined,
    placeholder: "Provide a comprehensive description of the event, agenda, topics, and speakers...",
    rows: 5,
  };

  const imageUrlInputAttributes = {
    label: "Poster Image URL *",
    name: "image",
    value: formik.values.image,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched.image && formik.errors.image ? formik.errors.image : undefined,
    placeholder: "https://images.unsplash.com/photo-...",
  };

  const startAtInputAttributes = {
    label: "Start Date & Time *",
    name: "startAt",
    type: "datetime-local",
    value: formik.values.startAt,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched.startAt && formik.errors.startAt ? formik.errors.startAt : undefined,
  };

  const endAtInputAttributes = {
    label: "End Date & Time *",
    name: "endAt",
    type: "datetime-local",
    value: formik.values.endAt,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched.endAt && formik.errors.endAt ? formik.errors.endAt : undefined,
  };

  const languageInputAttributes = {
    label: "Event Language *",
    name: "language",
    value: formik.values.language,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched.language && formik.errors.language ? formik.errors.language : undefined,
    placeholder: "e.g. English, Spanish...",
  };

  const ageLimitInputAttributes = {
    label: "Age Limit (Optional)",
    name: "ageLimit",
    type: "number",
    min: 0,
    value: formik.values.ageLimit,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched.ageLimit && formik.errors.ageLimit ? formik.errors.ageLimit : undefined,
    placeholder: "e.g. 18",
  };

  const virtualLinkInputAttributes = {
    label: "Virtual Event Link *",
    name: "virtualEventLink",
    value: formik.values.virtualEventLink,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error:
      formik.touched.virtualEventLink && formik.errors.virtualEventLink
        ? formik.errors.virtualEventLink
        : undefined,
    placeholder: "https://meet.google.com/... or https://youtube.com/live/...",
  };

  const locationInputAttributes = {
    label: "Venue Address / Location *",
    name: "eventLocation",
    value: formik.values.eventLocation,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error:
      formik.touched.eventLocation && formik.errors.eventLocation
        ? formik.errors.eventLocation
        : undefined,
    placeholder: "e.g. Moscone Center, 747 Howard St, San Francisco, CA",
  };

  const seoTagsInputAttributes = {
    label: "SEO Tags (Comma Separated)",
    name: "seoTags",
    value: formik.values.seoTags,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched.seoTags && formik.errors.seoTags ? formik.errors.seoTags : undefined,
    placeholder: "react, nextjs, typescript, ai, devops",
  };

  const artistNameInputAttributes = {
    label: "Speaker / Featured Artist Name",
    name: "artistName",
    value: formik.values.artistName,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error:
      formik.touched.artistName && formik.errors.artistName
        ? formik.errors.artistName
        : undefined,
    placeholder: "e.g. Sarah Connor",
  };

  const artistImageInputAttributes = {
    label: "Speaker / Artist Photo URL",
    name: "artistImage",
    value: formik.values.artistImage,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error:
      formik.touched.artistImage && formik.errors.artistImage
        ? formik.errors.artistImage
        : undefined,
    placeholder: "https://example.com/avatar.jpg",
  };

  const submitButtonAttributes = {
    type: "submit" as const,
    disabled: isSubmitting,
    className: cn(
      "w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-black text-sm transition-all duration-200 cursor-pointer",
      "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(93,254,202,0.35)] hover:shadow-[0_0_25px_rgba(93,254,202,0.5)]",
      isSubmitting && "opacity-70 cursor-not-allowed"
    ),
  };

  const cancelButtonAttributes = {
    href: "/organizer",
    className:
      "w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-light-200 hover:text-white bg-dark-200/50 hover:bg-dark-200 border border-white/10 transition-colors text-center",
  };

  function renderHeader() {

    return (
      <div className="flex flex-col gap-4 mb-8">
        <Link {...backLinkAttributes}>
          <ArrowLeft className="w-3.5 h-3.5" />

          <span>Back to Organizer Events</span>
        </Link>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />

            <span>{mode === "edit" ? "Event Editor" : "Create Event"}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {mode === "edit" ? "Edit Event" : "Create New Event"}
          </h1>

          <p className="text-light-200 text-sm max-w-2xl">
            {mode === "edit"
              ? "Update your event details, schedule, or publication status."
              : "Fill out the information below to set up and publish your event on Eventora."}
          </p>
        </div>
      </div>
    );

  }

  function renderBasicInfoSection() {

    const aboutLength = formik.values.about.length;

    return (
      <div className="bg-dark-100/70 backdrop-blur-xl border border-border-dark rounded-2xl p-6 card-shadow flex flex-col gap-5">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <FileText className="w-4 h-4 text-primary" />

          <h3 className="text-base font-semibold text-white">General Information</h3>
        </div>

        <FormInputControl {...titleInputAttributes} />

        <div className="flex flex-col gap-1.5">
          <FormTextareaControl {...aboutTextareaAttributes} />

          <div className="flex justify-end text-[11px] font-mono text-light-200/60">
            <span>{aboutLength} / min 20 characters</span>
          </div>
        </div>
      </div>
    );

  }

  function renderFormatSection() {

    const isVirtual = formik.values.isVirtualEvent;

    return (
      <div className="bg-dark-100/70 backdrop-blur-xl border border-border-dark rounded-2xl p-6 card-shadow flex flex-col gap-5">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          {isVirtual ? (
            <Globe className="w-4 h-4 text-blue" />
          ) : (
            <MapPin className="w-4 h-4 text-primary" />
          )}

          <h3 className="text-base font-semibold text-white">Event Format & Location</h3>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono uppercase tracking-wider text-light-200">
            Event Delivery Format *
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => formik.setFieldValue("isVirtualEvent", false)}
              className={cn(
                "flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                !isVirtual
                  ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_12px_rgba(93,254,202,0.1)]"
                  : "bg-dark-200/40 border-white/5 text-light-200 hover:bg-dark-200/80 hover:text-white"
              )}
            >
              <MapPin className="w-4 h-4 shrink-0" />

              <div className="flex flex-col">
                <span className="text-sm font-semibold">In-Person</span>

                <span className="text-[10px] text-light-200/60">Physical venue</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => formik.setFieldValue("isVirtualEvent", true)}
              className={cn(
                "flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                isVirtual
                  ? "bg-blue/10 border-blue/40 text-blue shadow-[0_0_12px_rgba(148,234,255,0.15)]"
                  : "bg-dark-200/40 border-white/5 text-light-200 hover:bg-dark-200/80 hover:text-white"
              )}
            >
              <Globe className="w-4 h-4 shrink-0" />

              <div className="flex flex-col">
                <span className="text-sm font-semibold">Virtual / Online</span>

                <span className="text-[10px] text-light-200/60">Live stream / meeting</span>
              </div>
            </button>
          </div>
        </div>

        {isVirtual ? (
          <FormInputControl {...virtualLinkInputAttributes} />
        ) : (
          <FormInputControl {...locationInputAttributes} />
        )}
      </div>
    );

  }

  function renderScheduleSection() {

    return (
      <div className="bg-dark-100/70 backdrop-blur-xl border border-border-dark rounded-2xl p-6 card-shadow flex flex-col gap-5">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <Calendar className="w-4 h-4 text-primary" />

          <h3 className="text-base font-semibold text-white">Date, Time & Language</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInputControl {...startAtInputAttributes} />

          <FormInputControl {...endAtInputAttributes} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInputControl {...languageInputAttributes} />

          <FormInputControl {...ageLimitInputAttributes} />
        </div>
      </div>
    );

  }

  function renderArtistSection() {

    return (
      <div className="bg-dark-100/70 backdrop-blur-xl border border-border-dark rounded-2xl p-6 card-shadow flex flex-col gap-5">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <User className="w-4 h-4 text-primary" />

          <h3 className="text-base font-semibold text-white">Speaker or Featured Artist (Optional)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInputControl {...artistNameInputAttributes} />

          <FormInputControl {...artistImageInputAttributes} />
        </div>
      </div>
    );

  }

  function renderSeoSection() {

    const tagsArray = formik.values.seoTags
      ? formik.values.seoTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    return (
      <div className="bg-dark-100/70 backdrop-blur-xl border border-border-dark rounded-2xl p-6 card-shadow flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <Tag className="w-4 h-4 text-primary" />

          <h3 className="text-base font-semibold text-white">SEO & Discovery</h3>
        </div>

        <FormInputControl {...seoTagsInputAttributes} />

        {tagsArray.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tagsArray.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-mono text-light-100 bg-dark-200 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1"
              >
                <span>#{tag}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    );

  }

  function renderPosterCard() {

    return (
      <div className="bg-dark-100/70 backdrop-blur-xl border border-border-dark rounded-2xl p-5 card-shadow flex flex-col gap-4">
        <ImagePreview
          imageUrl={formik.values.image}
          title={formik.values.title}
        />

        <FormInputControl {...imageUrlInputAttributes} />
      </div>
    );

  }

  function renderStatusCard() {

    return (
      <div className="bg-dark-100/70 backdrop-blur-xl border border-border-dark rounded-2xl p-5 card-shadow flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Publication Status</h3>

          <span className="text-[10px] font-mono text-light-200 uppercase">
            Current: {formik.values.status}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {Object.values(EventStatus).map((statusKey) => {

            const isSelected = formik.values.status === statusKey;
            const config = statusDescriptions[statusKey];

            return (
              <button
                key={statusKey}
                type="button"
                onClick={() => formik.setFieldValue("status", statusKey)}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
                  isSelected
                    ? "bg-dark-200 border-primary/50 shadow-[0_0_10px_rgba(93,254,202,0.12)]"
                    : "bg-dark-200/30 border-white/5 hover:bg-dark-200/60"
                )}
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                    config.colorClass
                  )}
                />

                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">
                    {config.label}
                  </span>

                  <span className="text-[11px] text-light-200/70">
                    {config.desc}
                  </span>
                </div>
              </button>
            );

          })}
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <button {...submitButtonAttributes}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />

                <span>Saving Event...</span>
              </>
            ) : (
              <span>{mode === "edit" ? "Save Changes" : "Create Event"}</span>
            )}
          </button>

          <Link {...cancelButtonAttributes}>
            Cancel
          </Link>
        </div>
      </div>
    );

  }

  return (
    <div className="flex flex-col w-full pb-16">

      {renderHeader()}

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

          {renderBasicInfoSection()}

          {renderFormatSection()}

          {renderScheduleSection()}

          {renderArtistSection()}

          {renderSeoSection()}

        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sticky top-24">

          {renderPosterCard()}

          {renderStatusCard()}

        </div>

      </form>

    </div>
  );

};

export default EventEditor;
