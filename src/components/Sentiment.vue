<template>
    <div class=" absolute main_chart lg:w-[70vw] lg:h-[70vh] lg:text-5xl flex flex-col gap-10 items-center justify-center" style="opacity: 0">
        <div class="chart_container">
            <canvas id ="chartjs">
            </canvas>
        </div>
    </div>
</template>

<script setup>
    import {db, auth} from '../main.js';
    import {ref, onMounted} from 'vue';
    import {collection, addDoc, query, where, onSnapshot, doc} from "firebase/firestore";
    import {useRouter} from 'vue-router';
    import Chart from 'chart.js/auto';
    const props = defineProps({
        chartToggle: {
            default: 1
        }
    });

    var mobile = false;
    window.innerHeight > window.innerWidth ? mobile = true : mobile = false;

    if (auth.currentUser == null) {
        window.location.href = "/";
    }
    // const uuid = auth.currentUser.uid;
    const sentiments = ref([]);

    function load_sentiment_firestore() {
        var uuid = auth.currentUser.uid;
        const q = query(collection(db, "journals"), where("user_uid", "==", uuid));
        onSnapshot(q, (query_snapshot) => {
            const data = [];
            query_snapshot.forEach((doc) => {
                var date = doc.data().date.toDate();
                // convert to yy-mm-dd-hh-mm-ss
                var date_string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "/" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                date = date_string;
                var for_sorting = doc.data().date.toDate().getTime();
                var score = doc.data().score;
                data.push({time_created: date, score: score, for_sorting: for_sorting});
            });
            // sort data by forsorting, biggest first
            data.sort((a, b) => a.for_sorting - b.for_sorting);
            sentiments.value = data;
            redraw();
        });
    }

    function redraw() {
        
        Chart.defaults.font.size = mobile ? 5 : 20;
        Chart.defaults.font.family = "Bio Rhyme";
        Chart.defaults.color = "#fff";
        const ctx = document.querySelector('#chartjs').getContext('2d');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sentiments.value.map((sentiment) => sentiment.time_created),
                datasets: [{
                    label: null,
                    data: sentiments.value.map((sentiment) => sentiment.score),
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    spanGaps: true,
                    borderWidth: mobile ? 1 : 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: !mobile,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time'
                        },
                        grid: {
                            borderColor: '#fff',
                        }
                    },

                    y: {
                        title: {
                            display: true,
                            text: 'Sentiment Score'
                        },
                        grid: {
                            borderColor: '#fff',
                        }
                    }
                },
                plugins: {
                    subtitle: {
                        display: true,
                        text: 'Sentiment over time',
                        font: {
                            size: mobile ? 14 : 36,
                        },
                    },
                    legend: {
                        display: false,
                    }
                },
                layout: {
                    padding: {
                        top: mobile ? 10 : 50,
                        bottom: mobile ? 10 : 50,
                        left: mobile ? 10 : 50,
                        right: mobile ? 10 : 50,
                    }
                }
            },
        })
    }

    onMounted(() => {
        load_sentiment_firestore();
        gsap.to(".main_chart", {opacity: props.chartToggle, scale: props.chartToggle, duration: 1});
    })
</script>

<script>
    import gsap from 'gsap';
    export default {
        watch: {
            chartToggle: function () {
                gsap.to(".main_chart", {opacity: this.chartToggle, scale: this.chartToggle, duration: 1.4 * this.chartToggle});
            }
        },
        data: () => ({
            mobile: false
        })
    }
</script>

<style scoped>
    .chart_container {
        @apply lg:w-[70vw] lg:h-[70vh] w-[90vw] h-[50vh] rounded-lg shadow-md;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
    }

    canvas {
        @apply w-full h-full;
    }

    g {
        @apply lg:w-10;
    }
</style>