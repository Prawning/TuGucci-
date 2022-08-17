import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Landing from '../views/Landing.vue';

const routes = [{
        path: "/",
        name: "Welcome",
        component: Landing,
    }, {
        path: "/home",
        name: "Home",
        component: Home,
    }, {
        path: "/aww",
        beforeEnter() {
            location.href = "https://www.reddit.com/r/aww/";
        }
    }
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;