import Vue from "vue";
import Router from "vue-router";
import store from "./store/index";

import ErrorPage from "./views/ErrorPage.vue";
import TournamentPage from "./views/TournamentPage.vue";
import Tournaments from "./views/Tournaments.vue";
import Signup from "./views/Signup.vue";
import Settings from "./views/Settings.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "frontpage",
      component: Tournaments,
    },
    {
      path: "/settings/:category?",
      name: "settings",
      component: Settings,
    },
    {
      path: "/tournaments/:year",
      name: "tournaments",
      component: Tournaments,
    },
    {
      path: "/tournament/:id",
      name: "tournament",
      component: TournamentPage,
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
      props: { tab: 1 },
    },
    {
      path: "/login",
      name: "login",
      component: Signup,
      props: { tab: 0 },
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
  const allowed = ["error", "login", "signup"];
  if (isAuthenticated || allowed.indexOf(to.name) >= 0 ) {
     next();
  }
  else {
    next({ name: "login" });
  }
});

export default router;
