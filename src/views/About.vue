<template>
    <div class="w-screen h-screen flex items-center justify-center">
        <div class="w-[70vw] flex flex-col items-start justify-center gap-10 main_about">
            <h1 clsss="">
                Welcome to TuGucci!
            </h1>

            <p>
                TuGucci is a web application that we made as part of our Advanced Software Engineering class. The purpose of TuGucci is to be a relaxing mental health tracker
            </p>

            <p>
                To that extent, we have a few features that we hope will help you relax and keep track of your mental health. From the scenic background, to the calming music, to our sentiment analysis,
                we hope that you will be able to process your thoughts here, and keep track of your mental health.
            </p>

            <p>
                To learn more about how the application works, feel free to sign up for a free account, and take the tour!
            </p>

            <h2 class="text-5xl text-tertiary">
                Credits:
            </h2>

            <p>
                <u>Base Model</u>: <a href="https://skfb.ly/6QSKT"> "Forest House"</a> by peachyroyalty is licensed under Creative Commons Attribution-NonCommercial
            </p>
            <p>
                <u> Music</u>: Hateno Village from The Legend of Zelda: Breath of the Wild
            </p>

            <p>
                <u> Questionnaire</u>: Adapted from <a href="https://philome.la/jace_harr/you-feel-like-shit-an-interactive-self-care-guide/play/index.html"> https://philome.la/jace_harr/you-feel-like-shit-an-interactive-self-care-guide/play/index.html </a>
            </p>

            <p>
                <u> Group Leader</u>: Pranwanth
            </p>

            <p>
                <u> Lead Developer</u>: Jovian
            </p>

            <p>
                <u> Documentation</u>: Anant
            </p>


        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style scoped>

    h1 {
        @apply text-[10rem] font-primary text-secondary self-center;
    }
    p {
        @apply text-3xl text-quinary font-secondary text-left;
    }

    u {
        @apply text-3xl text-quaternary font-secondary text-left underline;
    }

    .main_about {
        @apply p-10 rounded-xl;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(50px);
    }
</style>