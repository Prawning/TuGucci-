<template>
    <div class="nav_wrapper">
        <div class="nav logo z-30" @click="animate_nav">
            <img src="../assets/prawn.gif" alt="Logo">
        </div>
        <div class="navbar flex flex-col w-[15rem] h-screen fixed top-0 left-0 gap-10 z-20" v-show="vis_nav">
            <div class="filler">

            </div>

            <div class="nav home" v-if="logged_in" @click="go_home">
                <div class="text">
                    Home
                </div>
            </div>

            <div class="account nav" v-if="logged_in" @click="$router.push('/account')">
                <div class="text">
                    Account
                </div>
            </div>

            <div class="about nav" @click="$router.push('/about')">
                <div class="text">
                    About
                </div>
            </div>

            <div class="faq nav" @click="$router.push('/faq')">
                <div class="text">
                    FAQ
                </div>
            </div>

            <div class="retour nav" v-if="logged_in">
                <div class="text">
                    Tour
                </div>
            </div>
            
            <div class="logout nav absolute bottom-0" v-if="logged_in" @click="logout">
                <div class="text">
                    Logout
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {auth} from '../main.js';
    import {useRouter} from 'vue-router';
    import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
    import {ref} from "vue";
    import gsap from "gsap";
    
    const router = useRouter();

    var logged_in = ref(false);
    var vis_nav = ref(0);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            logged_in.value = true;
        } else {
            logged_in.value = false;
        }
    });

    function logout() {
        signOut(auth).then(() => {
            router.push('/');
        }).catch((error) => {
            console.log(error);
        });
    }

    function animate_nav() {
        const nav = document.querySelector(".navbar");
        const logo = document.querySelector(".logo");
        vis_nav.value = 1 - vis_nav.value;
        gsap.to(nav, {scaleX: vis_nav.value, duration: 0.1});
        gsap.to(logo, {filter: vis_nav.value ? "grayscale(0)" : "grayscale(80%)", duration: 0.1});
    }

    window.addEventListener("click", (e) => {
        if (e.target.closest(".navbar") === null && e.target.closest(".logo") === null) {
            vis_nav.value = 0;
            gsap.to(document.querySelector(".logo"), {filter: vis_nav.value ? "grayscale(0)" : "grayscale(80%)", duration: 0.1});
        }
    })
</script>

<script>
    export default {
        methods: {
            go_home() {
                this.$emit("init");
                window.location.href = "/";
            }
        }
    }
</script>

<style>
    .nav {
        @apply text-4xl text-secondary font-primary cursor-pointer p-4 w-full;
    }

    .nav:hover {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
    }

    .navbar {
        @apply py-10;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        transform: scaleX(0);
        transform-origin: left;
    }

    .logo {
        @apply rounded-full w-[10rem] h-[10rem] fixed top-[2.5rem] left-0 ml-10 shadow-lg p-0;
        filter: grayscale(80%);
    }

    .text {
        @apply ml-10;
    }

    img {
        @apply w-full h-full rounded-full;
        object-fit: cover;
    }

    .filler {
        @apply h-[14rem];
    }

    .sound {
        filter: grayscale(80%);
        @apply p-10;
    }
</style>