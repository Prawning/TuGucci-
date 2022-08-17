<template>
    <router-view class="w-screen"/>
</template>

<script>
    export default {
        components: {
        }
    }

</script>

<style>
    html, body {
        @apply bg-primary mt-0 pt-0;
    }

    ::-webkit-scrollbar {
        width: 0.5rem;
    }

    ::-webkit-scrollbar-track {
        background: hsla(0, 0%, 100%, 0.1);
    }

    ::-webkit-scrollbar-thumb {
        background: hsla(0, 0%, 100%, 0.2);
    }

    @supports (scrollbar-color: red blue) {
        * {
            scrollbar-color: hsla(0, 0%, 100%, 0.1), hsla(0, 0%, 100%, 0.1);
            scrollbar-width: thin;
        }
    }
</style>
