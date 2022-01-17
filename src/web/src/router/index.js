import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Dashboard from "../components/Dashboard.vue";
import NotFound from "../views/NotFound.vue";
import Form from "../components/Form";
import Login from "../views/Login";
import LoginComplete from "../views/LoginComplete";
import Profile from "../views/Profile";
import store from "../store";
import SitesForm from "../components/Sites";

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
import Feature from "../components/MainPhotos/PhotosComponents/Feature";
import SiteRecord from "../components/MainPhotos/PhotosComponents/SiteRecord";
import HistoricSites from "../components/MainPhotos/PhotosComponents/HistoricSites";
import Photo from "../components/MainPhotos/PhotosComponents/Photo";
import Users from "../components/People/UsersGrid";
import UserForm from "../components/People/UsersComponents/Form";
import OwnersGrid from "../components/PhotoOwners/OwnersGrid";
import OwnerForm from "../components/PhotoOwners/OwnersComponents/Form";
import Communities from "../components/Communities/CommunitiesGrid";
import CommunitiesForm from "../components/Communities/CommunitiesComponents/Form";
import Boats from "../components/Boats/Grid";
import BoatsGrid from "../components/Boats/Grid/Boats";
import OwnerGrid from "../components/Boats/Grid/Owner";
import BoatsForm from "../components/Boats/BoatsComponents/Boat/BoatsForm";
import BoatsOwnerForm from "../components/Boats/BoatsComponents/Owner/OwnerForm";
import AirplaneGrid from "../components/AirplaneCrashes/Grid";
import AirplaneViewForm from "../components/AirplaneCrashes/AirplaneComponents/AirplaneForm";
import AirplaneEditForm from "../components/AirplaneCrashes/AirplaneComponents/AirplaneForm";
import AdminDashboard from "../components/Administration/AdminDashboard";
import AdminUserGrid from "../components/Administration/UserManagement/Grid";
import AdminUserForm from "../components/Administration/UserManagement/UserComponent/Form";
import VesselTypeGrid from "../components/Administration/LookupTableManagement/VesselType/VesselType";
import BurialsGrid from "../components/Burials/Grid";
import BurialsForm from "../components/Burials/BurialsComponents/Form";

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
    path: "/people",
    name: "People",
    component: Users,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/photo-owners",
    name: "PhotoOwners",
    component: OwnersGrid,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/communities",
    name: "Communities",
    component: Communities,
    meta: {
      requiresAuth: false
    }
  },
  {
      path: "/people/edit/:name",
      name: "personEditView",
      component: UserForm,
      props: true,
      meta: {
        requiresAuth: false
      }
  },
  {
    path: "/people/view/:name",
    component: UserForm,
    name: "personView",
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/people/new",
    component: UserForm,
    name: "personAddView",
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/photo-owners/edit/:id",
    component: OwnerForm,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/photo-owners/add",
    component: OwnerForm,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/communities/edit/:id",
    component: CommunitiesForm,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/communities/add",
    component: CommunitiesForm,
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
    path: "/photos/edit/:id",
    name: "PhotosFormEdit",
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
    path: "/photos/add",
    name: "PhotosFormAdd",
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
    path: "/boats",
    
    component: Boats,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: "",
        name: "Boats",
        component: BoatsGrid
      },
      {
        path: "owner",
        component: OwnerGrid
      }
    ]
  },
  {
    path: "/boats/view/:name",
    name: "boatView",
    component: BoatsForm,
    props: true
  },
  {
    path: "/boats/edit/:name",
    name: "boatEditView",
    component: BoatsForm,
    props: true
  },
  {
    path: "/boats/new",
    name: "boatAddView",
    component: BoatsForm
  },
  {
    path: "/boats/owner/view/:name",
    name: "ownerView",
    component: BoatsOwnerForm,
    props: true
  },
  {
    path: "/boats/owner/edit/:name",
    name: "ownerEditView",
    component: BoatsOwnerForm,
    props: true
  },
  {
    path: "/boats/owner/new",
    name: "ownerAddView",
    component: BoatsOwnerForm
  },
  {
    path: "/airplane",
    name: "airplane",
    component: AirplaneGrid
  },
  {
    path: "/airplane/view/:name",
    name: "airplaneView",
    component: AirplaneViewForm,
    props: true
  },
  {
    path: "/airplane/edit/:name",
    name: "airplaneEditView",
    component: AirplaneEditForm,
    props: true
  },
  {
    path: "/airplane/New",
    name: "airplaneAddView",
    component: AirplaneEditForm,
    props: true
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard,
  },
  {
    path: "/admin/users",
    name: "AdminUserGrid",
    component: AdminUserGrid
  },
  {
    path: "/admin/users/view/:id",
    name: "AdminUserView",
    component: AdminUserForm
  },
  {
    path: "/admin/users/edit/:id",
    name: "AdminUserEdit",
    component: AdminUserForm
  },
  {
    path: "/admin/vessel_type",
    name: "VesselTypeGrid",
    component: VesselTypeGrid
  },
  {
    path: "/burials",
    name: "BurialsGrid",
    component: BurialsGrid
  },
  {
    path: "/burials/view/:name",
    name: "BurialsViewForm",
    component: BurialsForm,
    props: true
  },
  {
    path: "/burials/edit/:name",
    name: "BurialsEditForm",
    component: BurialsForm,
    props: true
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

  store.dispatch("setAppSidebar", to.path.startsWith("/sites/"))

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