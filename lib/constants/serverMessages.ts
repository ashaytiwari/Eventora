export const serverMessages = {
  validationError: 'Validation Error',
  users: {
    register: {
      success: "Registration successful. Please verify your email.",
      emailAlreadyRegistered: "Email is already registered."
    },
    emailVerification: {
      success: "Email verified successfully."
    },
    login: {
      invalidCredentials: "Invalid email or password.",
      accountInactive: "Your account is inactive. Please contact the administrator.",
      emailNotVerified: "Your email is not verified. Please verify your email."
    },
    forgotPassword: {
      success: "If an account with this email exists, a reset password link has been sent."
    },
    resetPassword: {
      success: "Password reset successful. You can now login with your new password."
    }
  }
};