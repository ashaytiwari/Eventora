import React from 'react';

interface FormTextareaControlProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  error?: string;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const FormTextareaControl: React.FC<FormTextareaControlProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  className = '',
  rows = 4,
  ...rest
}) => {

  const textareaAttributes = {
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    id: name,
    rows,
    className: `bg-dark-200 text-light-100 rounded-[6px] px-5 py-2.5 border outline-none placeholder:text-light-200/50 transition-all duration-200 resize-y ${error
      ? 'border-red-500 focus:border-red-500'
      : 'border-white/10 focus:border-blue'
      }`,
    ...rest,
  };

  function renderError() {

    if (!error) {
      return;
    }

    return (
      <span className="text-red-500 text-sm mt-1">
        {error}
      </span>
    );

  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>

      <label htmlFor={name} className="text-light-100 text-sm font-medium">
        {label}
      </label>

      <textarea {...textareaAttributes} />

      {renderError()}

    </div>
  );

};

export default FormTextareaControl;
