// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?~`]).{8,}$/;

  return passwordRegex.test(password);
};

// Name validation
const isValidName = (name) => {
  return name.trim().length >= 4;
};

// Field validation
export const validateField = (
  value,
  fieldName,
  formData = {},
  isSignup = false
) => {
  if (!value.trim()) {
    let formattedFieldName =
      fieldName === "roleId"
        ? "Role"
        : fieldName
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/\b\w/g, (char) => char.toUpperCase());

    // Custom error message for roleId
    if (fieldName === "roleId") {
      return "Please select a role.";
    }

    return `${formattedFieldName} is required.`;
  }

  // Field-specific validation
  if (fieldName === "email" && !isValidEmail(value)) {
    return "Please enter a valid email address.";
  }

  if (fieldName === "firstName" && !isValidName(value)) {
    return `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    } must be at least 4 characters long.`;
  }

  // Password validation, but only for signup
  if (fieldName === "password" && isSignup) {
    const passwordError = isValidPassword(value)
      ? ""
      : "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    return passwordError;
  }

  // Confirm password validation for signup
  if (fieldName === "confirmPassword" && value !== formData.password) {
    return "Password do not match.";
  }

  return "";
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
