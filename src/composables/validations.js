export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
// Enhanced password validation
export const isValidPassword = (password) => {
  return password.trim().length > 0;
};
export const validateField = (value, fieldName) => {
  if (!value.trim()) {
    return `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    } is required.`;
  }
  return "";
};
export const validateForm = (formData) => {
  let errors = {};
  let isFormValid = true;
  Object.keys(formData).forEach((key) => {
    const errorData = validateField(formData[key], key, formData);
    errors[key] = errorData;
    if (errorData.length) {
      isFormValid = false;
    }
  });
  return { errors, isFormValid };
};
