<template>
    <div class="w-screen lg:h-screen flex flex-col items-center justify-center">
        <div class="faq_wrapper flex flex-col items-center justify-center h-full lg:mt-0 mt-[35rem] gap-10">
            <h1 class="lg:text-[10rem] text-6xl font-primary text-center text-secondary">
                TuGucci FAQ
            </h1>
            <ul class="lg:w-[70vw] w-[90vw] flex flex-col items-start justify-center gap-10">
                <li>
                    <h2 class="lg:text-4xl font-primary text-quaternary">
                        What is TuGucci?
                    </h2>
                    <p class="lg:text-3xl font-secondary text-quinary">
                        TuGucci is a web application that we made as part of our Advanced Software Engineering class. The purpose of TuGucci is to be a relaxing mental health tracker
                    </p>
                </li>

                <li>
                    <h2>
                        What was used for the background?
                    </h2>
                    <p>
                        We used Blender to shape the model, and used Three.js to render it on the browser
                    </p>
                </li>

                <li>
                    <h2>
                        How was the snow made?
                    </h2>

                    <p>
                        The snow was created in Three.js, and animated using GLSL shaders
                    </p>
                </li>

                <li>
                    <h2>
                        Was the webpage built using a framework?
                    </h2>

                    <p>
                        Yes! We used Vue and TailwindCSS for the front end, while using Firebase PaaS for the backend
                    </p>
                </li>

                <li>
                    <h2>
                        How were the animations made?
                    </h2>

                    <p>
                        The animations were done using GSAP, allowing for smooth transitions between features
                    </p>
                </li>

                <li>
                    <h2>
                        What was used for the sentiment analysis?
                    </h2>

                    <p>
                        We used Google's Natural Language API to perform sentiment analysis on the user's journal entries. It was set up by using a Docker container around a Flask API, which was then deploy to Google Cloud Functions
                        The sentiment analysis happens as soon as the user submits their journal entry, and the results are stored in our Firestore database. Lastly, we used Chart.js to display the results in a graph
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style scoped>
    h2 {
        @apply lg:text-4xl text-2xl font-primary text-quaternary;
    }

    p {
        @apply lg:text-3xl text-lg font-secondary text-quinary;
    }

    ul {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(100px);
        @apply rounded-xl py-10;
    }

    li {
        @apply px-10 py-2;
    }
</style>