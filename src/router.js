import Vue from "vue";
import Router from "vue-router";
import store from "./store/index";

import About from "./views/About.vue";
import ErrorPage from "./views/ErrorPage.vue";
import TournamentPage from "./views/TournamentPage.vue";
import Tournaments from "./views/Tournaments.vue";
import Signup from "./views/Signup.vue";
import Settings from "./views/Settings.vue";
import Statistics from "./views/Statistics.vue";
import PrintEpass from "./views/PrintEpass.vue";
import Privacy from "./views/Privacy.vue";
import ForgotPassword from "./views/ForgotPassword.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "frontpage",
      meta: { title: "Frontpage" },
      component: Tournaments,
    },
    {
      path: "/about/",
      name: "about",
      component: About,
    },
    {
      path: "/settings/:category?",
      name: "settings",
      component: Settings,
    },
    {
      path: "/tournaments/:year/",
      name: "tournaments",
      component: Tournaments,
      meta: { title: "Tournaments" },
    },
    {
      path: "/statistics/:year?",
      name: "statistics",
      component: Statistics,
    },
    {
      path: "/epass/:year?",
      name: "print-epass",
      component: PrintEpass,
    },
    {
      path: "/tournament/:id/",
      name: "tournament",
      component: TournamentPage,
    },
    {
      path: "/signup/",
      name: "signup",
      component: Signup,
      props: { tab: 1 },
    },
    {
      path: "/login/",
      name: "login",
      component: Signup,
      props: { tab: 0 },
    },
    {
      path: "/privacy",
      name: "privacy",
      component: Privacy,
      meta: { title: "Privacy Policy" },
    },
    {
      path: "/forgot-password/",
      name: "forgot-password",
      component: ForgotPassword,
    },
    {
      path: "*",
      props: true,
      name: "error",
      component: ErrorPage,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters["auth/loggedIn"];
  const allowed = ["about", "error", "login", "signup", "forgot-password", "privacy"];
  if (isAuthenticated || allowed.indexOf(to.name) >= 0 ) {
     next();
  }
  else {
    next({ name: "login" });
  }
});

export default router;
