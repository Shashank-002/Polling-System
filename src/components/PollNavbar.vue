<template>
    <nav class="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <!-- Left side: Navigation links -->
        <div class="flex space-x-4">
            <router-link to="/polls" class="text-gray-800 hover:text-gray-600">Polls</router-link>
            <router-link v-if="isAdmin" to="/add-poll" class="text-gray-800 hover:text-gray-600">Add Poll</router-link>
            <router-link v-if="isAdmin" to="/create-user" class="text-gray-800 hover:text-gray-600">Create
                User</router-link>
            <router-link v-if="isAdmin" to="/list-users" class="text-gray-800 hover:text-gray-600">List
                Users</router-link>
        </div>

        <!-- Right side: User avatar with dropdown -->
        <div class="relative" @click="toggleDropdown">
            <div class="flex items-center cursor-pointer">
                <img src="https://via.placeholder.com/40" alt="User Avatar"
                    class="w-10 h-10 rounded-full object-cover" />
                <div class="ml-2 text-gray-800">
                    <div class="text-sm font-semibold">{{ userName }}</div>
                    <div class="text-xs text-gray-600">{{ userEmail }}</div>
                </div>
            </div>

            <!-- Dropdown menu -->
            <div v-if="isDropdownOpen"
                class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button @click="logout"
                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from "@/stores/auth-store";

const authStore = useAuthStore();
const router = useRouter();
const isDropdownOpen = ref(false);

// User information from the auth store
const userName = computed(() => authStore.user.name);
const userEmail = computed(() => authStore.user.email);
const isAdmin = computed(() => authStore.user.role === 'admin');

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const logout = () => {
    authStore.logout();
    router.push('/login');
};
</script>