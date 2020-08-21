import Vue from "vue";
import Router from "vue-router";
import store from "./store/index";
import routes from "@/routes";
Vue.use(Router);

const router = new Router({
  mode: "history",
  routes  
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
