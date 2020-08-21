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

export default [
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
    path: "/epass/:refereeId/:year?",
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
]