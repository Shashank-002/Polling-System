// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  return password.trim().length > 0;
};

export const validateField = (value, fieldName) => {
  if (!value.trim()) {
    return `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    } is required.`;
  }

  // Additional field-specific validation
  if (fieldName === "email" && !isValidEmail(value)) {
    return "Please enter a valid email address.";
  }
  return "";
};

// Validate form fields (for use in other components)
export const validateForm = (formData) => {
  let errors = {};
  let isFormValid = true;
  Object.keys(formData).forEach((key) => {
    const errorData = validateField(formData[key], key);
    errors[key] = errorData;
    if (errorData.length) {
      isFormValid = false;
    }
  });

  return { errors, isFormValid };
};
