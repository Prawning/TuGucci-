<template>
    <div class="goal_board absolute mt-36 lg:w-[55vw] lg:h-[70vh] w-[90vw] lg:p-20 flex flex-col gap-10 py-12 lg:py-20">
        <ul class="flex flex-col items-start gap-10 w-full h-[30vh] overflow-x-hidden overflow-y-auto flex-nowrap z-10">
            <li v-for="goal, index in goals" v-bind:key="index" @click="increase_score">
                {{goal.data}}
            </li>
        </ul>

        <div class="w-full z-10 flex flex-col items-center justify-center gap-10">
            <textarea name="entry" id="goal_new_entry" class="h-[15vh] w-full"></textarea>
            <button id="add_goal" class="entry_button lg:w-1/4 w-[70vw] h-2/12 lg:text-5xl text-2xl">New Goal!</button>
        </div>

        <div class="absolute bottom-0 lg:text-9xl text-4xl font-primary text-tertiary">
            Score: 
        </div>
        <div class="absolute bottom-0 right-10 lg:text-9xl text-4xl font-primary text-tertiary">
            {{ score }}
        </div>
    </div>
</template>

<script setup>
    import {collection, addDoc, getDocs, query, where, updateDoc, onSnapshot} from "firebase/firestore";
    import {db, auth}from "../main.js";
    import {ref, onMounted} from "vue";
    const props = defineProps({
        goalToggle: {
            required: true,
        }
    });

    const goals = ref([]);
    const score = ref(0);
    onMounted( () => {
        var user_uid = auth.currentUser.uid;
        const score_q = query(collection(db, "users"), where("user_uid", "==", user_uid));
        onSnapshot(score_q, (query_snapshot) => {
            query_snapshot.forEach((doc) => {
                score.value = doc.data().score;
            });
        });

        const q = query(collection(db, "goals"), where("user_uid", "==", user_uid));
        onSnapshot(q, (query_snapshot) => {
            const data = [];
            query_snapshot.forEach((doc) => {
                data.push({id: doc.id, data: doc.data().goal});
            });
            goals.value = data;
        });
        document.querySelector(".goal_board").style.opacity = props.goalToggle;
        document.querySelector(".entry_button").addEventListener("click", add_goal);
    })

    function add_goal() {
        var value = document.getElementById("goal_new_entry").value;
        try {
            addDoc(collection(db, "goals"), {
                user_uid: auth.currentUser.uid,
                goal: value,
            });
        } catch (e) {
            console.log(e);
        }
        document.getElementById("goal_new_entry").value = "";
    }

    async function increase_score() { // todo make animation
        var user_uid = auth.currentUser.uid;
        console.log("click");
        const score_q = query(collection(db, "users"), where("user_uid", "==", user_uid));
        const query_snapshot = await getDocs(score_q);
        query_snapshot.forEach((doc) => {
            updateDoc(doc.ref, {
                score: doc.data().score + 1,
            });
        });
    }
</script>

<script>
    import gsap from "gsap";
    export default {
        watch: {
            goalToggle: function() {
                gsap.to(".goal_board", {opacity: this.goalToggle, duration: 0.5, delay: 1.5 * this.goalToggle});
            }
        }
    }
</script>

<style scoped>
    li {
        @apply text-quaternary font-secondary lg:text-5xl text-3xl border-b-2 border-secondary pb-4 w-full;
    }

    .entry_button {
        @apply bg-tertiary text-white rounded-3xl p-5;
    }
</style>
