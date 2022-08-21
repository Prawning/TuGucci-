<template>
    <div class = "main_journal absolute w-[80vw] h-[80vh] flex items-center justify-center p-20 gap-24">
        <ul class="flex flex-col flex-nowrap w-1/2 items-center h-[70vh] gap-2 overflow-x-hidden relative">
            <li v-for="entry in journal_entries" :key="entry">
                {{entry.data}}
            </li>
        </ul>
        <div class="w-1/2 h-[70vh] z-10 flex flex-col gap-10">
            <textarea name="entry" id="new_entry" class="w-full h-[60vh]"></textarea>
            <button id="journal_entry" class="entry_button h-2/12 text-5xl z-30">Add Entry</button>
        </div>
    </div>
</template>

<script setup>
    import {collection, addDoc, query, where, onSnapshot} from "firebase/firestore";
    import {db, auth}from "../main.js";
    import {ref, onMounted} from "vue";
    import axios from "axios";
    const props = defineProps({
        journalToggle: {
            required: true,
        }
    });

    const journal_entries = ref([]);

    onMounted( () => {
        var user_uid = auth.currentUser.uid;
        const q = query(collection(db, "journals"), where("user_uid", "==", user_uid));
        onSnapshot(q, (query_snapshot) => {
            const data = [];
            query_snapshot.forEach((doc) => {
                data.push({id: doc.id, data: doc.data().entry});
            });
            journal_entries.value = data;
        });
        document.querySelector(".main_journal").style.opacity = props.journalToggle;
        document.querySelector("#journal_entry").addEventListener("click", add_entry);
    }) 

    function add_entry() {
        console.log("adding")
        var value = document.getElementById("new_entry").value;
        if (value === "") {
            console.log("empty");
            return;
        };

        try {
            addDoc(collection(db, "journals"), {
                user_uid: auth.currentUser.uid,
                entry: value,
                date: new Date(), // TODO format
            });
        } catch (e) {
            console.log(e);
        }
        var res = update_journal_bucket(value);
        document.getElementById("new_entry").value = "";
    }

    function update_journal_bucket(entry) {
        var uuid = auth.currentUser.uid;
        try {
            var res = axios.post(`/update_journal/${uuid}`, {
                entry: entry,
            });
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    }
    
</script>

<script>
    import gsap from "gsap";
    export default {
        watch: {
            journalToggle: function() {
                gsap.to(".main_journal", {opacity: this.journalToggle, delay: 3 * this.journalToggle, duration: 0.1});
            }
        }
    }
</script>


<style scoped>
    li {
        background: rgba(255, 255, 255, 0.21);
        text-shadow: 1px 1px black;
        backdrop-filter: blur(10px);
        @apply text-quaternary font-secondary text-5xl pb-4 w-full p-4 rounded-2xl;
    }

    textarea {
        background: rgba(255, 255, 255, 0.21);
        @apply font-secondary text-5xl rounded-2xl;
    }

    .entry_button {
        @apply bg-tertiary text-white rounded-3xl p-5 w-1/2 self-center;
    }
</style>