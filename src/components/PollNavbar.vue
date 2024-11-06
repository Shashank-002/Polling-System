<!-- pollNavbar.vue -->
<template>
    <nav class="flex justify-between items-center bg-[#10898d] p-4">
        <!-- Left side - Navigation Links -->
        <div class="hidden lg:flex space-x-4">
            <NavItem v-for="(item, index) in filteredMenuItems" :key="index" :item="item"
                :isActive="activeRoute === item.to" />
        </div>

        <!-- Hamburger Menu for Admin (Mobile) -->
        <div class="lg:hidden">
            <button v-if="isAdmin" @click="toggleHamburger" class="text-white focus:outline-none">
                <i class="fa fa-bars text-2xl"></i>
            </button>
            <router-link v-if="!isAdmin" to="/poll-list" class="text-white bg-teal-500 rounded-md shadow-lg py-2 px-4">Polls</router-link>
        </div>

        <!-- Mobile Drawer Menu -->
        <div class="lg:hidden fixed top-20 left-0 h-full w-48 bg-[#10898d] text-white flex flex-col p-4 transition-transform duration-300 ease-in-out"
            :class="{ 'translate-x-0': hamburgerOpen, '-translate-x-full': !hamburgerOpen }" v-if="isAdmin">
            <NavItem v-for="(item, index) in filteredMenuItems" :key="index" :item="item"
                :isActive="activeRoute === item.to" />
        </div>

        <!-- Right side - User Avatar and Dropdown -->
        <div class="relative text-white" ref="dropdownContainer">
            <button @click="toggleDropdown" class="flex items-center space-x-2">
                <img src="../assets/avatar1.png" alt="User Avatar" class="w-12 h-12 rounded-full" />
            </button>

            <div v-if="dropdownVisible" class="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md w-48">
                <div class="px-4 py-4 text-sm text-gray-700">
                    <p class="font-semibold">{{ user.firstName }}</p>
                    <p class="text-gray-500">{{ user.email }}</p>
                </div>
                <div class="px-4 py-2">
                    <button @click="logout"
                        class="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">Logout</button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth-store';
import NavItem from './NavItem.vue';
import menuItems from '../data/menuItems.json';

const ADMIN_ROLE_NAME = 'admin';
const authStore = useAuthStore();
const dropdownVisible = ref(false);
const hamburgerOpen = ref(false);
const dropdownContainer = ref(null);

const activeRoute = ref('');

const fetchUserDetails = async () => {
    try {
        await authStore.fetchRoles();
        authStore.loadUserData();
        activeRoute.value = window.location.pathname;
        document.addEventListener('click', handleClickOutside);
    } catch (error) {
        console.error("Error initializing user data:", error);
    }
};

onMounted(() => {
    fetchUserDetails();
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

const user = computed(() => authStore.user || {});
const isAdmin = computed(() => {
    const userRoleId = authStore.user?.roleId;
    const adminRole = authStore.roles.find(role => role.name.toLowerCase() === ADMIN_ROLE_NAME);
    return adminRole && userRoleId === adminRole.id;
});

// Filter menu items based on the user's role
const filteredMenuItems = computed(() => {
    const role = isAdmin.value ? 'admin' : 'user';
    return menuItems.filter(item => item.roles.includes(role));
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

const handleClickOutside = (event) => {
    if (dropdownVisible.value && dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
        dropdownVisible.value = false;
    }
};
</script>