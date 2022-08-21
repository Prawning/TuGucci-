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
    import axios from 'axios';
    const uuid = auth.currentUser.uid;

    const sentiments = ref([]);
    async function load_sentiment(uuid) {
        var res = await axios.get(`https://sentiment-analysis-3arqmo4jra-as.a.run.app/api/${uuid}`); // returns a json, {time_created : {content, score, magnitude}}
        console.log(res.data);
        sentiments.value = res.data;
    }

    onMounted(() => {
        load_sentiment(uuid);
    })
</script>