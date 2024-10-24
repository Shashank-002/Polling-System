import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { apiClient } from "../composables/use-api-call";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const state = {
    user: ref(null),
    authToken: ref(localStorage.getItem("authToken")),
    roles: ref([]),
  };

  const router = useRouter();

  const { user, authToken, roles } = storeToRefs(state);

  //  login api call
  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/user/login", {
        email,
        password,
      });

      if (response.data.user && response.data.token) {
        authToken.value = response.data.token;
        user.value = response.data.user;
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        localStorage.setItem("authToken", response.data.token);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data.message || "Login failed.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  //  signup api call
  const signup = async ({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    roleId,
  }) => {
    try {
      const response = await apiClient.post("/user/register", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        roleId,
      });

      if (response.data) {
        return {
          success: true,
          user: response.data,
        };
      } else {
        if (response.data.error) {
          const fieldErrors = response.data.error;
          return {
            success: false,
            error: fieldErrors,
          };
        }
        return {
          success: false,
          error: response.data.message || "Signup failed.",
        };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data || "Signup failed. Please try again.";

      if (
        typeof errorMessage === "string" &&
        errorMessage.includes("Duplicate entry")
      ) {
        return {
          success: false,
          error: "The email you entered is already registered.",
        };
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // fetch roles
  const fetchRoles = async () => {
    try {
      const response = await apiClient.get("/role/list");
      roles.value = response.data || [];
      if (roles.value.length === 0) {
        console.log("No roles fetched from API.");
      }
    } catch (error) {
      console.error(
        "Failed to fetch roles:",
        error.response?.data || error.message
      );
    }
  };

  const logout = () => {
    authToken.value = null;
    user.value = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push({ name: "PollLoginPage" });
  };

  return {
    user,
    authToken,
    login,
    roles,
    signup,
    logout,
    fetchRoles,
  };
});
