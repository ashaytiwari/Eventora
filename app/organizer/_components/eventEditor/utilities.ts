import * as yup from "yup";

import { messages } from "@/lib/constants";
import { EventStatus } from "@/lib/constants/eventStatus";

export interface IEventFormValues {
  title: string;
  about: string;
  image: string;
  startAt: string;
  endAt: string;
  language: string;
  isVirtualEvent: boolean;
  virtualEventLink: string;
  eventLocation: string;
  ageLimit: string;
  status: EventStatus;
  seoTags: string;
  artistName: string;
  artistImage: string;
}

export const defaultEventFormValues: IEventFormValues = {
  title: "",
  about: "",
  image: "",
  startAt: "",
  endAt: "",
  language: "English",
  isVirtualEvent: false,
  virtualEventLink: "",
  eventLocation: "",
  ageLimit: "",
  status: EventStatus.DRAFT,
  seoTags: "",
  artistName: "",
  artistImage: "",
};

export const eventValidationSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .min(2, messages.createEvent.titleMustBeAtleast2CharLong)
    .required("Title is required"),

  about: yup
    .string()
    .trim()
    .min(20, messages.createEvent.aboutMustBeAtleast20CharLong)
    .required("About description is required"),

  image: yup
    .string()
    .trim()
    .url("Please enter a valid image URL")
    .required("Poster image URL is required"),

  startAt: yup
    .string()
    .required("Start date and time is required"),

  endAt: yup
    .string()
    .required("End date and time is required")
    .test(
      "is-after-start",
      "End date must be later than start date",
      function (value) {
        const { startAt } = this.parent;
        if (!startAt || !value) return true;
        return new Date(value).getTime() > new Date(startAt).getTime();
      }
    ),

  language: yup
    .string()
    .trim()
    .required("Language is required"),

  isVirtualEvent: yup
    .boolean()
    .default(false),

  virtualEventLink: yup
    .string()
    .trim()
    .when("isVirtualEvent", {
      is: true,
      then: (schema) =>
        schema
          .url("Please enter a valid URL for the virtual event link")
          .required("Virtual event link is required when event is virtual"),
      otherwise: (schema) => schema.notRequired(),
    }),

  eventLocation: yup
    .string()
    .trim()
    .when("isVirtualEvent", {
      is: false,
      then: (schema) =>
        schema.required("Event location address is required for in-person events"),
      otherwise: (schema) => schema.notRequired(),
    }),

  ageLimit: yup
    .number()
    .typeError("Age limit must be a valid number")
    .min(0, "Age limit cannot be negative")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),

  status: yup
    .mixed<EventStatus>()
    .oneOf(Object.values(EventStatus), "Please select a valid event status")
    .required("Status is required"),

  seoTags: yup.string(),

  artistName: yup.string().trim(),

  artistImage: yup
    .string()
    .trim()
    .url("Please enter a valid URL for artist image"),
});

export function formatFormValuesToDto(values: IEventFormValues) {

  const tags = values.seoTags
    ? values.seoTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const artist =
    values.artistName?.trim() || values.artistImage?.trim()
      ? {
          name: values.artistName?.trim() || "",
          image: values.artistImage?.trim() || "",
        }
      : undefined;

  return {
    title: values.title.trim(),
    about: values.about.trim(),
    image: values.image.trim(),
    startAt: new Date(values.startAt).toISOString(),
    endAt: new Date(values.endAt).toISOString(),
    language: values.language.trim(),
    isVirtualEvent: Boolean(values.isVirtualEvent),
    virtualEventLink: values.isVirtualEvent && values.virtualEventLink
      ? values.virtualEventLink.trim()
      : undefined,
    eventLocation: !values.isVirtualEvent && values.eventLocation
      ? values.eventLocation.trim()
      : undefined,
    ageLimit: values.ageLimit ? Number(values.ageLimit) : undefined,
    status: values.status,
    seoTags: tags,
    artist,
  };

}

export function formatEventToFormValues(event: any): IEventFormValues {

  function toLocalDatetimeInput(dateValue?: string | Date) {

    if (!dateValue) return "";

    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return "";

    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;

  }

  return {
    title: event.title || "",
    about: event.about || "",
    image: event.image || "",
    startAt: toLocalDatetimeInput(event.startAt),
    endAt: toLocalDatetimeInput(event.endAt),
    language: event.language || "English",
    isVirtualEvent: Boolean(event.isVirtualEvent),
    virtualEventLink: event.virtualEventLink || "",
    eventLocation: event.eventLocation || "",
    ageLimit: event.ageLimit !== undefined && event.ageLimit !== null ? String(event.ageLimit) : "",
    status: event.status || EventStatus.DRAFT,
    seoTags: Array.isArray(event.seoTags) ? event.seoTags.join(", ") : "",
    artistName: event.artist?.name || "",
    artistImage: event.artist?.image || "",
  };

}
