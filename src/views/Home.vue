<template>
    <div class="main flex flex-col items-center justify-center w-screen gap-10">
        <h1 class="text-[10rem] text-secondary font-primary">
            You will be gucci, { user }!
        </h1>

        <div class="goals w-[70vw] h-[70vh] rounded-2xl shadow-lg">
            <ul class="w-full flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto flex-nowrap h-[100%]">
                <li>
                    Eat something
                </li>
                <li>
                    Lorem ipsum,    
                </li>
                <li>
                    dolor sit amet consectetur
                </li>
                <li>
                    adipisicing elit.
                </li>
                <li>
                    Ducimus ratione maxime 
                </li>
                <li>
                    aspernatur omnis cumque
                </li>
                <li>
                    atque numquam quae
                </li>
                <li>
                    impedit illo quidem.
                </li>
                <li>
                    Lorem, ipsum dolor.
                </li>
                <li>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, eligendi.
                </li>
            </ul>
        </div>

        <div class="nav flex items-center justify-around w-[70vw]">
            <router-link to="" class="links">
                Continue the questionnaire
            </router-link>

            <router-link to="" class="links">
                Grounding Techniques
            </router-link>

            <router-link to="/aww" class="links">
                Cute things!
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
    }
</script>

<style scoped>

    .goals {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
    }

    li {
        @apply text-5xl font-primary text-tertiary w-[99%] border-b-2 p-10 border-primary;
    }

    .links {
        @apply text-3xl font-secondary text-quinary
    }
</style>