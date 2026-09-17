import { useEffect, useState } from "react";
import { X, Building2, User, Loader2, Save, Sparkles, Globe, MapPin } from "lucide-react";

import FormInputControl from "@/components/formControls/FormInputControl";
import FormTextareaControl from "@/components/formControls/FormTextareaControl";
import { UserStatus } from "@/lib/constants";
import { cn } from "@/lib/utils/common";

import { useUpdateOrganizer } from "./service";
import { IEditOrganizerFormValues, IUserListItem } from "./types";

interface EditOrganizerModalProps {
  user: IUserListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditOrganizerModal = ({
  user,
  isOpen,
  onClose,
}: EditOrganizerModalProps) => {

  const [formValues, setFormValues] = useState<IEditOrganizerFormValues>({
    firstname: "",
    lastname: "",
    status: UserStatus.ACTIVE,
    organizationName: "",
    tagLine: "",
    website: "",
    address: "",
    about: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof IEditOrganizerFormValues, string>>>({});

  const { mutate: updateOrganizer, isPending } = useUpdateOrganizer();

  useEffect(() => {

    if (user) {
      setFormValues({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        status: user.status || UserStatus.ACTIVE,
        organizationName: user.organization?.organizationName || "",
        tagLine: user.organization?.tagLine || "",
        website: user.organization?.website || "",
        address: user.organization?.address || "",
        about: user.organization?.about || "",
      });
      setErrors({});
    }

  }, [user]);

  useEffect(() => {

    function handleKeyDown(e: KeyboardEvent) {

      if (e.key === "Escape" && !isPending) {
        onClose();
      }

    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [isOpen, onClose, isPending]);

  if (!isOpen || !user) {
    return null;
  }

  function validate() {

    const newErrors: Partial<Record<keyof IEditOrganizerFormValues, string>> = {};

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

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  }

  function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (!validate()) {
      return;
    }

    updateOrganizer(
      {
        userId: user._id,
        data: formValues,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );

  }

  function handleChange(field: keyof IEditOrganizerFormValues, value: string) {

    setFormValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

  }

  const backdropAttributes = {
    className:
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200",
    onClick: isPending ? undefined : onClose,
  };

  const modalContainerAttributes = {
    className:
      "relative w-full max-w-2xl bg-dark-100 border border-border-dark rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col text-left max-h-[90vh]",
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
  };

  const closeButtonAttributes = {
    type: "button" as const,
    onClick: onClose,
    disabled: isPending,
    className:
      "absolute top-4 right-4 z-20 w-9 h-9 rounded-xl bg-dark-200/80 hover:bg-dark-200 text-light-200 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50",
    "aria-label": "Close modal",
  };

  const scrollBodyAttributes = {
    className:
      "flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
  };

  const formAttributes = {
    onSubmit: handleSubmit,
    className: "flex flex-col flex-1 overflow-hidden",
  };

  const firstNameControlAttributes = {
    label: "First Name",
    name: "firstname",
    value: formValues.firstname,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("firstname", e.target.value),
    error: errors.firstname,
    disabled: isPending,
  };

  const lastNameControlAttributes = {
    label: "Last Name",
    name: "lastname",
    value: formValues.lastname,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("lastname", e.target.value),
    error: errors.lastname,
    disabled: isPending,
  };

  const organizationNameControlAttributes = {
    label: "Organization Name",
    name: "organizationName",
    value: formValues.organizationName,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("organizationName", e.target.value),
    error: errors.organizationName,
    disabled: isPending,
  };

  const tagLineControlAttributes = {
    label: "Tagline",
    name: "tagLine",
    value: formValues.tagLine || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("tagLine", e.target.value),
    placeholder: "e.g. Empowering Next-Gen Developers",
    disabled: isPending,
  };

  const websiteControlAttributes = {
    label: "Website URL",
    name: "website",
    value: formValues.website || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("website", e.target.value),
    placeholder: "https://example.com",
    disabled: isPending,
  };

  const addressControlAttributes = {
    label: "Address / Headquarters",
    name: "address",
    value: formValues.address || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("address", e.target.value),
    placeholder: "e.g. San Francisco, CA",
    disabled: isPending,
  };

  const aboutControlAttributes = {
    label: "About Organization",
    name: "about",
    value: formValues.about || "",
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      handleChange("about", e.target.value),
    placeholder: "Brief description of the organization and events hosted...",
    rows: 3,
    disabled: isPending,
  };

  const submitButtonAttributes = {
    type: "submit" as const,
    disabled: isPending,
    className:
      "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-primary text-black hover:bg-primary/90 transition-all duration-150 shadow-[0_0_15px_rgba(93,254,202,0.3)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
  };

  const cancelButtonAttributes = {
    type: "button" as const,
    onClick: onClose,
    disabled: isPending,
    className:
      "px-5 py-2.5 rounded-xl text-xs font-semibold bg-dark-200 text-light-100 hover:text-white border border-white/10 hover:border-white/20 transition-colors cursor-pointer disabled:opacity-50",
  };

  function renderModalHeader() {

    return (
      <div className="p-6 border-b border-border-dark flex items-start gap-4 shrink-0">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Building2 className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1 pr-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />

            <span>Organizer Moderation</span>
          </div>

          <h2 className="text-xl font-bold text-white">Edit Organizer Details</h2>

          <p className="text-xs text-light-200">
            Update organizer representative contact details and organization profiles.
          </p>
        </div>
      </div>
    );

  }

  function renderUserSection() {

    return (
      <div className="p-4 rounded-xl bg-dark-200/40 border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase">
          <User className="w-4 h-4" />

          <span>Personal & Account Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInputControl {...firstNameControlAttributes} />

          <FormInputControl {...lastNameControlAttributes} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-light-100 text-sm font-medium">
              Email Address (Read Only)
            </label>

            <input
              type="text"
              value={user?.email || ""}
              disabled
              className="bg-dark-200/50 text-light-200/60 rounded-[6px] px-5 py-2.5 border border-white/5 cursor-not-allowed font-mono text-xs"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-light-100 text-sm font-medium">
              Account Status
            </label>

            <select
              value={formValues.status}
              onChange={(e) =>
                handleChange("status", e.target.value as UserStatus)
              }
              disabled={isPending}
              className={cn(
                "bg-dark-200 text-light-100 rounded-[6px] px-4 py-2.5 border border-white/10 focus:border-primary/50 font-mono text-xs cursor-pointer",
                formValues.status === UserStatus.ACTIVE
                  ? "text-emerald-400"
                  : "text-rose-400"
              )}
            >
              <option value={UserStatus.ACTIVE} className="bg-dark-100 text-emerald-400">
                Active
              </option>

              <option value={UserStatus.SUSPENDED} className="bg-dark-100 text-rose-400">
                Suspended
              </option>
            </select>
          </div>
        </div>
      </div>
    );

  }

  function renderOrganizationSection() {

    return (
      <div className="p-4 rounded-xl bg-dark-200/40 border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase">
          <Building2 className="w-4 h-4" />

          <span>Organization Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInputControl {...organizationNameControlAttributes} />

          <FormInputControl {...tagLineControlAttributes} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInputControl {...websiteControlAttributes} />

          <FormInputControl {...addressControlAttributes} />
        </div>

        <FormTextareaControl {...aboutControlAttributes} />
      </div>
    );

  }

  function renderModalFooter() {

    return (
      <div className="px-6 py-4 border-t border-border-dark bg-dark-200/30 flex items-center justify-end gap-3 shrink-0">
        <button {...cancelButtonAttributes}>
          Cancel
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
    <div {...backdropAttributes}>
      <div {...modalContainerAttributes}>

        <button {...closeButtonAttributes}>
          <X className="w-4 h-4" />
        </button>

        {renderModalHeader()}

        <form {...formAttributes}>

          <div {...scrollBodyAttributes}>

            {renderUserSection()}

            {renderOrganizationSection()}

          </div>

          {renderModalFooter()}

        </form>

      </div>
    </div>
  );

};

export default EditOrganizerModal;
