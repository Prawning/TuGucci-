<template>
    <div class="main_quest lg:w-[70vw] lg:h-[70vh] h-[50vh] w-[90vw] flex flex-col items-center justify-center" >
        <div class="flex flex-col lg:w-[70vw] w-[90vw] questions lg:py-40 lg:px-10 py-10 px-4 rounded-3xl shadow-lg">
            <div class="actual_question lg:text-6xl text-4xl font-primary text-secondary">
                {{questions[page].question}}
            </div>

            <div class="description lg:text-3xl text-2xl font-secondary text-quinary mt-20">
                {{questions[page].description}}
            </div>

            <div class="w-full h-full flex flex-col gap-3 mt-20">
                <div v-for="(options, index) in questions[page].answers" :key=index class="options text-white font-secondary lg:text-5xl text-lg z-20" @click=selected_option(index)>
                    {{options}}
                </div>
            </div>

        </div>
        <div @click=reset_page class="absolute w-auto flex text-center items-center align-center h-20 lg:top-10 lg:right-10 md:top-10 md:right-10 bottom-10 rounded-xl lg:text-3xl text-lg font-secondary text-quaternary exit lg:p-10 p-2">
            Redo Quiz!
        </div>
    </div>
</template>

<script setup>
    import {auth, db} from "../main.js";
    import { useRouter } from 'vue-router';
    import {collection, addDoc, getDocs, query, where, updateDoc, onSnapshot, doc} from "firebase/firestore";
    const props = defineProps({
        questToggle: {
            required: true,
        }
    });
</script>



<script>
    // read the user
    import {auth, db} from "../main.js";
    import { useRouter } from 'vue-router';
    import {collection, addDoc, getDocs, query, where, updateDoc, onSnapshot} from "firebase/firestore";
    import gsap from "gsap";
    const router = useRouter();
    export default {
        data() {
            return {
                page: 1,
                lastKnown: 1,
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
                         redirects: [7, 206]},
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
                         redirects: [11, 11, 302]},
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
                          answers: ["I'm awake! I'm ready for the next question!"],
                          redirects: [4],},
                    104: {question: "If there is something your doctor has prescribed you for pain, you should take it or do it. For aches and pains, take an aspirin. You may also want to apply a heating pad or a cold pack on whatever hurts.",
                          description: "If you have a stomach ache, there are medications for that, like Pepto Bismol, and hot tea may also help. Be nice to your body, and try to 'replace' the unpleasant pain with some pleasant alternative sensations, such as good smells, and pleasurable textures.",
                          answers: ["I'm all taken care of."],
                          redirects: [5]},
                    105: {question: "Are your surroundings the right temperature?",
                          answers: ["I'm just right", "It's too cold", "It's too hot"],
                          redirects: [201, 202, 203]},
                    107: {question: "It sounds like there's something on your mind! We're going to do our best to take care of it.",
                         description: `Set a timer for 15 minutes, and work on a solution. If it's something you can change, then great! If not, do your best to reach out to someone and talk about it.
                                        Remember, 15 minutes and only 15! You can go back to whatever it is after we're done working through this together. We're just taking baby steps in the right direction.`,
                         answers: ["Okay, I did my best"],
                         redirects: [8]},
                    108: {question: "You feel generally anxious, but you don't know why. That's okay!",
                         answers: ["I'd like to try some grounding exercises"],
                         redirects: [302]},
                    109: {question: "You're feeling anxious about something specific. That's okay! Set a timer for 15 minutes and do something to take care of that worry. Maybe chip away at a task that seems insurmountable. You can do it!",
                         answers: ["I'd like to try some grounding exercises too", "I feel better, next question!"],
                         redirects: [302, 9]},
                    110:{question: "If you're feeling triggered, see if there's a practical action you can take to lessen your distress. Can you block that unsafe person from your Facebook, for example?",
                         description: `If not, reach out and tell someone safe how you're feeling. Just express yourself! Human contact works wonders when you're not feeling well emotionally.
                        Remember that you're here in the present, and nothing from your past can hurt you. If you like, you may want to try some grounding exercises to reinforce that idea.`,
                         answers: ["I'd like to try some grounding exercises too", "I feel better, next question!"],
                         redirects: [302, 10]},
                    112:{question: "Feeling depressed isn't fun, but it doesn't last forever! Don't be mad or disappointed with yourself for feeling depressed. ",
                         description: `Take 15 minutes and accomplish something small, like loading the dishwasher or making a friendship bracelet. You are not a failure, and your situation is not hopeless! You are a superhero, even if it doesn't feel like it.`,
                         answers: ["Okay, I've done my best to take care of myself, and I'm ready for the next question"],
                         redirects: [12]},
                    113:{question: "Everybody feels lonely sometimes. If you're feeling lonely, there's ways to reach out to people!",
                         description:`You can talk to someone in your house, or call someone on the phone. You can also use texting or Facebook messenger to speak to someone. You may want to talk about how you're feeling, or you may not. Anything you want to talk about is okay!
                                    If that isn't or doesn't seem possible, you can post a general message on Facebook, Tumblr, Vent, or another internet service, about whatever you want!`,
                         answers: ["Okay, I did my best to take of myself, and I'm ready for the next question"],
                         redirects: [13]},
                    114:{question: "If you are feeling foggy, you might need some exercise. Do you have the energy and ability to go for a walk?",
                         answers: ["Yes, a walk sounds great", "No, a walk would be too much for me"],
                         redirects: [303, 304]},
                    115:{question: "Playing with pets can be a great way to take the edge off when you're not feeling well. It doesn't matter what kind of pet you have, just take some time to interact with them. Pet your cat, take your dog outside, feed your fish, hug your lizard...",
                         answers: ["Good idea! I'm ready for the next question"],
                         redirects: [15]},
                    
                    
                    
                    201:{question: "Are your surroundings dirty or smelly?",
                         answers: ["Yes, it's gross.", "No, it's fine"],
                         redirects: [301, 204]},
                    202:{question: "If you're too cold, you can try putting on some warm clothes, using a space heater, turning up the heat in your home, putting on a blanket, and/or snuggling with a pet or another person",
                         answers: ["I'm not cold anymore"],
                         redirects: [201]},
                    203:{question: "If you're too hot, you can try putting on cooler clothes, turning on a fan, or turning up the AC in your house.",
                         answers: ["Okay, I fixed it"],
                         redirects: [201]},
                    204:{question: "Do you feel unsafe because of the people, or lack of people, in your surroundings?",
                         answers: ["Yes, there are too many people here, or people I don't feel comfortable with", "I am alone and I don't like it", "No, I'm good"],
                         redirects: [209, 210, 6]},
                    205:{question: "Does your body feel uncomfortable, sweaty,or dirty?",
                         answers: ["Yes, I feel icky, gross, or unclean", "No I feel fine"],
                         redirects: [206, 7]},
                    206:{question: "Do you have the energy and ability to take a shower?",
                         answers:["Yes, I'll take a shower", "No, I need another solution"],
                         redirects: [207, 208]},
                    207:{question: "Take a shower, and get dressed in fresh clothes afterwards. You'll feel much better!",
                         answers: ["I've done that, and I'm ready for the next step"],
                         redirects: [7]},
                    208:{question: "If you are unable to take a shower, here are some things to do instead:",
                         description: `-Wash your face
                                        -Put on lotion
                                        -Change your clothes
                                        -Use dry shampoo
                                        -Whatever physical self-care activity you like best!`,
                         answers: ["I'm clean and I'm ready for the next step."],
                         redirects: [7]},
                    209:{question: "If you can, try to remove yourself from situations that are overwhelming or feel unsafe. If you can't relocate entirely, take frequent breaks, or tune out with headphones.",
                         answers: ["I did my best. On to the next step"],
                         redirects: [205]},
                    210:{question: "Being alone can feel really scary and unsafe. In reality, if you take basic precautions, you're almost certainly fine!",
                         description: "However, getting a friend, making a phone or Skype call, playing with a pet, and/or turning on the TV or music can help.",
                         answers: ["I reached out to someone, and I'm feeling better. I'm ready for the next step"],
                         redirects: [205]},

                    
                    
                    301:{question: "It's hard to feel okay in an environment that is unfriendly for whatever reason. If your surroundings aren't clean, set a timer for five minutes and take care of the biggest problems, like leftover food, pet messes, or dirty clothes.",
                         description: "Chores can be scary and exhausting, but that's not what we're doing here. We're just taking a little five-minute clean up to make ourselves and our homes happier!",
                         answers: ["Okay, I cleaned up a little!"],
                         redirects: [204]},
                    302:{question: "Here are some ideas for grounding activities:",
                         description: "-Take deep, calm breaths.\
                                        \n-Notice and list things in your surroundings.\
                                        \n-Expose yourself to strong, pleasant sensations, like a pleasing smell or a favorite blanket.\
                                        \n-Say out loud your name, your age, the date, and your location. List some things you've done today, or are going to do.\
                                        \n-Splash water on your face or run your hands under the faucet.\
                                        \n-Do a body scan meditation, or pay close attention to each of your body parts one by one.\
                                        \n-Make tea. Feel the warmth of it in your hands, and the taste as you sip it calmly.\
                                        \n-Listen to music.\
                                        \n-Play a categories game, and name some types of dogs, or clothing items, or gemstones, or countries, or anything else you can think of.\
                                        \n-Write in your journal.\
                                        \n-Take a mindful walk, either inside or outside. Pay close attention to your body and your surroundings.\
                                        \n-Squiggle. Wiggle around. Dance. Stretch. Be silly and active for a few minutes.\
                                        \n-Any other favorite grounding technique you've heard of or can think of. There's nothing wrong with experimenting!",
                         answers: ["Okay! I did one or more of these things, and I'm ready to move on"],
                         redirects: [8]},
                    303:{question: "Walks are really good for both our bodies and our minds. Take a walk of whatever length you choose! You're not trying to burn calories or get to a particular destination; you're just taking a pleasant stroll. Enjoy it!",
                         answers: ["Okay, I am back from my walk, and I'm ready for the next question"],
                         redirects: [14]},
                    304:{question: "If you can't take a walk, that's okay!",
                         description: `Here are some alternatives:
                                        -Jumping jacks
                                        -Bouncing on the bed
                                        -Dancing
                                        -Push ups or sit ups, if you like doing them
                                        -Walking up and down the stairs
                                        -Yoga
                                        -Wiggling, squirming, jiggling around; being silly and active and having fun!

                                        If none of those are or seem possible, just sit outside for some fresh air!`,
                         answers: ["Okay, I did one or more of these things, and I'm ready to move on"],
                         redirects: [14]},
                    }
                    
            }
        },
        methods: {
            async selected_option(index) {
                    this.page = this.questions[this.page].redirects[index]; // update page
                    document.querySelector(".main_quest").style.opacity = 1;
                    // everytime page is updated, update the user's progress too on firestore
                    var uuid = auth.currentUser.uid;
                    var q = query(collection(db,"users"), where("user_uid", "==", uuid));
                    var snapshot = await getDocs(q);
                    snapshot.forEach((doc) => {
                        updateDoc(doc.ref, {page: this.page});
                    });
                    
                    // gsap magic
                    // const actual_question = document.querySelector(".actual_question");
                    // const description = document.querySelector(".description");
                    // var question_text = this.questions[this.page].question;
                    // var description_text = this.questions[this.page].description || "";
                    // gsap.to(actual_question, {text: {value: question_text, delimiter: " ", padSpace: true, speed: 2}});
                    // gsap.to(description, {text: {value: description_text,delimiter: " ", padSpace: true, speed: 3}, delay: 0.5});
                },
            async reset_page() {
                this.page = 1;
                var uuid = auth.currentUser.uid;
                var q = query(collection(db,"users"), where("user_uid", "==", uuid));
                var snapshot = await getDocs(q);
                snapshot.forEach((doc) => {
                    updateDoc(doc.ref, {page: this.page});
                });
                // const actual_question = document.querySelector(".actual_question");
                // const description = document.querySelector(".description");
                // var question_text = this.questions[1].question;
                // var description_text = "";
                // gsap.to(actual_question, {text: {value: question_text, delimiter: " ", padSpace: true}, duration: 1, ease: "power2.out"});
                // gsap.to(description, {text: {value: description_text,delimiter: " ", padSpace: true}, duration: 1, delay: 0.5});
            }
        }, async mounted() {
            var uuid = auth.currentUser.uid;
            // get the user doc
            var q = query(collection(db,"users"), where("user_uid", "==", uuid));
            var snapshot = await getDocs(q);
            snapshot.forEach((doc) => {
                this.page = doc.data().page; // loads the current page of the user
            });
            document.querySelector(".main_quest").style.opacity = this.questToggle;

            // todo check if new day and reset quiz
        },
        watch: {
            questToggle: function() {
                var main = document.querySelector(".main_quest");
                gsap.to(main, {opacity: this.questToggle, duration: 1.5 * this.questToggle});
            }
        }
    }
                    
</script>

<style scoped>
    .exit {
        background: rgba(255, 255, 255, 0.1);
        cursor: pointer;
    }

    .questions {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(50px);
    }

    .options {
        @apply border-b-2 border-white my-4 w-1/2 cursor-pointer;
    }
</style>