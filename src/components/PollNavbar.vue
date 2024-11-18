<!-- pollNavbar.vue -->
<template>
    <nav class="fixed top-0 left-0 w-full z-50 flex justify-between items-center bg-[#10898d] p-4">
        <!-- Left side - Navigation Links -->
        <div class="hidden lg:flex space-x-4">
            <NavItem v-for="(item, index) in menuItems" :key="index" :item="item" :isActive="activeRoute === item.to"
                :isAdmin="isAdmin" />
        </div>

        <!-- Hamburger Menu for Admin (Mobile) -->
        <div class="lg:hidden">
            <button v-if="isAdmin" @click="toggleHamburger" class="text-white focus:outline-none">
                <i class="fa fa-bars text-2xl"></i>
            </button>
            <router-link v-if="!isAdmin" to="/poll-list"
                class="text-white bg-teal-500 rounded-md shadow-lg py-2 px-4">Polls</router-link>
        </div>

        <!-- Mobile Drawer Menu -->
        <div class="lg:hidden fixed top-20 left-0 h-full w-48 bg-[#10898d] text-white flex flex-col p-4 transition-transform duration-300 ease-in-out"
            :class="{ 'translate-x-0': hamburgerOpen, '-translate-x-full': !hamburgerOpen }">
            <NavItem v-for="(item, index) in menuItems" :key="index" :item="item" :isActive="activeRoute === item.to"
                :isAdmin="isAdmin" class="mb-4" />
        </div>

        <!-- Right side - User Avatar and Dropdown -->
        <div class="relative text-white">
            <button @click="toggleDropdown" class="flex items-center space-x-2">
                <img src="../assets/avatar1.png" alt="User Avatar" class="w-12 h-12 rounded-full" />
            </button>

            <!-- Modal Overlay -->
            <div v-if="dropdownVisible" class="fixed inset-0 bg-transparent bg-opacity-0 z-50" @click="closeModal">
                <div class="absolute right-4 top-16 mt-2 bg-white text-black shadow-lg rounded-md w-48 py-2 px-2"
                    @click.stop>
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
        </div>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth-store';
import NavItem from './NavItem.vue';
import menuItems from '../data/menuItems.json';
import { ADMIN_ROLE_ID } from '../composables/constants'

const authStore = useAuthStore();
const dropdownVisible = ref(false);
const hamburgerOpen = ref(false);

const activeRoute = ref('');

const user = computed(() => authStore.user || {});
const isAdmin = computed(() => {
    return user.value?.roleId === ADMIN_ROLE_ID;
});

const toggleDropdown = () => {
    dropdownVisible.value = !dropdownVisible.value;
};

const closeModal = () => {
    dropdownVisible.value = false;
};

const toggleHamburger = (event) => {
    hamburgerOpen.value = !hamburgerOpen.value;
    event.stopPropagation();
};

const logout = () => {
    authStore.logout();
};

onMounted(() => {
    authStore.loadUserData();
});
</script>