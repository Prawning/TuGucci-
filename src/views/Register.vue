<template>
    <div class="main pt-72 w-screen flex flex-col items-center gap-40">
        <h1 class="text-9xl font-primary text-secondary">
            Welcome to TuGucci!
        </h1>

        <div class="error flex justify-center relative" v-if="err_message"> 
            {{err_message}} 
            <div class="absolute right-10 cursor-pointer" @click="close_error">
                &#10006;
            </div>
        </div>
        
        <div class="form lg:w-[35vw] w-[50vw] flex flex-col items-start justify-start p-10 pb-24 gap-10 rounded-xl shadow-lg">
                <div class="text-6xl font-primary text-quaternary">
                    Sign Up
                </div>

                <div class="field">
                    <label for="email">
                        Email
                    </label>
                    <input type="text" v-model="email"/>
                </div>

                <div class="field">
                    <label for="password">
                        Password
                    </label>
                    <input type="password" v-model="password"/>
                </div>

                <div class="field">
                    <label for="confirmPassword">
                        Confirm Password
                    </label>
                    <input type="password" v-model="confirm_password"/>
                </div>
                <div class="buttons">
                    <button @click="register">Register</button>
                    <button @click="google_register">Register with Google</button>
                </div>
        </div>

    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    import { addDoc, collection, getDocs, where, query } from "firebase/firestore";
    import {db, auth} from "../main.js";
    import { useRouter } from 'vue-router';
    import axios from 'axios';
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const confirm_password = ref("");
    const err_message = ref("");


    function register() {
        if (password.value == confirm_password.value) {
            createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                err_message.value = "";
                const user = userCredential.user;
                create_user(user.uid, email.value, email.value);
                router.push({name: "Home"});
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                switch(errorCode) {
                    case "auth/email-already-in-use":
                        err_message.value = "Email already in use";
                        break;
                    case "auth/invalid-email":
                        err_message.value = "Invalid email";
                        break;
                    case "auth/weak-password":
                        err_message.value = "Password is too weak";
                        break;
                    default:
                        err_message.value = "Unknown error";
                        break;
                }
            });
        }
    }

    function google_register() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(getAuth(), provider)
            .then(async (result) => {
                create_user(result.user.uid, result.user.email, result.user.displayName);
                router.push("/home");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                err_message.value = errorMessage;
            });
    }

    async function create_user(user_uid, email, username) {
        const q = query(collection(db, "users"), where("user_uid", "==", user_uid));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            addDoc(collection(db, "users"), {
                user_uid: user_uid,
                email: email,
                username: username,
                score: 100,
            });
            create_journal(user_uid);
            create_goals(user_uid);
        }
    }

    function create_goals(user_ref) {
        var goal_ref;
        try {
            goal_ref = addDoc(collection(db, "goals"), {
                user_uid: user_ref,
                goal: "Get out of bed!"
            });
        } catch (e) {
            console.log(e);
        };

        try {
            goal_ref = addDoc(collection(db, "goals"), {
                user_uid: user_ref,
                goal: "Drink Water"
            });
        } catch (e) {
            console.log(e);
        };

        try {
            goal_ref = addDoc(collection(db, "goals"), {
                user_uid: user_ref,
                goal: "Eat a meal"
            });
        } catch (e) {
            console.log(e);
        };

        try {
            goal_ref = addDoc(collection(db, "goals"), {
                user_uid: user_ref,
                goal: "Take a shower"
            });
        } catch (e) {
            console.log(e);
        };

        try {
            goal_ref = addDoc(collection(db, "goals"), {
                user_uid: user_ref,
                goal: "Get some air"
            });
        } catch (e) {
            console.log(e);
        };
    }

    async function create_journal(user_ref) {
        var sentiment_response = await axios.post(`https://textsentiment-3arqmo4jra-as.a.run.app/api`, {
            entry: "Use this app!",
        });

        var score = sentiment_response.data.score;
        var magnitude = sentiment_response.data.magnitude;
        try {
            addDoc(collection(db, "journals"), {
                user_uid: user_ref,
                date: new Date(),
                entry: "Use this app!",
                score: score,
                magnitude: magnitude,
            });
        } catch (e) {
            console.log(e);
        };
    }

    function close_error() {
        err_message.value = "";
    }
</script>

<style scoped>

    .error {
        @apply w-[50vw] lg:w-[35vw] text-center text-white bg-red-500 text-5xl rounded-xl font-secondary py-4;
    }

    .form {
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(20px);
    }

    .form > .field {
        @apply w-full flex flex-col gap-2;
    }

    input {
        @apply w-full text-3xl text-white p-2 bg-transparent border-2 border-quaternary;
    }

    .buttons {
        @apply w-full flex flex-row gap-4;
    }
    button {
        @apply text-3xl p-4 border-2 border-primary rounded-xl bg-quinary shadow-lg;
    }

    label {
        @apply text-4xl font-secondary text-white;
    }
</style>