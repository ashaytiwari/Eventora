import * as yup from 'yup';

export const changePasswordValidationSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .required('Old password is required'),
  newPassword: yup
    .string()
    .min(8, 'New password must be at least 8 characters long')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});
