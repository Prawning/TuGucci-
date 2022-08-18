<template>
    <div class="main flex flex-col items-center justify-center w-screen gap-10">
        <h1 class="text-[10rem] text-secondary font-primary" v-bind:id="user">
            Everything will be gucci, {{user}}!
        </h1>

        <div class="top_bar w-[70vw] flex justify-between px-10">
            <div class="flex flex-row gap-10">
                <div class="achievement_toggle" @click=toggle_achievements>
                    Today's Achievements!
                </div>

                <div class="score mr-10" style="opacity: 0">
                    Score: {{ score }}
                </div>
            </div>

            <div>
                <div class="journal_toggle" @click=toggle_journal>
                    Journal
                </div>
            </div>
        </div>

        <div class="goals w-[70vw] h-[65vh] rounded-2xl relative flex flex-col gap-10">
            <ul class="w-full flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto flex-nowrap h-full list shadow-lg" style="opacity:0">
                <li>
                    Go for a short walk!
                </li>

                <li>
                    Drink Water!
                </li>

                <li>
                    Get out of bed!
                </li> 
            </ul>

            <ul class="absolute w-full flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto flex-nowrap h-full journal shadow-lg" style="opacity:0">
                <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae expedita praesentium nostrum corrupti eos amet dolore quo facere optio neque, culpa architecto asperiores inventore tempore atque sed alias officia officiis dicta, magnam quos. Quia, laborum velit eius et necessitatibus laboriosam consectetur! Cumque neque eius delectus excepturi dicta ullam ipsum consequatur! Enim eos quae magnam minus provident ut quisquam itaque! Nisi assumenda cum tempora, in ab cupiditate debitis qui corporis harum molestias voluptatum doloribus aperiam placeat, at rem. Tempora ut eos molestiae corporis rem eum et numquam, delectus hic quam natus enim quae dicta ab non quis officiis in velit nemo.
                </li>
            </ul>
        </div>

        <div class="nav flex items-center justify-between w-[65vw]">
            <router-link to="/questions" class="links">
                Questionnaire
            </router-link>

            <router-link to="" class="links">
                Add to journal
            </router-link>

            <router-link to="/aww" class="links">
                Cute things!
            </router-link>
        </div>
    </div>
</template>

<script>
    import gsap from 'gsap';
    var achievements = 0;
    var journal = 0;
    export default {
        data: () => ({
            user: "Prawn",
            score: 0,
        }),
        methods: {
            toggle_achievements,
            toggle_journal,
        }
    }

    function toggle_achievements() {
        achievements = 1 - achievements;
        if (journal && achievements) {
            toggle_journal();
        }
        gsap.to(".score", {opacity: achievements, duration: 0.5});
        gsap.to(".list", {opacity: achievements, duration: 0.5});
    }

    function toggle_journal() {
        journal = 1 - journal;
        if (achievements && journal) {
            toggle_achievements();
        }
        gsap.to(".journal", {opacity: journal, duration: 0.5});
    }
</script>

<style scoped>

    ul {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        @apply rounded-2xl;
    }

    li {
        @apply text-5xl font-primary text-tertiary w-[99%] border-b-2 p-10 border-primary;
    }

    .links {
        @apply text-3xl font-secondary text-quinary
    }

    .top_bar {
        @apply text-5xl font-secondary text-quinary;
    }
</style>