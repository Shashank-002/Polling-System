<template>
    <nav class="flex justify-between items-center bg-[#10898d] p-4">
        <!-- Left side - Navigation Links -->
        <div class="hidden lg:flex space-x-4 text-white">
            <router-link to="/poll-list" active-class="bg-teal-500 text-white rounded-md shadow-lg px-4 py-2"
                class="py-2">Polls</router-link>
            <router-link to="/add-poll" active-class="bg-red-500 text-white rounded-md shadow-lg px-4 py-2"
                v-if="isAdmin" class="py-2">Add Poll</router-link>
            <router-link to="/create-user" active-class="bg-red-500 text-white rounded-md shadow-lg px-4 py-2"
                v-if="isAdmin" class="py-2">Create User</router-link>
            <router-link to="/list-user" active-class="bg-red-500 text-white rounded-md shadow-lg px-4 py-2"
                v-if="isAdmin" class="py-2">List Users</router-link>
        </div>

        <div class="lg:hidden">
            <!-- Only show hamburger for admin users -->
            <button v-if="isAdmin" @click="toggleHamburger" class="text-white focus:outline-none">
                <i class="fa fa-bars text-2xl"></i>
            </button>
            <!-- Show "Polls" link directly for employees on small screens -->
            <router-link v-if="!isAdmin" to="/poll-list"
                active-class="bg-red-500 text-white rounded-md shadow-lg px-4 py-2"
                class="text-white">Polls</router-link>
        </div>

        <!-- Hamburger Menu Drawer -->
        <div class="lg:hidden fixed top-20 left-0 h-full w-48 bg-[#10898d] text-white flex flex-col space-y-2 p-4 transition-transform duration-300 ease-in-out"
            :class="{ 'translate-x-0': hamburgerOpen, '-translate-x-full': !hamburgerOpen }">
            <router-link to="/poll-list" active-class="bg-teal-500 text-white rounded-md shadow-lg px-4 py-2"
                class="px-4">Polls</router-link>
            <router-link to="/add-poll" v-if="isAdmin"
                active-class="bg-red-500 text-white rounded-md shadow-lg px-4 py-2" class="px-4">Add Poll</router-link>
            <router-link to="/create-user" v-if="isAdmin"
                active-class="bg-red-500 text-white rounded-md shadow-lg px-4 py-2" class="px-4">Create
                User</router-link>
            <router-link to="/list-user" v-if="isAdmin"
                active-class="bg-red-500 text-white rounded-md shadow-lg px-4 py-2" class="px-4">List
                Users</router-link>
        </div>

        <!-- Right side - User Avatar and Dropdown -->
        <div class="relative text-white" ref="dropdownContainer">
            <button @click="toggleDropdown" class="flex items-center space-x-2">
                <img src="../assets/avatar1.png" alt="User Avatar" class="w-12 h-12 rounded-full" />
            </button>

            <!-- Dropdown Menu -->
            <div v-if="dropdownVisible" class="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md w-48">
                <div class="px-4 py-4 text-sm text-gray-700">
                    <p class="font-semibold">{{ userName }}</p>
                    <p class="text-gray-500">{{ userEmail }}</p>
                </div>
                <div class="px-4 py-2">
                    <button @click="logout"
                        class="w-full px-4 py-2 text-left bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">Logout</button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from "@/stores/auth-store";

const authStore = useAuthStore();
const dropdownVisible = ref(false);
const hamburgerOpen = ref(false);
const dropdownContainer = ref(null);

onMounted(async () => {
    await authStore.fetchRoles();
    authStore.loadUserData();
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

const userName = computed(() => authStore.user?.firstName);
const userEmail = computed(() => authStore.user?.email);
const isAdmin = computed(() => {
    const userRoleId = authStore.user?.roleId;
    const adminRole = authStore.roles.find(role => role.name.toLowerCase() === "admin");
    return adminRole && userRoleId === adminRole.id;
});

const toggleDropdown = () => {
    dropdownVisible.value = !dropdownVisible.value;
};

const toggleHamburger = () => {
    hamburgerOpen.value = !hamburgerOpen.value;
};

const logout = () => {
    authStore.logout();
};

// Close dropdown if clicking outside of dropdown or avatar
const handleClickOutside = (event) => {
    if (dropdownVisible.value && dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
        dropdownVisible.value = false;
    }
};
</script>
