import { ref } from "vue";
// import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import { validateForm, validateField } from "@/composables/validations";
import { toast } from "vue3-toastify";

export const useSignup = () => {
  //   const router = useRouter();
  const authStore = useAuthStore();

  // Form data for signup fields
  const formData = ref({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: "",
  });

  // Error object to store field-specific errors
  const formErrors = ref({
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
    roleIdError: "",
  });

  const loading = ref(false);

  // Function to handle form submission and validation
  const handleSignup = async () => {
    loading.value = true;

    // Validate entire form
    const { errors, isFormValid } = validateForm(formData.value, true);
    formErrors.value = {
      firstNameError: errors.firstName || "",
      lastNameError: errors.lastName || "",
      emailError: errors.email || "",
      passwordError: errors.password || "",
      confirmPasswordError: errors.confirmPassword || "",
      roleIdError: errors.roleId || "",
    };

    // Stop the process if the form is invalid
    if (!isFormValid) {
      loading.value = false;
      return;
    }

    // Proceed with signup if the form is valid
    const { firstName, lastName, email, password, roleId } = formData.value;
    const signupResponse = await authStore.signup({
      firstName,
      lastName,
      email,
      password,
      roleId,
    });

    if (signupResponse.success) {
      //   router.push("/");
    } else {
      toast.error(signupResponse.error, {
        theme: "colored",
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }

    loading.value = false;
  };

  // Function to validate a specific field dynamically
  const validateFieldError = (field) => {
    const error = validateField(
      formData.value[field],
      field,
      formData.value,
      true
    );
    formErrors.value[`${field}Error`] = error;
  };

  return {
    loading,
    handleSignup,
    formData,
    formErrors,
    validateFieldError,
  };
};
