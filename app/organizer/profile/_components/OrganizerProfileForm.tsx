import { useEffect, useState } from "react";
import { User, Building2, Save, RotateCcw, Loader2, CheckCircle2, Globe, MapPin, Layers } from "lucide-react";

import FormInputControl from "@/components/formControls/FormInputControl";
import FormTextareaControl from "@/components/formControls/FormTextareaControl";

import { useUpdateOrganizerProfile } from "./service";
import { IOrganizerProfileFormValues, IOrganizerProfileResponse } from "./types";

interface OrganizerProfileFormProps {
  profile: IOrganizerProfileResponse | undefined;
  userId: string;
}

const OrganizerProfileForm = ({
  profile,
  userId,
}: OrganizerProfileFormProps) => {

  const [formValues, setFormValues] = useState<IOrganizerProfileFormValues>({
    firstname: "",
    lastname: "",
    organizationName: "",
    tagLine: "",
    website: "",
    address: "",
    about: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof IOrganizerProfileFormValues, string>>>({});

  const { mutate: updateProfile, isPending } = useUpdateOrganizerProfile(userId);

  useEffect(() => {

    if (profile) {
      setFormValues({
        firstname: profile.firstname || "",
        lastname: profile.lastname || "",
        organizationName: profile.organization?.organizationName || "",
        tagLine: profile.organization?.tagLine || "",
        website: profile.organization?.website || "",
        address: profile.organization?.address || "",
        about: profile.organization?.about || "",
      });
      setErrors({});
    }

  }, [profile]);

  function handleReset() {

    if (profile) {
      setFormValues({
        firstname: profile.firstname || "",
        lastname: profile.lastname || "",
        organizationName: profile.organization?.organizationName || "",
        tagLine: profile.organization?.tagLine || "",
        website: profile.organization?.website || "",
        address: profile.organization?.address || "",
        about: profile.organization?.about || "",
      });
      setErrors({});
    }

  }

  function validate() {

    const newErrors: Partial<Record<keyof IOrganizerProfileFormValues, string>> = {};

    if (!formValues.firstname.trim()) {
      newErrors.firstname = "First name is required";
    } else if (formValues.firstname.trim().length < 2) {
      newErrors.firstname = "First name must be at least 2 characters";
    }

    if (!formValues.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    } else if (formValues.lastname.trim().length < 2) {
      newErrors.lastname = "Last name must be at least 2 characters";
    }

    if (!formValues.organizationName.trim()) {
      newErrors.organizationName = "Organization name is required";
    } else if (formValues.organizationName.trim().length < 2) {
      newErrors.organizationName = "Organization name must be at least 2 characters";
    }

    if (formValues.about.trim() && formValues.about.trim().length < 20) {
      newErrors.about = "About description must be at least 20 characters";
    }

    if (formValues.website.trim()) {
      try {
        new URL(formValues.website.trim());
      } catch {
        newErrors.website = "Please enter a valid website URL (e.g. https://example.com)";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  }

  function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (!validate()) {
      return;
    }

    updateProfile(formValues);

  }

  function handleChange(field: keyof IOrganizerProfileFormValues, value: string) {

    setFormValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

  }

  const formAttributes = {
    onSubmit: handleSubmit,
    className: "flex flex-col gap-8 w-full",
  };

  const cardAttributes = {
    className:
      "bg-dark-100/70 backdrop-blur-xl border border-border-dark rounded-2xl p-6 sm:p-8 card-shadow flex flex-col gap-6",
  };

  const firstNameControlAttributes = {
    label: "First Name",
    name: "firstname",
    value: formValues.firstname,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("firstname", e.target.value),
    placeholder: "e.g. Jane",
    error: errors.firstname,
    disabled: isPending,
  };

  const lastNameControlAttributes = {
    label: "Last Name",
    name: "lastname",
    value: formValues.lastname,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("lastname", e.target.value),
    placeholder: "e.g. Doe",
    error: errors.lastname,
    disabled: isPending,
  };

  const organizationNameControlAttributes = {
    label: "Organization / Company Name",
    name: "organizationName",
    value: formValues.organizationName,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("organizationName", e.target.value),
    placeholder: "e.g. CloudTech Innovations",
    error: errors.organizationName,
    disabled: isPending,
  };

  const tagLineControlAttributes = {
    label: "Organization Tagline / Slogan",
    name: "tagLine",
    value: formValues.tagLine,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("tagLine", e.target.value),
    placeholder: "e.g. Building the Future of Developer Experience",
    error: errors.tagLine,
    disabled: isPending,
  };

  const websiteControlAttributes = {
    label: "Official Website URL",
    name: "website",
    value: formValues.website,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("website", e.target.value),
    placeholder: "https://yourcompany.com",
    error: errors.website,
    disabled: isPending,
  };

  const addressControlAttributes = {
    label: "Headquarters / Office Address",
    name: "address",
    value: formValues.address,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("address", e.target.value),
    placeholder: "e.g. San Francisco, California, USA",
    error: errors.address,
    disabled: isPending,
  };

  const aboutControlAttributes = {
    label: "About Organization",
    name: "about",
    value: formValues.about,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      handleChange("about", e.target.value),
    placeholder:
      "Tell attendees about your organization, past conferences, mission, and upcoming tech initiatives...",
    error: errors.about,
    rows: 4,
    disabled: isPending,
  };

  const submitButtonAttributes = {
    type: "submit" as const,
    disabled: isPending,
    className:
      "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-primary text-black hover:bg-primary/90 transition-all duration-200 shadow-[0_0_20px_rgba(93,254,202,0.35)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
  };

  const discardButtonAttributes = {
    type: "button" as const,
    onClick: handleReset,
    disabled: isPending,
    className:
      "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-dark-200 text-light-100 hover:text-white border border-white/10 hover:border-white/20 transition-colors cursor-pointer disabled:opacity-50",
  };

  function renderPersonalInfoSection() {

    return (
      <div {...cardAttributes}>
        <div className="flex items-center justify-between pb-4 border-b border-border-dark">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <User className="w-4 h-4" />
            </div>

            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-white">
                Representative Information
              </h3>

              <span className="text-xs text-light-200">
                Primary contact person responsible for organizer management.
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInputControl {...firstNameControlAttributes} />

          <FormInputControl {...lastNameControlAttributes} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-light-100 text-sm font-medium">
            Account Email Address (Read-Only)
          </label>

          <div className="relative">
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="w-full bg-dark-200/50 text-light-200/70 rounded-[6px] px-5 py-2.5 border border-white/5 font-mono text-xs cursor-not-allowed"
            />

            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />

              <span>Verified</span>
            </div>
          </div>

          <span className="text-[11px] text-light-200/60">
            Email is tied to your organizer credentials and cannot be modified directly.
          </span>
        </div>
      </div>
    );

  }

  function renderOrganizationDetailsSection() {

    return (
      <div {...cardAttributes}>
        <div className="flex items-center justify-between pb-4 border-b border-border-dark">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Building2 className="w-4 h-4" />
            </div>

            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-white">
                Organization Profile
              </h3>

              <span className="text-xs text-light-200">
                Public branding and information displayed across your published events.
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInputControl {...organizationNameControlAttributes} />

          <FormInputControl {...tagLineControlAttributes} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInputControl {...websiteControlAttributes} />

          <FormInputControl {...addressControlAttributes} />
        </div>

        <FormTextareaControl {...aboutControlAttributes} />
      </div>
    );

  }

  function renderFormActions() {

    return (
      <div className="flex items-center justify-end gap-3 pt-2">
        <button {...discardButtonAttributes}>
          <RotateCcw className="w-3.5 h-3.5" />

          <span>Discard Changes</span>
        </button>

        <button {...submitButtonAttributes}>
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />

              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />

              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    );

  }

  return (
    <form {...formAttributes}>

      {renderPersonalInfoSection()}

      {renderOrganizationDetailsSection()}

      {renderFormActions()}

    </form>
  );

};

export default OrganizerProfileForm;
