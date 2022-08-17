<template>
    <div class="main flex flex-col items-center justify-center w-screen h-screen">
        <h1 class="font-primary text-secondary text-[26rem]">
            Tu Gucci?
        </h1>

        <div class="buttons flex flex-col font-secondary gap-4">
            <button class="button" @click="$router.push('/home')">
                Sign In
            </button>

            <button class="button">
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

    .main {
        background: url("../assets/landing/bg.svg") no-repeat;
        background-size: cover;
    }
</style>