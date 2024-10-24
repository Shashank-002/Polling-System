<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-lg bg-white border border-gray-300 rounded-lg shadow-lg p-8 my-10">
            <h2 class="text-3xl font-extrabold text-center mb-8">Sign Up</h2>
            <form @submit.prevent="handleSignup">
                <!-- First Name -->
                <div class="mb-4">
                    <label class="block text-gray-700 font-semibold mb-2" for="first-name">First Name</label>
                    <input type="text" id="first-name" v-model="formData.firstName"
                        @input="validateFieldError('firstName')"
                        class="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your first name" />
                    <p v-if="formErrors.firstNameError" class="text-red-500 text-sm mt-1">{{ formErrors.firstNameError
                        }}</p>
                </div>

                <!-- Last Name -->
                <div class="mb-4">
                    <label class="block text-gray-700 font-semibold mb-2" for="last-name">Last Name</label>
                    <input type="text" id="last-name" v-model="formData.lastName"
                        @input="validateFieldError('lastName')"
                        class="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your last name" />
                    <p v-if="formErrors.lastNameError" class="text-red-500 text-sm mt-1">{{ formErrors.lastNameError }}
                    </p>
                </div>

                <!-- Email Address -->
                <div class="mb-4">
                    <label class="block text-gray-600 text-left font-semibold mb-2" for="email">Email Address</label>
                    <input type="email" id="email" v-model="formData.email" @input="validateFieldError('email')"
                        @keydown.enter.prevent
                        class="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
                        placeholder="Email" />
                    <p v-if="formErrors.emailError" class="text-red-500 text-sm text-left mt-2">{{ formErrors.emailError
                        }}</p>
                </div>

                <!-- Role -->
                <div class="mb-4 relative">
                    <label class="block text-gray-700 font-semibold mb-2" for="role">Role</label>
                    <div class="relative">
                        <select id="role" v-model="formData.roleId" @change="validateFieldError('roleId')"
                            class="w-full border border-gray-300 rounded-md py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            style="appearance: none;">
                            <option value="" disabled>Select a role</option>
                            <option v-for="role in roles" :key="role.id" :value="String(role.id)">
                                {{ role.name }}
                            </option>
                        </select>
                        <i
                            class="fa fa-caret-down absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"></i>
                    </div>

                    <p v-if="formErrors.roleIdError" class="text-red-500 text-sm mt-1">{{ formErrors.roleIdError }}</p>
                </div>


                <!-- Password -->
                <div class="mb-4">
                    <label class="block text-gray-700 font-semibold mb-2" for="password">Password</label>
                    <PasswordToggle :password="formData.password" @input="(event) => {
                        formData.password = event;
                        validateFieldError('password');
                    }" />
                    <p v-if="formErrors.passwordError" class="text-red-500 text-sm mt-1">{{ formErrors.passwordError }}
                    </p>
                </div>

                <!-- Confirm Password -->
                <div class="mb-6">
                    <label class="block text-gray-700 font-semibold mb-2" for="confirm-password">Confirm
                        Password</label>
                    <PasswordToggle :password="formData.confirmPassword" @input="(event) => {
                        formData.confirmPassword = event;
                        validateFieldError('confirmPassword');
                    }" />
                    <p v-if="formErrors.confirmPasswordError" class="text-red-500 text-sm mt-1">{{
                        formErrors.confirmPasswordError }}</p>
                </div>

                <!-- Sign Up Button -->
                <div class="flex justify-center">
                    <BaseButton :isLoading="loading" :buttonText="'Sign Up'" @click="handleSignup" />
                </div>

                <p class="text-center text-gray-600 mt-6 text-sm">
                    Already registered? <RouterLink to="/"><span class="text-blue-500">Sign in</span></RouterLink>
                </p>
            </form>
            <SuccessMsgModal :message="'You have successfully signed up!'" :isOpen="isModalOpen"
                @close="handleModalClose" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PasswordToggle from '@/components/PasswordToggle.vue';
import BaseButton from '@/components/BaseButton.vue';
import { useSignup } from '@/composables/use-signup';
import SuccessMsgModal from '@/components/SuccessMsgModal.vue';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const { formData, formErrors, loading, handleSignup, validateFieldError, isModalOpen } = useSignup();
const roles = ref([]);

onMounted(async () => {
    await authStore.fetchRoles();
    roles.value = authStore.roles;
});


const handleModalClose = () => {
    isModalOpen.value = false;
    router.push('/');
};
</script>
