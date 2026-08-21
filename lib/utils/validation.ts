
import * as yup from 'yup';

export const validateYupFormSchema = (values: Record<string, string>, schema: any) => {
  try {
    schema.validateSync(values, { abortEarly: false });
    return {};
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return errors;
    }
    return {};
  }
};