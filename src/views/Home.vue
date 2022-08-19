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
        </div>

        <div class="goal_board absolute mt-36 w-[55vw] h-[70vh] p-20" style="opacity: 0;">
            <ul class="flex flex-col items-start gap-10 w-full h-[55vh]">
                <li>
                    Get Out Of Bed!
                </li>

                <li>
                    Drink Water!
                </li>

                <li>
                    Eat a meal!
                </li>

                <li>
                    Take a shower!
                </li>

                <li>
                    Do some work!
                </li>
            </ul>

            <div class="absolute bottom-0 text-9xl font-primary text-tertiary">
                Score: 
            </div>
            <div class="absolute bottom-0 right-10 text-9xl font-primary text-tertiary">
                {{ score }}
            </div>
        </div>

        <div id="daily_journal" class = "absolute w-[80vw] h-[80vh] flex flex-col items-center justify-center p-20" style="opacity:0;">
            <ul class="flex flex-col flex-nowrap w-full items-center h-[70vh] gap-2 overflow-x-hidden">
                <li>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni enim necessitatibus, dolor odio voluptatum voluptate rem veniam corporis quod consequuntur!
                </li>

                <li>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam quasi quaerat adipisci temporibus! Numquam magni optio aliquam! Dolores sint blanditiis, architecto placeat nostrum itaque, fugit repudiandae facere quibusdam recusandae in!
                </li>

                <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt pariatur atque quo corrupti vero enim obcaecati vitae deserunt est, doloribus repellat at necessitatibus magni consequatur modi, soluta ex? Quasi vero earum iste explicabo nam in voluptatem numquam dolorem enim, excepturi laborum quos maxime cum mollitia, consectetur a. Consectetur sunt quo eaque, quisquam nobis consequatur, adipisci porro rem minus esse quas provident dolorum modi est. Ipsam veniam sunt optio tempora illo, unde magni in rem at rerum eveniet eius autem dolorum quidem recusandae labore odio, necessitatibus ex blanditiis consequatur dolore voluptatem ullam aperiam placeat. Fugiat, ab molestias. Assumenda, esse. Repellendus, numquam.
                </li>

                <li>
                    Lorem.
                </li>

                <li>
                    Lorem, ipsum.
                </li>

                <li>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus, maiores?
                </li>

                <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In, esse!
                </li>

                <li>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, mollitia.
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import gsap from 'gsap';
    var achievements = 0;
    var journal = 0;
    var questions = 0;
    export default {
        data: () => ({
            user: "Prawn",
            score: 100,
        }),
        methods: {
            toggle_achievements,
            toggle_journal,
            toggle_questions,
        },
        mounted() {
            const title = document.querySelector(".title");
            setTimeout(() => {
                gsap.to(title, {opacity: 0, duration: 1});
            }, 3000);
        }
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
        gsap.to(".goal_board", {opacity: achievements, duration: 0.5, delay: achievements, onComplete: () => {
                button.style.pointerEvents = "auto";
        }});

    }

    function toggle_journal() {
        var button = document.querySelector(".book");
        button.style.pointerEvents = "none";
        journal = 1 - journal;
        gsap.to(".goal", {opacity: 1-journal, duration: 1});
        gsap.to(".quest", {opacity: 1-journal, duration: 1});
        gsap.to(".journal", {opacity: journal, duration: 0.5});
        1 - journal ? visibility = "visible" : visibility = "hidden";
        gsap.to(".goal", {visibility: visibility, delay: 0.1, duration: 0.1});
        gsap.to(".quest", {visibility: visibility, delay: 0.1, duration: 0.1});
        this.$emit("book");
        gsap.to("#daily_journal", {opacity: journal, duration: 0.5, delay: journal * 3, onComplete: () => {
                button.style.pointerEvents = "auto";
        }});
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

    li {
        @apply text-quaternary font-secondary text-5xl border-b-2 border-secondary pb-4 w-full;
    }

    #daily_journal > * > li {
        background: rgba(255, 255, 255, 0.21);
        text-shadow: 1px 1px black;
        backdrop-filter: blur(10px);
        @apply p-4 rounded-2xl border-b-0;
    }
</style>