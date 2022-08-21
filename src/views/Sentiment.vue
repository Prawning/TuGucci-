<template>
    <div class = "w-screen h-screen text-5xl flex flex-col gap-10 items-center justify-center">
        <div v-for="object in sentiments" :key="object">
            {{object.time_created}}: {{object.score}}
        </div>
    </div>
</template>

<script setup>
    import {db, auth} from '../main.js';
    import {ref, onMounted} from 'vue';
    import {collection, addDoc, query, where, onSnapshot} from "firebase/firestore";
    import axios from 'axios';
    const uuid = auth.currentUser.uid;

    const sentiments = ref([]);

    function load_sentiment_firestore() {
        var uuid = auth.currentUser.uid;
        const q = query(collection(db, "journals"), where("user_uid", "==", uuid));
        onSnapshot(q, (query_snapshot) => {
            const data = [];
            query_snapshot.forEach((doc) => {
                var date = doc.data().date.toDate();
                var score = doc.data().score;
                data.push({time_created: date, score: score});
            });
            sentiments.value = data;
        });
    }

    onMounted(() => {
        // load_sentiment(uuid);
        load_sentiment_firestore();
    })
</script>