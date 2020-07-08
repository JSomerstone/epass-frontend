import Vue from "vue";
import Router from "vue-router";
import ErrorPage from "./views/ErrorPage.vue";
import Tournaments from "./views/Tournaments.vue";
import store from "./store/index";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "tournaments",
      component: Tournaments,
      beforeEnter: async (_to, _from, next) => {
        if (store.getters["tournaments/all"].length == 0) {

          console.log("Dispatching load tournaments");
          const year = new Date().getFullYear();
          store.dispatch("tournaments/load", { year });
          store.dispatch("referees/load");
        }
        next();
      },
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
