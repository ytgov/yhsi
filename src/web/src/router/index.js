import Vue from "vue";
import VueRouter from "vue-router";
import goTo from 'vuetify/lib/services/goto';

import Home from "../components/Home.vue";
import Dashboard from "../components/Dashboard.vue";
import NotFound from "../views/NotFound.vue";
import Form from "../components/Form";
import Login from "../views/Login";
import LoginComplete from "../views/LoginComplete";
import Profile from "../views/Profile";
import Maps from "../views/Maps";
import store from "../store";
import SiteForms from "@/components/Sites/SiteForms";
import MainPhotos from "../components/MainPhotos";
import SitesTable from "@/components/Sites/SitesTable";
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
import PlacesGrid from '../components/Places/PlacesGrid';
import PlaceTypeGrid from '../components/Administration/LookupTableManagement/PlaceType/PlaceType';
import PlacesForm from '../components/Places/PlacesComponents/PlacesForm';
import PhotoBatchGrid from "../components/MainPhotos/PhotoBatches/Grid";
import PhotoBatchUpload from "../components/MainPhotos/PhotoBatches/Upload";
import PhotoBatchAttributes from "../components/MainPhotos/PhotoBatches/Attributes";
import CommunityGrid from "../components/Administration/LookupTableManagement/Community/CommunityGrid";
import PhotoOwnerGrid from "../components/Administration/LookupTableManagement/PhotoOwner/PhotoOwnerGrid";
import PhotoProjectGrid from "../components/Administration/LookupTableManagement/PhotoProject/PhotoProjectGrid";
import PhotoSubjectGrid from "../components/Administration/LookupTableManagement/PhotoSubject/PhotoSubjectGrid";


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
    name: "SitesTable",
    component: SitesTable,
  },
  {
    path: "/maps",
    name: "Maps",
    component: Maps,
    meta: {
      requiresAuth: true
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
    path: '/sites/:id',
    name: 'SiteForms',
    component: SiteForms,
    props: true,
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
    path: "/admin/users/:id",
    name: "AdminUserView",
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
    path: "/places/view/:name",
    name: "placeView",
    component: PlacesForm,
    props: true
  },
  {
    path: "/places/edit/:name",
    name: "placeEditView",
    component: PlacesForm,
    props: true
  },
  {
    path: "/places/new",
    name: "placeAddView",
    component: PlacesForm
  },
  {
    path: '/admin/placetype',
    name: 'PlaceTypeGrid',
    component: PlaceTypeGrid,
  },
  {
    path: '/places',
    name: 'PlacesGrid',
    component: PlacesGrid,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/admin/community",
    name: "CommunityGrid",
    component: CommunityGrid
  },
  {
    path: "/admin/photo-owner",
    name: "PhotoOwnerGrid",
    component: PhotoOwnerGrid
  },
  {
    path: "/admin/photo-project",
    name: "PhotoProjectGrid",
    component: PhotoProjectGrid
  },
  {
    path: "/admin/photo-subject",
    name: "PhotoSubjectGrid",
    component: PhotoSubjectGrid
  },
  {
    path: "/photobatches",
    name: "PhotoBatchGrid",
    component: PhotoBatchGrid
  },
  {
    path: "/photobatches/upload",
    name: "PhotoBatchUpload",
    component: PhotoBatchUpload
  },
  {
    path: "/photobatches/attributes/:mode",
    name: "PhotoBatchAttributes",
    component: PhotoBatchAttributes
  },
  {
    path: "*",
    name: "Not Found",
    component: NotFound
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return goTo(savedPosition.y);
    }

    if (to.hash) {
      return goTo(to.hash, { offset: 75 });
    }

    return goTo(0);
  },
});

router.beforeEach(async (to, from, next) => {
  var requiresAuth = to.meta.requiresAuth || false;

  if (!requiresAuth) {
    return next();
  }

  await store.dispatch('checkAuthentication');
  var isAuthenticated = store.getters.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    console.log("You aren't authenticatd, redirecting to sign-in");
    next('/sign-in');
    return;
  }

  return next();
});

export default router;
