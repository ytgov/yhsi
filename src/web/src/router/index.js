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
import SitesForm  from "../components/Sites";

import Summary from "../components/Sites/SitesForms/Summary";
import Location from "../components/Sites/SitesForms/Location";
import Dates from "../components/Sites/SitesForms/Dates";
import Themes from "../components/Sites/SitesForms/Themes";
import Associations from "../components/Sites/SitesForms/Associations";
import LegalAndZoning from "../components/Sites/SitesForms/LegalAndZoning";
import Photos from "../components/Sites/SitesForms/Photos";
import MainPhotos from "../components/MainPhotos";
import Management from "../components/Sites/SitesForms/Management";
import Description from "../components/Sites/SitesForms/Description";
import SitesGrid from "../components/Sites/SitesGrid";
import PhotosGrid from "../components/MainPhotos/PhotosGrid";
import Feature from "../components/MainPhotos/PhotosForms/Feature";
import SiteRecord from "../components/MainPhotos/PhotosForms/SiteRecord";
import HistoricSites from "../components/MainPhotos/PhotosForms/HistoricSites";
import Photo from "../components/MainPhotos/PhotosForms/Photo";
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
    path: "/sites",
    name: "SitesGrid",
    component: SitesGrid,
    meta: {
      requiresAuth: false
    },
  },
  {
    path: "/photos",
    name: "Photos",
    component: PhotosGrid,
    meta: {
      requiresAuth: false
    },
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
        component: Summary
      },
      {
        path: "location",
        component: Location
      },
      {
        path: "dates_&_condition", 
        component: Dates
      },
      {
        path: "themes_&_function", 
        component: Themes
      },
      {
        path: "associations", 
        component: Associations
      },
      {
        path: "legal_&_zoning", 
        component: LegalAndZoning
      },
      {
        path: "photos", 
        component: Photos
      },
      {
        path: "management", 
        component: Management
      },
      {
        path: "description", 
        component: Description
      }
    ]
  },
  {
    path: "/photos/:id",
    name: "PhotosForm",
    component: MainPhotos,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: "feature", 
        component: Feature
      },
      {
        path: "site_record",
        component: SiteRecord
      },
      {
        path: "historic_sites",
        component: HistoricSites
      },
      {
        path: "photo", 
        component: Photo
      }
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
