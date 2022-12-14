<template>
    <div class="main flex flex-col items-center justify-center lg:w-screen lg:h-screen w-[99vw] h-[99vh] gap-10 overflow-hidden relative">
        <h1 v-show=toured class="fixed lg:top-10 top-50 lg:text-[8rem] text-6xl text-secondary font-primary title text-center" v-bind:id="user">
            Everything will be gucci, {{user}}!
        </h1>

        <div v-show=!toured class="floating_start lg:text-[9rem] text-4xl w-[30vw] h-[15vh] flex items-center justify-center rounded-xl text-primary text-center font-primary shadow-2xl z-10 cursor-pointer" @click=start_tour>
            Get Started
        </div>

        <div v-show=!toured class="fixed explainer flex flex-col z-[9]" style="opacity: 0">
            <div class = "button_parent text w-full flex flex-col gap-10">
                <p class ="para">
                    Welcome to TuGucci?, and relax yourself!
                    Immerse yourself in this relaxing scene and let your mind wander.
                    You can listen to the peaceful atmosphere, and enjoy the surroundings, to help calm you down.
                    Or you can try one of our many features, to help you keep track of your mental health.
                </p>
                <div class="next_button" style="opacity: 0">
                    Next
                </div>
            </div>

        </div>

        <div v-show=toured class="control_bar fixed bottom-10 side_bar w-screen flex justify-evenly lg:gap-10 gap-2 font-primary text-secondary" style="transform: scale(1)">
            <div class="cta book" @click=toggle_journal style="visibility:visible">
                Journal
            </div>

            <div class="cta chart" @click=toggle_chart style="visibility:visible">
                Sentiment
            </div>

            <div class="cta goal" @click=toggle_achievements style="visibility:visible">
                View Today's Goals
            </div>


            <div class="cta quest" @click=toggle_questions style="visibility:visible">
                Questions
            </div>
        </div>

        <DailyGoals class="goal_board" :goal-toggle = goal_toggle />

        <Journal id="daily_journal" :journal-toggle = journal_toggle />

        <Questions id="main_quest" :quest-toggle = quest_toggle />

        <Sentiment id="main_sent" :chart-toggle = chart_toggle />
    </div>
</template>

<script>
    import gsap from 'gsap';
    import { TextPlugin } from "gsap/TextPlugin";
    import DailyGoals from '../components/DailyGoals.vue';
    import Journal from '../components/Journal.vue';
    import Questions from '../components/Questions.vue';
    import Sentiment from '../components/Sentiment.vue';
    import {collection, getDocs, addDoc, query, where, updateDoc } from "firebase/firestore";
    import {db, auth} from '../main.js';
    var achievements = 0;
    var journal = 0;
    var questions = 0;
    var chart = 0;
    gsap.registerPlugin(TextPlugin);
    export default {
        data: () => ({
            user: "",
            score: 100,
            journal_toggle: 0,
            goal_toggle: 0,
            quest_toggle: 0,
            chart_toggle: 0,
            toured: true,
        }),
        methods: {
            toggle_achievements,
            toggle_journal,
            toggle_questions,
            toggle_chart,
            toggle_init,
            toggle_house,
            start_tour,
            restart_tour,
            reset_ui
        },
        mounted() {
            const title = document.querySelector(".title");
            setTimeout(() => {
                gsap.to(title, {opacity: 0, duration: 1});
            }, 3000);

            // get user document from firestore
            var uuid = auth.currentUser.uid;
            var q = query(collection(db, 'users'), where ("user_uid", "==", uuid));
            getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.user = doc.data().username;
                    this.toured = doc.data().toured;
                    this.page = doc.data().page;
                    if (!this.toured) {
                        document.querySelector(".control_bar").style.scale = 0;
                        document.querySelector(".nav_wrapper").style.scale = 0;
                    };
                });
            });
            document.querySelector("#main_quest").style.opacity = 0;
            document.querySelector(".retour").addEventListener("click", this.restart_tour);
            document.querySelector(".home").addEventListener("click", this.reset_ui);
            this.toggle_init();
        },
        components: {
            DailyGoals,
            Journal,
            Questions,
            Sentiment,
        }
    }

    var visibility = "hidden";

    function reset_ui() {
        // set all toggles to 0
        console.log("reset being triggerd")
        achievements = 0;
        journal = 0;
        questions = 0;
        chart = 0;
        this.journal_toggle = 0;
        this.goal_toggle = 0;
        this.quest_toggle = 0;
        this.chart_toggle = 0;

        // set all cta's to visible
        document.querySelector(".book").style.visibility = "visible";
        document.querySelector(".chart").style.visibility = "visible";
        document.querySelector(".goal").style.visibility = "visible";
        document.querySelector(".quest").style.visibility = "visible";

        // set all cta's to opacity 1
        document.querySelector(".book").style.opacity = 1;
        document.querySelector(".chart").style.opacity = 1;
        document.querySelector(".goal").style.opacity = 1;
        document.querySelector(".quest").style.opacity = 1;

        // allow all cta's to be clicked
        document.querySelector(".book").style.pointerEvents = "auto";
        document.querySelector(".chart").style.pointerEvents = "auto";
        document.querySelector(".goal").style.pointerEvents = "auto";
        document.querySelector(".quest").style.pointerEvents = "auto";

        // emit so threejs resets too
        this.$emit("reset");

        // go back to default view
        setTimeout(() => {
            this.toggle_init();
        }, 1000);
    }

    function toggle_achievements() {
        const el = document.querySelector(".goal_board");
        var button = document.querySelector(".goal");
        button.style.pointerEvents = "none";
        achievements = 1 - achievements;
        if (achievements) {
            el.style.pointerEvents = "auto";
            el.style.zIndex = 25;
        } else {
            el.style.pointerEvents = "none";
            el.style.zIndex = -1;
        }
        1 - achievements ? visibility = "visible" : visibility = "hidden";
        gsap.to(".book", {opacity: 1-achievements, duration: 0.1});
        gsap.to(".quest", {opacity: 1-achievements, duration: 0.1});
        gsap.to(".chart", {opacity: 1-achievements, duration: 0.1});
        gsap.to(".book", {visibility: visibility, delay: 0.1, duration: 0.1});
        gsap.to(".quest", {visibility: visibility, delay: 0.1, duration: 0.1});
        gsap.to(".chart", {visibility: visibility, delay: 0.1, duration: 0.1});
        this.$emit("achievements");
        this.goal_toggle = 1 - this.goal_toggle;
        setTimeout(() => {
            button.style.pointerEvents = "auto";
        }, 1000);
    }

    function toggle_journal() {
        const el = document.querySelector("#daily_journal");
        var button = document.querySelector(".book");
        button.style.pointerEvents = "none"; // prevent spam clicking
        journal = 1 - journal;
        if (journal) {
            el.style.pointerEvents = "auto";
            el.style.zIndex = 25;
        } else {
            el.style.pointerEvents = "none";
            el.style.zIndex = -1;
        }
        gsap.to(".goal", {opacity: 1-journal, duration: 1}); // buttons fade out
        gsap.to(".quest", {opacity: 1-journal, duration: 1});
        gsap.to(".chart", {opacity: 1-journal, duration: 1});
        1 - journal ? visibility = "visible" : visibility = "hidden";
        gsap.to(".goal", {visibility: visibility, delay: 0.1, duration: 0.1}); // prevent from clicking the buttons
        gsap.to(".quest", {visibility: visibility, delay: 0.1, duration: 0.1});
        gsap.to(".chart", {visibility: visibility, delay: 0.1, duration: 0.1});
        try {
            this.$emit("book"); // sends out event so threejs can be updated
            this.journal_toggle = 1 - this.journal_toggle; // toggles journal
        } catch (e) {
            console.log()
        }
        setTimeout(() => {
            button.style.pointerEvents = "auto";
        }, 3000);
    }

    function toggle_questions() {
        var button = document.querySelector(".quest");
        const el = document.querySelector("#main_quest");

        button.style.pointerEvents = "none";
        questions = 1 - questions;
        if (questions) {
            el.style.pointerEvents = "auto";
            el.style.opacity = 1;
            el.style.zIndex = 25;
        } else {
            el.style.pointerEvents = "none";
            el.style.opacity = 0;
            el.style.zIndex = -1;
        }
        gsap.to(".goal", {opacity: 1-questions, duration: 1}); // disallow jumping to the other two
        gsap.to(".book", {opacity: 1-questions, duration: 1});
        gsap.to(".chart", {opacity: 1-questions, duration: 1});
        // gsap.to(".questions", {opacity: questions, duration: 0.5});
        1 - questions ? visibility = "visible" : visibility = "hidden";
        gsap.to(".goal", {visibility: visibility, delay: 0.1, duration: 0.1});
        gsap.to(".book", {visibility: visibility, delay: 0.1, duration: 0.1});
        gsap.to(".chart", {visibility: visibility, delay: 0.1, duration: 0.1});
        this.$emit("quest");
        this.quest_toggle = 1 - this.quest_toggle;
        setTimeout(() => {
            button.style.pointerEvents = "auto";
        }, 3000);
    }

    function toggle_chart() {
        var button = document.querySelector(".chart");
        button.style.pointerEvents = "none";
        chart = 1 - chart;
        const el = document.querySelector("#main_sent");
        if (chart) {
            el.style.pointerEvents = "auto";
            el.style.zIndex = 25;
        } else {
            const el = document.querySelector("#main_sent");
            el.style.pointerEvents = "none";
            el.style.zIndex = -1;
        }
        gsap.to(".goal", {opacity: 1-chart, duration: 1});
        gsap.to(".book", {opacity: 1-chart, duration: 1});
        gsap.to(".quest", {opacity: 1-chart, duration: 1});
        1 - chart ? visibility = "visible" : visibility = "hidden";
        gsap.to(".goal", {visibility: visibility, delay: 0.1, duration: 0.1});
        gsap.to(".book", {visibility: visibility, delay: 0.1, duration: 0.1});
        gsap.to(".quest", {visibility: visibility, delay: 0.1, duration: 0.1});
        this.$emit("chart");
        this.chart_toggle = 1 - this.chart_toggle;
        setTimeout(() => {
            button.style.pointerEvents = "auto";
        }, 3000);

    }

    function toggle_init() {
        document.querySelector(".goal_board").style.pointerEvents = "none";
        document.querySelector("#daily_journal").style.pointerEvents = "none";
        document.querySelector("#main_quest").style.pointerEvents = "none";
        document.querySelector("#main_sent").style.pointerEvents = "none";
        this.$emit("init");
    }

    function toggle_house() {
        this.$emit("house")
    }

    function test_api() {
        this.$router.push("/sentiment");    
    }

    function start_tour() {
        var functions = [this.toggle_journal, this.toggle_achievements, this.toggle_questions, this.toggle_house];
        var mobile = window.innerHeight > window.innerWidth;
        // remove button
        var button = document.querySelector(".floating_start");
        var timeline = gsap.timeline();
        timeline.to(button, {opacity: 0, duration: 1, onComplete: () => {button.remove()}});
        
        // show intro para
        var explainer = document.querySelector(".explainer");
        var text = document.querySelector(".para");
        var next_button = document.querySelector(".next_button");
        timeline.to(explainer, {opacity: 1, duration: 1, onComplete: () => {
        }});


        
        // paras
        var paras =[`Whenever you are feeling a strong emotion, or even just have an idea you want to note down,
                    you can simply write down what you're thinking in the journal. It can feel good to make what you are feeling
                    tangible and validated too!`,
                    `Here, we have recommended some daily goals to strive for, to help you get a good start to the day! You can even
                    set your own daily goals`,
                    `Lastly, we have prepared a questionnaire. Don't worry, it is a simple flowchart, to help you out when you are feeling
                    uncomfortable, or even overwhelmed, but do not know why. The questionairre will hopefully help identify what kind of self-love
                    and care you need!`,
                    `We hope you enjoy your stay here at TuGucci!`];

        // gsaps to tween between paras
        var journal_tween = gsap.to(text, {text : {value: paras[0], delimiter:" ", padSpace:true}, duration: 3, delay: 1});
        if (mobile) {
            var journal_explainer = gsap.to(explainer, {zIndex: 100});
        } else {
            var journal_explainer = gsap.to(explainer, {width: "30vw", right: 400, zIndex: 100,  duration: 1, delay: 1});
        }
        journal_tween.pause();
        journal_explainer.pause();

        var goal_tween = gsap.to(text, {text : {value: paras[1], delimiter:" ", padSpace:true}, duration: 1});
        if (mobile) {
           var goal_explainer = gsap.to(explainer, {zIndex: 100});
        } else {
            var goal_explainer = gsap.to(explainer, {width: "20vw", top: "50%", left: 10, duration: 1});

        }
        goal_tween.pause();
        goal_explainer.pause();


        var quest_tween = gsap.to(text, {text : {value: paras[2], delimiter: " ", padSpace:true}, duration: 1});
        if (mobile) {
            var quest_explainer = gsap.to(explainer, {zIndex: 100});
        } else {
            var quest_explainer = gsap.to(explainer, {width: "50vw", xPercent: -50, yPercent: -50, top:"50%", left:"50%", duration: 1});
        }
        quest_tween.pause();
        quest_explainer.pause();

        var outro_tween = gsap.to(text, {text : {value: paras[3], delimiter: " ", padSpace:true}, duration: 3});
        if (mobile) {
           var outro_explainer = gsap.to(explainer, {zIndex: 100});
        } else {
            var outro_explainer = gsap.to(explainer, {width: "25vw", bottom: 100, duration: 1});
        }
        outro_tween.pause();
        outro_explainer.pause();

        // tween array
        var tweens_array = [[journal_tween, journal_explainer], [goal_tween, goal_explainer], [quest_tween, quest_explainer], [outro_tween, outro_explainer]];

        // show next button
        timeline.to(next_button, {opacity: 1, duration: 1, onComplete: ()=> {
            var i = 0;
            next_button.addEventListener("click" , async () => {
                var prev_func = null;
                next_button.style.pointerEvents = "none";
                if (i < tweens_array.length) {
                    try {
                        prev_func = functions[i-1];
                        prev_func();
                    } catch (e) {
                        console.log("first time");
                    }

                    setTimeout(() => {
                        var curr_func = functions[i];
                        curr_func();
                        var tweens = tweens_array[i];
                        tweens.forEach(tween => {
                            tween.play();
                        });
                        i++;
                    }, 1000);
                    setTimeout(() => {
                        next_button.style.pointerEvents = "auto";
                    }, 1000);
                } else if (i > tweens_array.length - 1) {
                    const control_bar = document.querySelector(".control_bar");
                    gsap.to(control_bar, {scale: 1, duration: 1});
                    const nav_bar = document.querySelector(".nav_wrapper");
                    gsap.to(nav_bar, {scale: 1, duration: 1});

                    var uuid = auth.currentUser.uid;
                    var q = query(collection(db, "users"), where("user_uid", "==", uuid));
                    var snapshot = await getDocs(q);
                    snapshot.forEach((doc) => {
                        updateDoc(doc.ref, {
                            toured: true,
                        });
                    });

                    this.toured = true;
                    next_button.remove();
                    text.remove();
                    explainer.remove();
                } else {
                    var to_run = functions[i];
                    to_run();
                    var tweens = tweens_array[i];
                    tweens.forEach(tween => {
                        tween.play();
                    });
                    i++;
                }
            })
        }});
    }

    function restart_tour() {
        this.toured = false;
        this.reset_ui();
        document.querySelector(".control_bar").style.scale = 0;
        document.querySelector(".nav_wrapper").style.scale = 0;
        this.start_tour();
    }
</script>

<style scoped>

    .cta {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        /* text-shadow: 1px 0px white; */
        @apply lg:px-8 lg:py-4 rounded-md shadow-lg cursor-pointer lg:text-4xl text-sm p-4;
    }

    p {
        @apply text-3xl font-secondary text-secondary;
        /* text-shadow: 0px 1px black; */
    }

    .text {
        @apply rounded-xl p-10;
        background: rgba(0,0,0, 0.5);
        backdrop-filter: blur(10px);
    }

    .floating_start {
        background: rgba(255, 255 ,255 , 0.5);
        backdrop-filter: blur(10px);
    }

    .next_button {
        @apply text-4xl text-white font-primary z-50 cursor-pointer;
    }

    .explainer {
        width: 90vw;
        @apply font-secondary left-0;
    }

    /* .para {
        width: 90vw;
    }

    .button_parent {
        width: 90vw;
        @apply left-0 top-1/2 absolute;
    } */
</style>