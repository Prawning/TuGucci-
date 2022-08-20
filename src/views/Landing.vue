<template>
    <div class="main flex flex-col items-center justify-center w-screen h-screen">
        <h1 class="font-primary text-secondary text-center text-[26rem]">
            Tu Gucci?
        </h1>

        <div class="buttons flex flex-col font-secondary gap-4">
            <button class="button" @click="$router.push('/login')">
                Sign In
            </button>

            <button class="button" @click="$router.push('/register')">
                Sign Up
            </button>
        </div>
    </div>
</template>

<script>
    export default {
    }
</script>

<style scoped>
    .button {
        @apply w-full h-full py-4 px-8 bg-quaternary text-4xl rounded-2xl text-white;
    }
    
    body {
        @apply bg-primary;
    }
    .main {
    }
</style>