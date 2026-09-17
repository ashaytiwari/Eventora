import { useEffect, useState } from "react";
import { X, Building2, Mail, Loader2, Sparkles, UserPlus } from "lucide-react";

import FormInputControl from "@/components/formControls/FormInputControl";

import { useAddOrganizer } from "./service";
import { IAddOrganizerFormValues } from "./types";

interface AddOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialValues: IAddOrganizerFormValues = {
  firstname: "",
  lastname: "",
  email: "",
  organizationName: "",
};

const AddOrganizerModal = ({
  isOpen,
  onClose,
}: AddOrganizerModalProps) => {

  const [formValues, setFormValues] = useState<IAddOrganizerFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof IAddOrganizerFormValues, string>>>({});

  const { mutate: addOrganizer, isPending } = useAddOrganizer();

  useEffect(() => {

    function handleKeyDown(e: KeyboardEvent) {

      if (e.key === "Escape" && !isPending) {
        onClose();
      }

    }

    if (isOpen) {
      setFormValues(initialValues);
      setErrors({});
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

  if (!isOpen) {
    return null;
  }

  function validate() {

    const newErrors: Partial<Record<keyof IAddOrganizerFormValues, string>> = {};

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

    if (!formValues.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formValues.email.trim())) {
      newErrors.email = "Please enter a valid email address";
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

    addOrganizer(formValues, {
      onSuccess: () => {
        onClose();
      },
    });

  }

  function handleChange(field: keyof IAddOrganizerFormValues, value: string) {

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
      "relative w-full max-w-lg bg-dark-100 border border-border-dark rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col text-left",
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

  const formAttributes = {
    onSubmit: handleSubmit,
    className: "flex flex-col",
  };

  const firstNameControlAttributes = {
    label: "First Name",
    name: "firstname",
    value: formValues.firstname,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("firstname", e.target.value),
    placeholder: "e.g. John",
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

  const emailControlAttributes = {
    label: "Email Address",
    name: "email",
    type: "email",
    value: formValues.email,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("email", e.target.value),
    placeholder: "e.g. organizer@company.com",
    error: errors.email,
    disabled: isPending,
  };

  const organizationNameControlAttributes = {
    label: "Organization / Company Name",
    name: "organizationName",
    value: formValues.organizationName,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange("organizationName", e.target.value),
    placeholder: "e.g. Acme Tech Labs",
    error: errors.organizationName,
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
      <div className="p-6 border-b border-border-dark flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <UserPlus className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1 pr-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />

            <span>Organizer Onboarding</span>
          </div>

          <h2 className="text-xl font-bold text-white">Add Event Organizer</h2>

          <p className="text-xs text-light-200">
            Create an organizer account. A temporary password and login link will be emailed automatically.
          </p>
        </div>
      </div>
    );

  }

  function renderFormFields() {

    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInputControl {...firstNameControlAttributes} />

          <FormInputControl {...lastNameControlAttributes} />
        </div>

        <FormInputControl {...emailControlAttributes} />

        <FormInputControl {...organizationNameControlAttributes} />

        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3 text-xs text-light-100">
          <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />

          <p className="leading-relaxed">
            Upon submission, an invitation email with credentials and first-time login instructions will be sent to the organizer.
          </p>
        </div>
      </div>
    );

  }

  function renderModalFooter() {

    return (
      <div className="px-6 py-4 border-t border-border-dark bg-dark-200/30 flex items-center justify-end gap-3">
        <button {...cancelButtonAttributes}>
          Cancel
        </button>

        <button {...submitButtonAttributes}>
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />

              <span>Onboarding Organizer...</span>
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4" />

              <span>Onboard Organizer</span>
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

          {renderFormFields()}

          {renderModalFooter()}

        </form>

      </div>
    </div>
  );

};

export default AddOrganizerModal;
