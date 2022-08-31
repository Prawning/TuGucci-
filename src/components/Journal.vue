<template>
    <div class = "main_journal absolute w-[85vw] h-[80vh] flex lg:flex-row flex-col items-center justify-center lg:p-20 lg:gap-36 gap-10">
        <ul class="flex flex-col flex-nowrap lg:w-1/2 w-full items-center lg:h-[70vh] h-[60vh] gap-2 overflow-x-hidden relative lg:z-10">
            <li v-for="entry in journal_entries" :key="entry">
                {{entry.data}}
            </li>
        </ul>
        <div class="lg:w-1/2 w-full lg:h-[70vh] lg:z-10 flex flex-col gap-10">
            <textarea name="entry" id="new_entry" class="w-full lg:h-[60vh] h-10"></textarea>
            <button id="journal_entry" class="entry_button h-2/12 lg:text-5xl text-2xl lg:z-30">Add Entry</button>
        </div>

        <div class="journal_popup fixed lg:w-[25vw] w-[90vw] lg:h-[10vh] h-[30vh]" style="opacity: 0">
            
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
                data.push({id: doc.id, data: doc.data().entry, sorting: doc.data().date.toDate().getTime()});
            });
            data.sort((a, b) => a.sorting - b.sorting);
            journal_entries.value = data.reverse();
        });
        document.querySelector(".main_journal").style.opacity = props.journalToggle;
        document.querySelector("#journal_entry").addEventListener("click", add_entry);
    }) 

    async function add_entry() {
        var value = document.getElementById("new_entry").value;
        if (value === "") {
            console.log("empty");
            return;
        };
        var popup = document.querySelector(".journal_popup");
        gsap.to(popup, {duration: 0.1, opacity: 1, ease: "power3.inOut"});
        var popup_tween = gsap.to(popup, { text: {value: "Writing... ✏️", speed: 1}, yoyo: true, repeat: -1, ease: "power1.inOut"});
        document.getElementById("new_entry").value = "";
        // run sentiment analysis immediately
        var sentiment_response = await axios.post(`https://textsentiment-3arqmo4jra-as.a.run.app/api`, {
            entry: value,
        });

        var score = sentiment_response.data.score;
        var magnitude = sentiment_response.data.magnitude;
        try {
            addDoc(collection(db, "journals"), { // to firestore
                user_uid: auth.currentUser.uid,
                entry: value,
                date: new Date(), // TODO format
                score: score,
                magnitude: magnitude,
            });
            popup_tween.kill();
            gsap.to(popup, {text: ""});
            gsap.to(popup, {duration: 0.1, opacity: 0, ease: "power3.inOut"});
        } catch (e) {
            console.log(e);
            popup_tween.kill();
            gsap.to(popup, {text: ""});
            gsap.to(popup, {duration: 0.1, opacity: 0, ease: "power3.inOut"});
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
        backdrop-filter: blur(10px);
        @apply text-primary font-secondary lg:text-5xl text-3xl pb-4 w-full p-4 rounded-lg shadow-sm;
    }

    textarea {
        background: rgba(255, 255, 255, 0.21);
        @apply font-secondary lg:text-5xl text-3xl rounded-2xl;
    }

    .entry_button {
        @apply bg-tertiary text-white rounded-3xl p-5 w-1/2 self-center;
    }

    #new_entry {
        @apply p-20 text-primary font-primary;
    }

    .journal_popup {
        @apply top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-secondary text-white z-40 text-center flex items-center justify-center rounded-xl;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
    }
</style>