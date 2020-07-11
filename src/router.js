import Vue from "vue";
import Router from "vue-router";
import ErrorPage from "./views/ErrorPage.vue";
import Tournaments from "./views/Tournaments.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "tournaments",
      component: Tournaments,
    },
    {
      path: "/tournaments/:year",
      name: "tournaments-of-year",
      component: Tournaments,
    },
    {
      path: "/tournaments/:year/:tournament",
      name: "tournament-selected",
      component: Tournaments,
    },
    {
      path: "*",
      props: true,
      name: "error",
      component: ErrorPage,
    },
  ],
});

export default router;
