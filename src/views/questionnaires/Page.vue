<template>
    <div class="w-screen h-screen flex flex-col items-center justify-center">
        <div class="flex flex-col w-[70vw]">
            <div class="text-8xl font-primary text-secondary">
                {{questions[page].question}}
            </div>

            <div class="text-3xl font-secondary text-quinary mt-20">
                {{questions[page].description}}
            </div>

            <div class="w-full h-full flex flex-col gap-3 mt-20">
                <div v-for="(options, index) in questions[page].answers" :key=index class="options text-white font-secondary text-5xl" @click=selected_option(index)>
                    {{options}}
                </div>
            </div>

        </div>
        <div @click=return_home() class="absolute top-10 right-10 rounded-xl text-3xl font-secondary text-quaternary exit p-10">
            Pause the Questionnaire
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                page: 1,
                option: 0,
                questions: {1: {question: "Have you eaten in the last four hours?", 
                         answers : ["Yes! Next question", "I could use a snack...", "No, I need a meal"], 
                         redirects : [2, 100, 101]},
                     2: {question: "Have you taken any medication you need?", 
                         answers: ["Yes! I am all caught up", "No, I need to take my meds"], 
                         redirects: [3, 102]},
                     3: {question: "Can you take a quess at how many hours you've slept out of the last 24?", 
                            description: "Everyone is an individual with different sleep schedules, but most people need 8 hours of relatively uninterrupted sleep.\
                                            If you had les than that, and/or woke up frequently, and/or had nightmares, it might help you to take a nap",
                            answers: ["I'm well rested! Next question", "No, I need a nap"],
                            redirects: [4, 103]},
                     4: {question: "Are you in pain?",
                         answers: ["No, my body feels fine", "Yes, something hurts"],
                         redirects: [5, 104]},
                     5: {question: "Next, we're going to deal with other types of physical discomfort you may be in. \n Is something about your environment distressing or uncomfortable?",
                         answers: ["No, it seems fine here to me", "Yes, my surroundings are less than ideal."],
                         redirects: [6, 105]},
                     6: {question: "Does your body feel uncomfortable, sweaty, or dirty?",
                         answers: ["No, I feel fine", "Yes, I feel icky, gross, or unclean"],
                         redirects: [7, 106]},
                     7: {question: "Do you know why you're in a bad mood, or not feeling well emotionally? (Remember, any answer is okay!)",
                         description: "Now we've taken care of the physical reasons that you're not feeling well. Now we're going to deal with the emotional ones.\
                                        Obviously, this is a general guide, and can't pinpoint your exact problem. But troubleshooting is a good practice, and we're going to do our best together.\
                                        In my experience, most of the people who would need a flow chart like this have a mental health problem of some type, \
                                        so these questions are geared towards common mental health problems. You, of course, might have different needs, but starting here can't hurt.",
                         answers: ["No, I don't know the reason", "Yes, there's something on my mind."],
                         redirects: [8, 107]},
                     8: {question: "Do you feel anxious, nervous, keyed-up, paranoid, scared, or on edge?",
                         answers: ["I was feeling anxious, but I did my best to take care of myself. I'm ready for the next question!", "No, I don't feel very anxious.", "Yes, but I don't know why", "Yes, and there is a specfic reason"],
                         redirects: [9, 9, 108, 109]},
                     9: {question: "Do you feel triggered? Do you feel triggered? Are you having flashbacks? Is something traumatic or upsetting from the past weighing on your mind? Did you have a vivid nightmare?",
                         answers: ["No, I don't feel triggered","I was, but I did my best to take care of myself. I am ready for the next question!", "Yes, I feel triggered"],
                         redirects: [10, 10, 110]},
                     10: {question: "Are you feeling dissociated, depersonalized, or derealized? Do you feel far away, foggy, or unreal? Are you not sure who you are?",
                         answers: ["No, I don't feel like that", "I was, but I did my best to take care of myself. I am ready for the next question!", "Yes, I'm dissociated"],
                         redirects: [11, 11, 111]},
                     11: {question: "Are you feeling depressed, sad, or upset?", 
                         answers: ["No, I'm not very depressed", "Yes, I'm feeling depressed"],
                         redirects: [12, 112]},
                     12: {question: "Are you feeling lonely or in need of attention?",
                         answers: ["No, I'm not very lonely. Next question!", "Yes, I'm feeling lonely"],
                         redirects: [13, 113]},
                     13: {question: "Are you feeling foggy?",
                         answers: ["No, my head feels clear", "Yes, I feel foggy"],
                         redirects: [14, 114]},
                     14: {question: "Do you have pets?", 
                         answers: ["No, no pets for me", "Yes, I have pets"],
                         redirects: [15, 115]},
                     15: {question: "Take half an hour and do whatever you want to do right now. This can be anything: crafts, watching TV, laying on the couch, taking a walk... your choices are literally endless!\
                                     (Of course, don't do anything that's bad for you, like feeding addictions or harming yourself or others.)",
                         answers: ["I've had 30 minutes of fun. I'm ready for the next question!"], 
                         redirects: [16]},
                     16: {question: "We've reached the end of this self care guide!",
                         description: "It's time to reassess. Maybe now that you've done all of these self care, you feel better -- great! Maybe you don't and that's fine too. But hopefully\
                                        you've cleared some things up, and you know what to do next to take care of yourself.\n You deserve self care, so even if it's hard, do your best! \n Good luck!"},
                                        
                                        
                                        
                                        
                    100: {question: "When you need a snack, just pop some easy food in your mouth.",
                          description: "If there's a specific food you want, it's okay to eat it! You don't have to eat perfectly healthy all the time-- no one does! Just also use your brain a little, and notice the quantity you're eating, and how healthy it is for you. You're probably just fine at trusting your gut and knowing what your body needs.",
                          answers: ["Okay, I finished my snack"],
                          redirects: [2]},
                    101: {question: "You haven't eaten in a little while, and your body needs fuel. It's time for breakfast, lunch, or dinner.",
                          description: "If there's a specific food you want, it's okay to eat it! You don't have to eat perfectly healthy all the time-- no one does! Just also use your brain a little, and notice the quantity you're eating, and how healthy it is for you. You're probably just fine at trusting your gut and knowing what your body needs.",
                          answers: ["Okay, I finished my meal, and I'm ready for the next step", "I need some help!"],
                          redirects: [2, 116]},
                    102: {question: "Medication needs to be taken on schedule, or your body might react negatively.",
                          description: "Take some time now to take any pills, do any tests or injections, or apply any ointments prescribed by your doctor.\
                                        If this is a persistent problem for you, you may want to set a smart phone alarm so you remember to take it at the same time every day.",
                          answers: ["Okay, I took my medication. Next question!"],
                          redirects: [3]},
                    103: {question: "Take a nap. You can finish this self-care guide when you wake up.",
                          description: "Ideally, let yourself sleep naturally, and sleep until you wake up. Of course, this isn't always possible. Otherwise, set an alarm for yourself, with plenty of time to wake up and get yourself together between your nap and your responsibilities.",
                          redirects: [4],},
                    104: {question: "If there is something your doctor has prescribed you for pain, you should take it or do it. For aches and pains, take an aspirin. You may also want to apply a heating pad or a cold pack on whatever hurts.",
                          description: "If you have a stomach ache, there are medications for that, like Pepto Bismol, and hot tea may also help. Be nice to your body, and try to 'replace' the unpleasant pain with some pleasant alternative sensations, such as good smells, and pleasurable textures.",
                          answers: ["I'm all taken care of."],
                          redirects: [5]},
                    105: {questions: "Are your surroundings the right temperature?",
                          answers: ["I'm just right", "It's too cold", "It's too hot"],
                          redirects: [1, 1, 1]},
                    106: {}}
            }
        },
        methods: {
            selected_option,
            return_home,
        },
        mounted() {
        }
    }
    // todo finish this
                    

    function return_home() {
        this.$emit('quest');
        this.$router.push('/home');
    }
    function selected_option(index) {
        this.page = this.questions[this.page].redirects[index];
    }

</script>

<style scoped>
    .exit {
        background: rgba(255, 255, 255, 0.1);
        cursor: pointer;
    }
</style>