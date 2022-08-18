import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Landing from '../views/Landing.vue';
import Questions from '../views/questionnaires/Page.vue'

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
    }, {
        path: "/questions",
        name: "Questions",
        component: Questions
    }
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;