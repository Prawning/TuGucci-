<template>
    <router-view class="w-screen" @achievements=achievement_toggle @quest=quest_toggle @book=book_toggle />
    <canvas class="webgl" data-ach=1 data-quest=1 data-book=1></canvas>
</template>

<script>
    export default {
        components: {
        },
        methods: {
            achievement_toggle,
            quest_toggle,
            book_toggle,
        }
    }

    function achievement_toggle() {
        const canvas = document.querySelector(".webgl");
        canvas.dataset.ach = 1 - canvas.dataset.ach;
    }

    function quest_toggle() {
        const canvas = document.querySelector(".webgl");
        canvas.dataset.quest = 1 - canvas.dataset.quest;
    }

    function book_toggle() {
        const canvas = document.querySelector(".webgl");
        canvas.dataset.book = 1 - canvas.dataset.book;
    }

</script>

<style>

    html {
        background: #25283D;
    }
    html, body {
        @apply mt-0 pt-0 overflow-x-hidden;
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

    .webgl {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100vw;
        height: 100vh;
    }
</style>
