import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Dashboard from "../components/Dashboard.vue";
import NotFound from "../views/NotFound.vue";
import Form from "../components/Form";
import Grid from "../components/Grid";
import Login from "../components/Login";
import LoginComplete from "../components/LoginComplete";
import Profile from "../components/Profile";
import store from "../store";
import SitesForm  from "../components/SitesForm";
import SitesFormSummary from "../components/SitesFormSubComponents/SitesFormSummary";
import SitesFormLocation from "../components/SitesFormSubComponents/SitesFormLocation";
import SitesFormDates from "../components/SitesFormSubComponents/SitesFormDates";
import SitesFormThemes from "../components/SitesFormSubComponents/SitesFormThemes";
import SitesFormAssociations from "../components/SitesFormSubComponents/SitesFormAssociations";
import SitesFormLegal_Zoning from "../components/SitesFormSubComponents/SitesFormLegal_Zoning";
import SitesFormPhotos from "../components/SitesFormSubComponents/SitesFormPhotos";
import SitesFormManagement from "../components/SitesFormSubComponents/SitesFormManagement";
import SitesFormDescription from "../components/SitesFormSubComponents/SitesFormDescription";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/form",
    name: "Basic Form",
    component: Form,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/grid",
    name: "Data grid",
    component: Grid,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/sign-in",
    name: "Login",
    component: Login
  },
  {
    path: "/login-complete",
    name: "LoginComplete",
    component: LoginComplete
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/sites/:id",
    name: "SitesForm",
    component: SitesForm,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: "summary", 
        component: SitesFormSummary
      },
      {
        path: "location",
        component: SitesFormLocation
      },
      {
        path: "dates", 
        component: SitesFormDates
      },
      {
        path: "themes", 
        component: SitesFormThemes
      },
      {
        path: "associations", 
        component: SitesFormAssociations
      },
      {
        path: "legal_&_zoning", 
        component: SitesFormLegal_Zoning
      },
      {
        path: "photos", 
        component: SitesFormPhotos
      },
      {
        path: "management", 
        component: SitesFormManagement
      },
      {
        path: "description", 
        component: SitesFormDescription
      },
    ]
  },
  {
    path: "*",
    name: "Not Found",
    component: NotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  var requiresAuth = to.meta.requiresAuth || false;

  if (!requiresAuth) {
    return next();
  }

  await store.dispatch("checkAuthentication");
  var isAuthenticated = store.getters.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    console.log("You aren't authenticatd, redirecting to sign-in");
    next("/sign-in");
    return;
  }

  return next();
});

export default router;
