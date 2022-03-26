import Vue from 'vue';
import VueRouter from 'vue-router';
/*
import Home from '../components/Home.vue';
import Dashboard from '../components/Dashboard.vue';
import NotFound from '../views/NotFound.vue';
import Form from '../components/Form';
import Login from '../views/Login';
import LoginComplete from '../views/LoginComplete';
import Profile from '../views/Profile';
import store from '../store';
import SitesForm from '../components/Sites';
import Summary from '../components/Sites/SitesForms/Summary';
import Location from '../components/Sites/SitesForms/Location';
import Dates from '../components/Sites/SitesForms/Dates';
import Themes from '../components/Sites/SitesForms/Themes';
import Associations from '../components/Sites/SitesForms/Associations';
import LegalAndZoning from '../components/Sites/SitesForms/LegalAndZoning';
import Photos from '../components/Sites/SitesForms/Photos';
import MainPhotos from '../components/MainPhotos';
import Management from '../components/Sites/SitesForms/Management';
import Description from '../components/Sites/SitesForms/Description';
import SitesGrid from '../components/Sites/SitesGrid';
import PhotosGrid from '../components/MainPhotos/PhotosGrid';
import Feature from '../components/MainPhotos/PhotosComponents/Feature';
import SiteRecord from '../components/MainPhotos/PhotosComponents/SiteRecord';
import HistoricSites from '../components/MainPhotos/PhotosComponents/HistoricSites';
import Photo from '../components/MainPhotos/PhotosComponents/Photo';
import Users from '../components/People/UsersGrid';
import UserForm from '../components/People/UsersComponents/Form';
import OwnersGrid from '../components/PhotoOwners/OwnersGrid';
import OwnerForm from '../components/PhotoOwners/OwnersComponents/Form';
import Communities from '../components/Communities/CommunitiesGrid';
import CommunitiesForm from '../components/Communities/CommunitiesComponents/Form';
import Boats from '../components/Boats/Grid';
import BoatsGrid from '../components/Boats/Grid/Boats';
import OwnerGrid from '../components/Boats/Grid/Owner';
import BoatsForm from '../components/Boats/BoatsComponents/Boat/BoatsForm';
import BoatsOwnerForm from '../components/Boats/BoatsComponents/Owner/OwnerForm';
import AirplaneGrid from '../components/AirplaneCrashes/Grid';
import AirplaneViewForm from '../components/AirplaneCrashes/AirplaneComponents/AirplaneForm';
import AirplaneEditForm from '../components/AirplaneCrashes/AirplaneComponents/AirplaneForm';
import AdminDashboard from '../components/Administration/AdminDashboard';
import AdminUserGrid from '../components/Administration/UserManagement/Grid';
import AdminUserForm from '../components/Administration/UserManagement/UserComponent/Form';
import VesselTypeGrid from '../components/Administration/LookupTableManagement/VesselType/VesselType';
import BurialsGrid from '../components/Burials/Grid';
import BurialsForm from '../components/Burials/BurialsComponents/Form';

import Vue from "vue";
import VueRouter from "vue-router";*/
import goTo from 'vuetify/lib/services/goto';

import Dashboard from "../components/Dashboard.vue";
import NotFound from "../views/NotFound.vue";
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
import { UserRoles } from "../authorization";

import Cause from "../components/Administration/LookupTableManagement/Cause/Cause";
import Cemetary from "../components/Administration/LookupTableManagement/Cemetary/Cemetary";
import Membership from "../components/Administration/LookupTableManagement/Membership/Membership";
import Occupation from "../components/Administration/LookupTableManagement/Occupation/Occupation";
import Relationship from "../components/Administration/LookupTableManagement/Relationship/Relationship";
import Religion from "../components/Administration/LookupTableManagement/Religion/Religion";


Vue.use(VueRouter);

const routes = [
	/*{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: Dashboard,
	},
	{
		path: '/form',
		name: 'Basic Form',
		component: Form,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/sign-in',
		name: 'Login',
		component: Login,
	},
	{
		path: '/login-complete',
		name: 'LoginComplete',
		component: LoginComplete,
	},
	{
		path: '/profile',
		name: 'Profile',
		component: Profile,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/sites',
		name: 'SitesGrid',
		component: SitesGrid,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/photos',
		name: 'Photos',
		component: PhotosGrid,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/people',
		name: 'People',
		component: Users,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/photo-owners',
		name: 'PhotoOwners',
		component: OwnersGrid,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/communities',
		name: 'Communities',
		component: Communities,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/people/edit/:name',
		name: 'personEditView',
		component: UserForm,
		props: true,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/people/view/:name',
		component: UserForm,
		name: 'personView',
		props: true,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/people/new',
		component: UserForm,
		name: 'personAddView',
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/photo-owners/edit/:id',
		component: OwnerForm,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/photo-owners/add',
		component: OwnerForm,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/communities/edit/:id',
		component: CommunitiesForm,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/communities/add',
		component: CommunitiesForm,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/sites/:id',
		name: 'SitesForm',
		component: SitesForm,
		meta: {
			requiresAuth: false,
		},
		children: [
			{
				path: 'summary',
				component: Summary,
			},
			{
				path: 'location',
				component: Location,
			},
			{
				path: 'dates_&_condition',
				component: Dates,
			},
			{
				path: 'themes_&_function',
				component: Themes,
			},
			{
				path: 'associations',
				component: Associations,
			},
			{
				path: 'legal_&_zoning',
				component: LegalAndZoning,
			},
			{
				path: 'photos',
				component: Photos,
			},
			{
				path: 'management',
				component: Management,
			},
			{
				path: 'description',
				component: Description,
			},
		],
	},

	{
		path: "/photos/:mode",
		name: "PhotosForm",
		component: MainPhotos,
		meta: { requiresAuth: false },
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
		path: '/boats',

		component: Boats,
		meta: {
			requiresAuth: false,
		},
		children: [
			{
				path: '',
				name: 'Boats',
				component: BoatsGrid,
			},
			{
				path: 'owner',
				component: OwnerGrid,
			},
		],
	},
	{
		path: '/boats/view/:name',
		name: 'boatView',
		component: BoatsForm,
		props: true,
	},
	{
		path: '/boats/edit/:name',
		name: 'boatEditView',
		component: BoatsForm,
		props: true,
	},
	{
		path: '/boats/new',
		name: 'boatAddView',
		component: BoatsForm,
	},
	{
		path: '/boats/owner/view/:name',
		name: 'ownerView',
		component: BoatsOwnerForm,
		props: true,
	},
	{
		path: '/boats/owner/edit/:name',
		name: 'ownerEditView',
		component: BoatsOwnerForm,
		props: true,
	},
	{
		path: '/boats/owner/new',
		name: 'ownerAddView',
		component: BoatsOwnerForm,
	},
	{
		path: '/airplane',
		name: 'airplane',
		component: AirplaneGrid,
	},
	{
		path: '/airplane/view/:name',
		name: 'airplaneView',
		component: AirplaneViewForm,
		props: true,
	},
	{
		path: '/airplane/edit/:name',
		name: 'airplaneEditView',
		component: AirplaneEditForm,
		props: true,
	},
	{
		path: '/airplane/New',
		name: 'airplaneAddView',
		component: AirplaneEditForm,
		props: true,
	},
	{
		path: '/admin',
		name: 'AdminDashboard',
		component: AdminDashboard,
	},
	{
		path: '/admin/users',
		name: 'AdminUserGrid',
		component: AdminUserGrid,
	},
	{
		path: '/admin/users/view/:id',
		name: 'AdminUserView',
		component: AdminUserForm,
	},
	{
		path: '/admin/users/edit/:id',
		name: 'AdminUserEdit',
		component: AdminUserForm,
	},
	{
		path: '/admin/vessel_type',
		name: 'VesselTypeGrid',
		component: VesselTypeGrid,
	},
	{
		path: '/admin/cause',
		name: 'CauseGrid',
		component: Cause,
	},
	{
		path: '/admin/cemetary',
		name: 'CemetaryGrid',
		component: Cemetary,
	},
	{
		path: '/admin/membership',
		name: 'MembershipGrid',
		component: Membership,
	},
	{
		path: '/admin/occupation',
		name: 'OccupationGrid',
		component: Occupation,
	},
	{
		path: '/admin/relationship',
		name: 'RelationsihpGrid',
		component: Relationship,
	},
	{
		path: '/admin/religion',
		name: 'ReligionGrid',
		component: Religion,
	},
	{
		path: '/burials',
		name: 'BurialsGrid',
		component: BurialsGrid,
	},
	{
		path: '/burials/new',
		name: 'BurialsNewForm',
		component: BurialsForm,
		props: true,
	},
	{
		path: '/burials/view/:id',
		name: 'BurialsViewForm',
		component: BurialsForm,
		props: true,
	},
	{
		path: '/burials/edit/:id',
		name: 'BurialsEditForm',
		component: BurialsForm,
		props: true,
	},
	{
		path: '/places/view/:name',
		name: 'placeView',
		component: PlacesForm,
		props: true,
	},
	{
		path: '/places/edit/:name',
		name: 'placeEditView',
		component: PlacesForm,
		props: true,
	},
	{
		path: '/places/new',
		name: 'placeAddView',
		component: PlacesForm,
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
		path: '*',
		name: 'Not Found',
		component: NotFound,
	},
];*/

  {
    path: "/",
    name: "Home",
    component: () => import("../components/Home.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: () => import("../views/Signup.vue"),
  },
  {
    path: "/sign-in",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/login-complete",
    name: "LoginComplete",
    component: () => import("../views/LoginComplete.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: "/sites",
    name: "SitesTable",
    component: SitesTable,
    meta: { requiresAuth: true, authorize: [UserRoles.SITE_ADMIN, UserRoles.SITE_EDITOR, UserRoles.SITE_VIEWER, UserRoles.SITE_VIEWER_LIMITED] }
  },
  {
    path: "/maps",
    name: "Maps",
    component: Maps,
    meta: { requiresAuth: true },
  },
  {
    path: "/photos",
    name: "Photos",
    component: PhotosGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR, UserRoles.PHOTO_VIEWER] }
  },
  {
    path: "/people",
    name: "People",
    component: Users,
    meta: { requiresAuth: true, authorize: [UserRoles.PEOPLE_EDITOR] }
  },
  {
    path: "/photo-owners",
    name: "PhotoOwners",
    component: OwnersGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR] }
  },
  {
    path: "/communities",
    name: "Communities",
    component: Communities,
    meta: { requiresAuth: true }
  },
  {
    path: "/people/edit/:name",
    name: "personEditView",
    component: UserForm,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.PEOPLE_EDITOR] }
  },
  {
    path: "/people/view/:name",
    component: UserForm,
    name: "personView",
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.PEOPLE_EDITOR] }
  },
  {
    path: "/people/new",
    component: UserForm,
    name: "personAddView",
    meta: { requiresAuth: true, authorize: [UserRoles.PEOPLE_EDITOR] }
  },
  {
    path: "/photo-owners/edit/:id",
    component: OwnerForm,
    meta: { requiresAuth: true, authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR] }
  },
  {
    path: "/photo-owners/add",
    component: OwnerForm,
    meta: { requiresAuth: true, authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR] }
  },
  {
    path: "/communities/edit/:id",
    component: CommunitiesForm,
    meta: { requiresAuth: true }
  },
  {
    path: "/communities/add",
    component: CommunitiesForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/sites/:id',
    name: 'SiteForms',
    component: SiteForms,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.SITE_ADMIN, UserRoles.SITE_EDITOR, UserRoles.SITE_VIEWER, UserRoles.SITE_VIEWER_LIMITED] }
  },
  {
    path: "/photos/edit/:id",
    name: "PhotosFormEdit",
    component: MainPhotos,
    meta: { requiresAuth: true, authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR] },
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
    meta: { requiresAuth: true, authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR] },
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
    meta: { requiresAuth: true, authorize: [UserRoles.BOATS_EDITOR] },
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
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.BOATS_EDITOR] }
  },
  {
    path: "/boats/edit/:name",
    name: "boatEditView",
    component: BoatsForm,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.BOATS_EDITOR] }
  },
  {
    path: "/boats/new",
    name: "boatAddView",
    component: BoatsForm,
    meta: { requiresAuth: true, authorize: [UserRoles.BOATS_EDITOR] }
  },
  {
    path: "/boats/owner/view/:name",
    name: "ownerView",
    component: BoatsOwnerForm,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.BOATS_EDITOR] }
  },
  {
    path: "/boats/owner/edit/:name",
    name: "ownerEditView",
    component: BoatsOwnerForm,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.BOATS_EDITOR] }
  },
  {
    path: "/boats/owner/new",
    name: "ownerAddView",
    component: BoatsOwnerForm,
    meta: { requiresAuth: true, authorize: [UserRoles.BOATS_EDITOR] }
  },
  {
    path: "/airplane",
    name: "airplane",
    component: AirplaneGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.AIRPLANE_CRASH_EDITOR] }
  },
  {
    path: "/airplane/view/:name",
    name: "airplaneView",
    component: AirplaneViewForm,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.AIRPLANE_CRASH_EDITOR] }
  },
  {
    path: "/airplane/edit/:name",
    name: "airplaneEditView",
    component: AirplaneEditForm,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.AIRPLANE_CRASH_EDITOR] }
  },
  {
    path: "/airplane/New",
    name: "airplaneAddView",
    component: AirplaneEditForm,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.AIRPLANE_CRASH_EDITOR] }
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] }
  },
  {
    path: "/admin/users",
    name: "AdminUserGrid",
    component: AdminUserGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] }
  },
  {
    path: "/admin/users/:id",
    name: "AdminUserView",
    component: AdminUserForm,
    meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] }
  },
  {
    path: "/admin/vessel_type",
    name: "VesselTypeGrid",
    component: VesselTypeGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] }
  },
  {
	path: '/admin/cause',
	name: 'CauseGrid',
	component: Cause,
},
{
	path: '/admin/cemetary',
	name: 'CemetaryGrid',
	component: Cemetary,
},
{
	path: '/admin/membership',
	name: 'MembershipGrid',
	component: Membership,
},
{
	path: '/admin/occupation',
	name: 'OccupationGrid',
	component: Occupation,
},
{
	path: '/admin/relationship',
	name: 'RelationsihpGrid',
	component: Relationship,
},
{
	path: '/admin/religion',
	name: 'ReligionGrid',
	component: Religion,
},
{
	path: '/burials',
	name: 'BurialsGrid',
	component: BurialsGrid,
},
{
	path: '/burials/new',
	name: 'BurialsNewForm',
	component: BurialsForm,
	props: true,
},
{
	path: '/burials/view/:id',
	name: 'BurialsViewForm',
	component: BurialsForm,
	props: true,
},
{
	path: '/burials/edit/:id',
	name: 'BurialsEditForm',
	component: BurialsForm,
	props: true,
},
  {
    path: "/burials",
    name: "BurialsGrid",
    component: BurialsGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.BURIALS_EDITOR] }
  },
  {
    path: "/burials/view/:name",
    name: "BurialsViewForm",
    component: BurialsForm,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.BURIALS_EDITOR] }
  },
  {
    path: "/burials/edit/:name",
    name: "BurialsEditForm",
    component: BurialsForm,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.BURIALS_EDITOR] }
  },
  {
    path: "/places",
    name: "PlacesGrid",
    component: PlacesGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.PLACE_EDITOR] }
  },
  {
    path: "/places/view/:name",
    name: "placeView",
    component: PlacesForm,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.PLACE_EDITOR] }
  },
  {
    path: "/places/edit/:name",
    name: "placeEditView",
    component: PlacesForm,
    props: true,
    meta: { requiresAuth: true, authorize: [UserRoles.PLACE_EDITOR] }
  },
  {
    path: "/places/new",
    name: "placeAddView",
    component: PlacesForm,
    meta: { requiresAuth: true, authorize: [UserRoles.PLACE_EDITOR] }
  },
  {
    path: '/admin/placetype',
    name: 'PlaceTypeGrid',
    component: PlaceTypeGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] }
  },
  {
    path: "/admin/community",
    name: "CommunityGrid",
    component: CommunityGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] }
  },
  {
    path: "/admin/photo-owner",
    name: "PhotoOwnerGrid",
    component: PhotoOwnerGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] }
  },
  {
    path: "/admin/photo-project",
    name: "PhotoProjectGrid",
    component: PhotoProjectGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] }
  },
  {
    path: "/admin/photo-subject",
    name: "PhotoSubjectGrid",
    component: PhotoSubjectGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] }
  },
  {
    path: "/photobatches",
    name: "PhotoBatchGrid",
    component: PhotoBatchGrid,
    meta: { requiresAuth: true, authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR] },
  },
  {
    path: "/photobatches/upload",
    name: "PhotoBatchUpload",
    component: PhotoBatchUpload,
    meta: { requiresAuth: true, authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR] },
  },
  {
    path: "/photobatches/attributes/:mode",
    name: "PhotoBatchAttributes",
    component: PhotoBatchAttributes,
    meta: { requiresAuth: true, authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR] },
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
  let requiresAuth = to.meta.requiresAuth || false;

  if (!requiresAuth) {
    return next();
  }

  await store.dispatch('checkAuthentication');

  let isAuthenticated = store.getters.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    console.log("You aren't authenticatd, redirecting to sign-in");
    return next('/sign-in');
  }

  let authorize = to.meta.authorize || [];
  let isAuthorized = store.getters.userInRole(authorize);

  if (!isAuthorized) {
    console.log("You aren't authorized, redirecting to dashboard");
    next('/dashboard');
  }

  next();
});

export default router;
