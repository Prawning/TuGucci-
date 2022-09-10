<template>
    <NavBar @init=init_toggle id = "nav-comp" data-music-0 style="z-index: 1" class="fixed h-screen z-100" />
    <router-view class="w-screen h-screen" @achievements=achievement_toggle @quest=quest_toggle @book=book_toggle @init=init_toggle @house=house_toggle @chart=chart_toggle @reset=reset_toggle style = "z-index: 0" />
    <canvas class="webgl" data-logged=0 data-ach=1 data-quest=1 data-book=1 data-house=1 data-chart=1></canvas>
</template>

<script>
    import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
    import {ref} from "vue";
    import NavBar from "./components/NavBar.vue";

    var auth;
    const isLoggedIn = ref(false);
    export default {
        components: {
            NavBar
        },
        methods: {
            achievement_toggle,
            quest_toggle,
            book_toggle,
            init_toggle,
            house_toggle,
            chart_toggle,
            reset_toggle,
            add_music() {
                const nav = document.querySelector(".navbar");
                if (nav.lastElementChild.classList.contains("logout") || nav.lastElementChild.classList.contains("faq")) {
                    setTimeout(() => {
                        var iframe = document.createElement("div");
                        iframe.innerHTML= `<iframe width="100%" class="sound" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1329699604%3Fsecret_token%3Ds-4lhAPab5L8q&color=%2384848c&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=falsee&visual=false"></iframe>`;
                        nav.appendChild(iframe);
                    }, 3000)
                }
                window.removeEventListener("click", this.add_music);
            }
        },
        mounted() {
            auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    isLoggedIn.value = true;
                } else {
                    isLoggedIn.value = false;
                }
            });

            // window.addEventListener("click", this.add_music);
        },
        data() {
            return {
                isLoggedIn,
                reset: false
            }
        },
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

    function init_toggle() {
        const canvas = document.querySelector(".webgl");
        canvas.dataset.logged = 1 - canvas.dataset.logged;
    }

    function house_toggle() {
        const canvas = document.querySelector(".webgl");
        canvas.dataset.house = 1 - canvas.dataset.house;
    }

    function chart_toggle() {
        const canvas = document.querySelector(".webgl");
        canvas.dataset.chart = 1 - canvas.dataset.chart;
    }
    
    function reset_toggle() {
        const canvas = document.querySelector(".webgl");
        canvas.dataset.quest = 1;
        canvas.dataset.book = 1;
        canvas.dataset.house = 1;
        canvas.dataset.chart = 1;
        canvas.dataset.ach = 1;
        canvas.dataset.logged = 0;
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

    :root {
        font-size: max(11px, calc(0.3vw + 0.5vh));
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
