<template>
    <div class="main flex flex-col items-center justify-center w-screen h-screen gap-10">
        <h1 class="text-[10rem] text-secondary font-primary title" v-bind:id="user">
            Everything will be gucci, {{user}}!
        </h1>

        <div class="control_bar fixed bottom-10 side_bar w-screen flex justify-evenly gap-10 text-5xl font-primary text-secondary">
            <div class="cta goal" @click=toggle_achievements style="visibility:visible">
                View Today's Goals
            </div>

            <div class="cta book" @click=toggle_journal style="visibility:visible">
                Journal
            </div>

            <div class="cta quest" @click=toggle_questions style="visibility:visible">
                Questions
            </div>

            <!-- <div class="cta" @click=test_api>
                Test API
            </div> -->
        </div>

        <DailyGoals class="goal_board" :goal-toggle = goal_toggle />

        <Journal id="daily_journal" :journal-toggle = journal_toggle />
    </div>
</template>

<script>
    import gsap from 'gsap';
    import DailyGoals from '../components/DailyGoals.vue';
    import Journal from '../components/Journal.vue';
    import {auth} from '../main.js';
    import axios from 'axios';
    var achievements = 0;
    var journal = 0;
    var questions = 0;
    export default {
        data: () => ({
            user: "",
            score: 100,
            journal_toggle: 0,
            goal_toggle: 0,
        }),
        methods: {
            toggle_achievements,
            toggle_journal,
            toggle_questions,
            toggle_init,
            test_api
        },
        mounted() {
            const title = document.querySelector(".title");
            setTimeout(() => {
                gsap.to(title, {opacity: 0, duration: 1});
            }, 3000);
            this.user = auth.currentUser.displayName;
            this.toggle_init();
        },
        components: {
            DailyGoals,
            Journal,
        },
    }

    var visibility = "hidden";
    function toggle_achievements() {
        var button = document.querySelector(".goal");
        button.style.pointerEvents = "none";
        achievements = 1 - achievements;
        1 - achievements ? visibility = "visible" : visibility = "hidden";
        gsap.to(".book", {opacity: 1-achievements, duration: 0.1});
        gsap.to(".quest", {opacity: 1-achievements, duration: 0.1});
        gsap.to(".book", {visibility: visibility, delay: 0.1, duration: 0.1});
        gsap.to(".quest", {visibility: visibility, delay: 0.1, duration: 0.1});
        this.$emit("achievements");
        this.goal_toggle = 1 - this.goal_toggle;
        setTimeout(() => {
            button.style.pointerEvents = "auto";
        }, 1000);
    }

    function toggle_journal() {
        var button = document.querySelector(".book");
        button.style.pointerEvents = "none";
        journal = 1 - journal;
        gsap.to(".goal", {opacity: 1-journal, duration: 1});
        gsap.to(".quest", {opacity: 1-journal, duration: 1});
        1 - journal ? visibility = "visible" : visibility = "hidden";
        gsap.to(".goal", {visibility: visibility, delay: 0.1, duration: 0.1});
        gsap.to(".quest", {visibility: visibility, delay: 0.1, duration: 0.1});
        this.$emit("book");
        this.journal_toggle = 1 - this.journal_toggle;
        setTimeout(() => {
            button.style.pointerEvents = "auto";
        }, 3000);
    }

    function toggle_questions() {
        var button = document.querySelector(".quest");
        button.style.pointerEvents = "none";
        questions = 1 - questions;
        gsap.to(".goal", {opacity: 1-questions, duration: 1});
        gsap.to(".book", {opacity: 1-questions, duration: 1});
        gsap.to(".questions", {opacity: questions, duration: 0.5});
        1 - journal ? visibility = "visible" : visibility = "hidden";
        gsap.to(".goal", {visibility: visibility, delay: 0.1, duration: 0.1});
        gsap.to(".book", {visibility: visibility, delay: 0.1, duration: 0.1});
        this.$emit("quest");
        this.$router.push("/questions");
    }

    function toggle_init() {
        this.$emit("init");
    }

    function test_api() {
        this.$router.push("/sentiment");    
    }
</script>

<style scoped>

    .title {
        text-shadow: 2px 2px #000000;
    }

    .cta {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        text-shadow: 1px 0px white;
        @apply px-8 py-4 rounded-md shadow-lg cursor-pointer;
    }

</style>