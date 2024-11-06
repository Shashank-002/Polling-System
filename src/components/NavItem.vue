<!-- NavItem.vue -->
<template>
    <div v-if="item.roles.includes(isAdmin ? ADMIN_ROLE_ID : USER_ROLE_ID)">
        <router-link :to="item.to"
            :class="['py-2 px-4', isActive ? 'bg-teal-500 text-white rounded-md shadow-lg' : 'text-white']"
            active-class="bg-teal-500 text-white rounded-md shadow-lg">
            {{ item.label }}
        </router-link>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { ADMIN_ROLE_ID, USER_ROLE_ID } from '../composables/constants';

defineProps({
    item: {
        type: Object,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});
</script>