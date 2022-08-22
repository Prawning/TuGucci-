import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Home from '../views/Home.vue';
import Landing from '../views/Landing.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Sentiment from '../views/Sentiment.vue';

const routes = [{
        path: "/",
        name: "Welcome",
        component: Landing,
        meta: {
            redirectIfLoggedIn: true
        }
    }, {
        path: "/home",
        name: "Home",
        component: Home,
        meta: {
            requiresAuth: true,
        }
    }, {
        path: "/aww",
        beforeEnter() {
            location.href = "https://www.reddit.com/r/aww/";
        }
    }, {
        path: "/register",
        name: "Register",
        component: Register
    }, {
        path: "/login",
        name: "Login",
        component: Login
    }, {
        path: "/sentiment",
        name: "Sentiment",
        component: Sentiment,
        meta: {
            requiresAuth: true,
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

function get_curr_user() {
    return new Promise((resolve, reject) => {
        const remove_listener = onAuthStateChanged(
            getAuth(),
            (user) => {
                remove_listener();
                resolve(user);
            },
            reject
        )
    })
}

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (await get_curr_user()) {
            next();
        } else {
            alert("Please login to view this page");
            next("/");
        }  
    } else if (to.matched.some((record) => record.meta.redirectIfLoggedIn)) {
        if (await get_curr_user()) {
            next("/home");
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;