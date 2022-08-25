<template>
    <div class="w-screen">
        <div class="flex flex-col w-screen main_container items-center justify-start relative">
            <h1 class="text-9xl font-primary text-secondary">
                {{user}}
            </h1>
            <Sentiment class="mt-[10rem]" :chart-toggle = chart_toggle />
            <div class="w-screen h-[80vh]">
            </div>


            <div class="about_user w-[70vw] h-[70vh] flex flex-row mb-[10rem] items-center">
                <div class="rounded-xl w-1/2 h-full">
                    <div class="relative overflow-hidden bg-no-repeat bg-cover">
                        <img src="../assets/prawn.gif" class="w-full px-20 py-20 rounded-full" />
                        <div class="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"></div>
                        <!-- <svg class="absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style="left: 0; bottom: 0"> <path fill="#fff" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"> </path> </svg> -->
                    </div>

                    <div class="p-6 font-custom text-center -mt-[4rem]">
                        <h5 class="text-5xl font-bold font-slab mb-4 text-primary">{{user}}</h5>
                        <p class="text-text mb-4 text-2xl">Joined in {{join_date}}</p>
                    </div>
                </div>

                <div class="w-1/2 h-full text-5xl font-primary flex flex-col items-center justify-center">
                    <p>
                        Score: {{score}}
                    </p>

                    <p>
                        We can add a good memories section here, by picking out top 5 journal entries
                        You have been doing great! Keep up the self love, and keep on being you!
                    </p>

                    <p>
                        Edit Profile
                    </p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import {auth, db} from '../main.js';
    import {useRouter} from 'vue-router';
    import {collection, getDocs, addDoc, query, where, updateDoc } from "firebase/firestore";
    import {ref, onMounted, defineProps} from "vue"; 
    // import Sentiment from '../components/Sentiment.vue';
    import Sentiment from '../components/Sentiment.vue';
    var chart = 0;
    export default {
        data: () => ({
            user: '',
            score: 0,
            chart_toggle: 0,
            join_date: '',
            profile_pic: '',
        }),
        components: {
            Sentiment,
        },
        mounted () {
            this.user = auth.currentUser.displayName;
            var uuid = auth.currentUser.uid;
            var user_q = query(collection(db, "users"), where("user_uid", "==", uuid));
            getDocs(user_q).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.score = doc.data().score;
                    this.user = doc.data().username;
                    this.join_date = doc.data().joined;
                    this.profile_pic = doc.data().profile_pic;
                });
            });
            this.toggle_chart();
        },
        props: {
            chartToggle: {
                required: true,
            }
        },
        methods: {
            toggle_chart
        }
    }

    function toggle_chart() {
        chart = 1 - chart;
        this.$emit("chart");
        this.chart_toggle = 1 - this.chart_toggle;
    }

</script>

<style scoped>
    .about_user {
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
        @apply rounded-xl;
    }
</style>