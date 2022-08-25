<template>
    <div class="main lg:pt-72 pt:36 lg:gap-40 gap-10 w-screen flex flex-col items-center justify-start">
        <h1 class="lg:text-9xl text-6xl font-primary text-secondary">
            Welcome Back!
        </h1>

        <div class="error flex justify-center relative" v-if="err_message"> 
            {{err_message}} 
            <div class="absolute right-10 cursor-pointer" @click="close_error">
                &#10006;
            </div>
        </div>
        
        <div class="form lg:w-[35vw] w-[90vw] flex flex-col items-start justify-start p-10 pb-24 gap-10 rounded-xl shadow-lg">
                <div class="text-6xl font-primary text-quaternary">
                    Sign in
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
                <div class="buttons">
                    <button @click="signin">Login</button>
                    <button @click="google_login">Login with Google</button>
                </div>
        </div>

    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    import { useRouter } from 'vue-router';
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const err_message = ref("");



    function signin() {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            router.push({name: "Home"});
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            switch (errorCode) {
                case "auth/invalid-email":
                    err_message.value = "Invalid Email";
                    break;
                case "auth/user-disabled":
                    err_message.value = "User Disabled. Please contact support to re-enable your account.";
                    break;
                case "auth/user-not-found":
                    err_message.value = "User Not Found";
                    break;
                case "auth/wrong-password":
                    err_message.value = "Wrong Password";
                    break;
                default:
                    err_message.value = "Password or Email was incorrect";
                    break;
            }
        });
    }

    function google_login() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(getAuth(), provider)
            .then((result) => {
                router.push("/home");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                err_message.value = errorMessage;
            });
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