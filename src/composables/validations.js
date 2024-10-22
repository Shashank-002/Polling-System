// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  return password.trim().length >= 8;
};

export const validateField = (
  value,
  fieldName,
  formData = {},
  isSignup = false
) => {
  if (!value.trim()) {
    return `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    } is required.`;
  }

  // Field-specific validation
  if (fieldName === "email" && !isValidEmail(value)) {
    return "Please enter a valid email address.";
  }

  // Password validation, but only for signup
  if (fieldName === "password" && isSignup && !isValidPassword(value)) {
    return "Password must be at least 8 characters long.";
  }

  // Confirm password validation for signup
  if (fieldName === "confirmPassword" && value !== formData.password) {
    return "Passwords do not match.";
  }

  if (fieldName === "role" && value === "") {
    return "Please select a role.";
  }

  return ""; // No error
};

// Validate form fields (for use in other components)
export const validateForm = (formData, isSignup = false) => {
  let errors = {};
  let isFormValid = true;

  Object.keys(formData).forEach((key) => {
    const errorData = validateField(formData[key], key, formData, isSignup);
    errors[key] = errorData;
    if (errorData.length) {
      isFormValid = false;
    }
  });

  return { errors, isFormValid };
};
