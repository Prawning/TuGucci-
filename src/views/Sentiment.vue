<template>
    <div class = "w-screen h-screen text-5xl flex flex-col gap-10 items-center justify-center">
        <div class="chart_container">
            <canvas id ="chartjs">
            </canvas>
        </div>
    </div>
</template>

<script setup>
    import {db, auth} from '../main.js';
    import {ref, onMounted} from 'vue';
    import {collection, addDoc, query, where, onSnapshot} from "firebase/firestore";
    import Chart from 'chart.js/auto';
    const uuid = auth.currentUser.uid;
    const sentiments = ref([]);

    function load_sentiment_firestore() {
        var uuid = auth.currentUser.uid;
        const q = query(collection(db, "journals"), where("user_uid", "==", uuid));
        onSnapshot(q, (query_snapshot) => {
            const data = [];
            query_snapshot.forEach((doc) => {
                var date = doc.data().date.toDate();
                // convert to yy-mm-dd-hh-mm-ss
                var date_string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "/" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
                date = date_string;
                // date = String(date.getTime())
                // date = date.slice(date.length - 7, date.length - 1); // get last 6
                var score = doc.data().score;
                data.push({time_created: date, score: score});
            });
            sentiments.value = data;
            redraw();
        });
    }

    function redraw() {
        const ctx = document.querySelector('#chartjs').getContext('2d');
        Chart.defaults.font.size = 20;
        Chart.defaults.font.family = "Bio Rhyme";
        Chart.defaults.color = "#fff";
        const chart = new Chart(ctx, {
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
                    borderWidth: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
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
                            size: 36,
                        },
                    },
                    legend: {
                        display: false,
                    }
                },
                layout: {
                    padding: {
                        top: 50,
                        bottom: 50,
                        left: 50,
                        right: 50,
                    }
                }
            },
        })
    }

    onMounted(() => {
        // load_sentiment(uuid);
        load_sentiment_firestore();
    })
</script>

<style scoped>
    .chart_container {
        @apply w-[70vw] h-[70vh] rounded-lg shadow-md;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
    }

    g {
        @apply w-10;
    }
</style>