import Vue from 'vue';
import VueRouter from 'vue-router';
import goTo from 'vuetify/lib/services/goto';

import { UserRoles } from '@/authorization';
import store from '@/store';

// new Style router imports
import aircrashRoutes from '@/modules/AirplaneCrashes/router/AircrashRouter.js';
import MapRoutes from '@/modules/map/router';

import NotFound from '@/views/NotFound.vue';
import Profile from '@/views/Profile';

// import AirplaneEditForm from '@/components/AirplaneCrashes/AirplaneComponents/AirplaneForm';
// import AirplaneGrid from '@/components/AirplaneCrashes/Grid';
// import AirplaneViewForm from '@/components/AirplaneCrashes/AirplaneComponents/AirplaneForm';
import ActionGrid from '@/components/InterpretiveSites/Grid/Actions';
import AssetGrid from '@/components/InterpretiveSites/Grid/Assets';
import Boats from '@/components/Boats/Grid';
import BoatsForm from '@/components/Boats/BoatsComponents/Boat/BoatsForm';
import BoatsGrid from '@/components/Boats/Grid/Boats';
import BoatsOwnerForm from '@/components/Boats/BoatsComponents/Owner/OwnerForm';
import BurialsForm from '@/components/Burials/BurialsComponents/Form';
import BurialsGrid from '@/components/Burials/Grid';
import Communities from '@/components/Communities/CommunitiesGrid';
import CommunitiesForm from '@/components/Communities/CommunitiesComponents/Form';
import Dashboard from '@/components/Dashboard.vue';
import InterpretiveSitesForm from '@/components/InterpretiveSites/InterpetiveSiteComponents/Form';
import InterpretiveSitesGrid from '@/components/InterpretiveSites/Grid/Sites';
import InterpretiveSitesIndex from '@/components/InterpretiveSites/Grid';
import OwnerForm from '@/components/PhotoOwners/OwnersComponents/Form';
import OwnerGrid from '@/components/Boats/Grid/Owner';
import OwnersGrid from '@/components/PhotoOwners/OwnersGrid';
import PlacesForm from '@/components/Places/PlacesComponents/PlacesForm';
import PlacesGrid from '@/components/Places/PlacesGrid';
import SiteCreate from '@/components/Sites/SiteCreate';
import SiteForms from '@/components/Sites/SiteForms';
import SitesTable from '@/components/Sites/SitesTable';
import UserForm from '@/components/People/UsersComponents/Form';

import Feature from '@/components/MainPhotos/PhotosComponents/Feature';
import HistoricSites from '@/components/MainPhotos/PhotosComponents/HistoricSites';
import MainPhotos from '@/components/MainPhotos';
import Photo from '@/components/MainPhotos/PhotosComponents/Photo';
import PhotoBatchAttributesEdit from '@/components/MainPhotos/PhotoBatches/AttributesEdit';
import PhotoBatchAttributesView from '@/components/MainPhotos/PhotoBatches/AttributesView';
import PhotoBatchGrid from '@/components/MainPhotos/PhotoBatches/Grid';
import PhotosGrid from '@/components/MainPhotos/PhotosGrid';
import SiteRecord from '@/components/MainPhotos/PhotosComponents/SiteRecord';

import AdminDashboard from '@/components/Administration/AdminDashboard';
import AdminUserForm from '@/components/Administration/UserManagement/UserComponent/Form';
import AdminUserGrid from '@/components/Administration/UserManagement/Grid';
import AssetType from '@/components/Administration/LookupTableManagement/AssetType/AssetType';
import Category from '@/components/Administration/LookupTableManagement/Category/Category';
import Cause from '@/components/Administration/LookupTableManagement/Cause/Cause';
import Cemetary from '@/components/Administration/LookupTableManagement/Cemetary/Cemetary';
import CommunityGrid from '@/components/Administration/LookupTableManagement/Community/CommunityGrid';
import IntSiteOwner from '@/components/Administration/LookupTableManagement/IntSiteOwner/IntSiteOwner';
import Membership from '@/components/Administration/LookupTableManagement/Membership/Membership';
import Occupation from '@/components/Administration/LookupTableManagement/Occupation/Occupation';
import PhotoOwnerGrid from '@/components/Administration/LookupTableManagement/PhotoOwner/PhotoOwnerGrid';
import PhotoProjectGrid from '@/components/Administration/LookupTableManagement/PhotoProject/PhotoProjectGrid';
import PhotoSubjectGrid from '@/components/Administration/LookupTableManagement/PhotoSubject/PhotoSubjectGrid';
import PlaceTypeGrid from '@/components/Administration/LookupTableManagement/PlaceType/PlaceType';
import Relationship from '@/components/Administration/LookupTableManagement/Relationship/Relationship';
import Religion from '@/components/Administration/LookupTableManagement/Religion/Religion';
import Route from '@/components/Administration/LookupTableManagement/Route/Route';
import VesselTypeGrid from '@/components/Administration/LookupTableManagement/VesselType/VesselType';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('@/components/Home.vue'),
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: Dashboard,
		meta: { requiresAuth: true },
	},
	{
		path: '/sign-up',
		name: 'SignUp',
		component: () => import('@/views/Signup.vue'),
	},
	{
		path: '/sign-in',
		name: 'Login',
		component: () => import('@/views/Login.vue'),
	},
	{
		path: '/login-complete',
		name: 'LoginComplete',
		component: () => import('@/views/LoginComplete.vue'),
	},
	{
		path: '/profile',
		name: 'Profile',
		component: Profile,
		meta: { requiresAuth: true },
	},
	{
		path: '/sites',
		name: 'SitesTable',
		component: SitesTable,
		meta: {
			requiresAuth: true,
			authorize: [
				UserRoles.SITE_ADMIN,
				UserRoles.SITE_EDITOR,
				UserRoles.SITE_VIEWER,
				UserRoles.SITE_VIEWER_LIMITED,
			],
		},
	},
	{
		path: '/sites-change-requests',
		name: 'sitesChangeRequestsTable',
		component: () => import('@/components/Sites/SitesChangeRequestsTable'),
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.SITE_ADMIN],
		},
	},
	{
		path: '/sites-change-requests/:placeEditId',
		name: 'siteChangeRequest',
		component: () => import('@/components/Sites/SiteChangeRequest'),
		props: true,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.SITE_ADMIN],
		},
	},
	{
		path: '/photos',
		name: 'Photos',
		component: PhotosGrid,
		meta: {
			requiresAuth: true,
			authorize: [
				UserRoles.PHOTO_ADMIN,
				UserRoles.PHOTO_EDITOR,
				UserRoles.PHOTO_VIEWER,
			],
		},
	},
	{
		path: '/photo-owners',
		name: 'PhotoOwners',
		component: OwnersGrid,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR],
		},
	},
	{
		path: '/communities',
		name: 'Communities',
		component: Communities,
		meta: { requiresAuth: true },
	},
	{
		path: '/people',
		name: 'People',
		component: () => import('@/pages/people/PeoplesPage.vue'),
		meta: { requiresAuth: true, authorize: [UserRoles.PEOPLE_EDITOR] },
	},
	{
		path: '/people/edit/:name',
		name: 'personEditView',
		component: UserForm,
		props: true,
		meta: { requiresAuth: true, authorize: [UserRoles.PEOPLE_EDITOR] },
	},
	{
		path: '/people/view/:name',
		component: UserForm,
		name: 'personView',
		props: true,
		meta: { requiresAuth: true, authorize: [UserRoles.PEOPLE_EDITOR] },
	},
	{
		path: '/people/new',
		component: UserForm,
		name: 'personAddView',
		meta: { requiresAuth: true, authorize: [UserRoles.PEOPLE_EDITOR] },
	},
	{
		path: '/photo-owners/edit/:id',
		component: OwnerForm,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR],
		},
	},
	{
		path: '/photo-owners/add',
		component: OwnerForm,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR],
		},
	},
	{
		path: '/communities/edit/:id',
		component: CommunitiesForm,
		meta: { requiresAuth: true },
	},
	{
		path: '/communities/add',
		component: CommunitiesForm,
		meta: { requiresAuth: true },
	},
	{
		path: '/sites/:id/edit',
		name: 'Edit',
		component: SiteForms,
		props: true,
		meta: {
			requiresAuth: true,
			authorize: [
				UserRoles.SITE_ADMIN,
				UserRoles.SITE_EDITOR,
				UserRoles.SITE_VIEWER,
				UserRoles.SITE_VIEWER_LIMITED,
			],
		},
	},
	{
		path: '/sites/create',
		name: 'SiteCreate',
		component: SiteCreate,
		props: true,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.SITE_ADMIN, UserRoles.SITE_EDITOR],
		},
	},
	{
		path: '/sites/:id',
		name: 'SiteForms',
		component: SiteForms,
		props: true,
		meta: {
			requiresAuth: true,
			authorize: [
				UserRoles.SITE_ADMIN,
				UserRoles.SITE_EDITOR,
				UserRoles.SITE_VIEWER,
				UserRoles.SITE_VIEWER_LIMITED,
			],
		},
	},
	{
		path: '/photos/:mode',
		name: 'PhotosForm',
		component: MainPhotos,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR],
		},
		children: [
			{
				path: 'feature',
				component: Feature,
			},
			{
				path: 'site_record',
				component: SiteRecord,
			},
			{
				path: 'historic_sites',
				component: HistoricSites,
			},
			{
				path: 'photo',
				component: Photo,
			},
		],
	},
	{
		path: '/boats',
		component: Boats,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.BOATS_EDITOR, UserRoles.BOATS_VIEWER],
		},
		children: [
			{
				path: '',
				name: 'Boats',
				component: BoatsGrid,
				meta: {
					requiresAuth: true,
					authorize: [UserRoles.BOATS_EDITOR, UserRoles.BOATS_VIEWER],
				},
			},
			{
				path: 'owner',
				component: OwnerGrid,
				meta: {
					requiresAuth: true,
					authorize: [UserRoles.BOATS_EDITOR, UserRoles.BOATS_VIEWER],
				},
			},
		],
	},
	{
		path: '/boats/view/:name',
		name: 'boatView',
		component: BoatsForm,
		props: true,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.BOATS_EDITOR, UserRoles.BOATS_VIEWER],
		},
	},
	{
		path: '/boats/edit/:name',
		name: 'boatEditView',
		component: BoatsForm,
		props: true,
		meta: { requiresAuth: true, authorize: [UserRoles.BOATS_EDITOR] },
	},
	{
		path: '/boats/new',
		name: 'boatAddView',
		component: BoatsForm,
		meta: { requiresAuth: true, authorize: [UserRoles.BOATS_EDITOR] },
	},
	{
		path: '/boats/owner/view/:name',
		name: 'ownerView',
		component: BoatsOwnerForm,
		props: true,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.BOATS_EDITOR, UserRoles.BOATS_VIEWER],
		},
	},
	{
		path: '/boats/owner/edit/:name',
		name: 'ownerEditView',
		component: BoatsOwnerForm,
		props: true,
		meta: { requiresAuth: true, authorize: [UserRoles.BOATS_EDITOR] },
	},
	{
		path: '/boats/owner/new',
		name: 'ownerAddView',
		component: BoatsOwnerForm,
		meta: { requiresAuth: true, authorize: [UserRoles.BOATS_EDITOR] },
	},
	{
		path: '/airplane',
		component: () => import('@/layouts/BlankLayout.vue'),
		children: [...aircrashRoutes],
	},
	// {
	// 	path: '/airplane',
	// 	name: 'airplane',
	// 	component: AirplaneGrid,
	// 	meta: { requiresAuth: true, authorize: [UserRoles.AIRPLANE_CRASH_EDITOR] },
	// },
	// {
	// 	path: '/airplane/view/:name',
	// 	name: 'airplaneView',
	// 	component: AirplaneViewForm,
	// 	props: { action: 'view' },
	// 	meta: { requiresAuth: true, authorize: [UserRoles.AIRPLANE_CRASH_EDITOR] },
	// },
	// {
	// 	path: '/airplane/edit/:name',
	// 	name: 'airplaneEditView',
	// 	component: AirplaneEditForm,
	// 	props: { action: 'edit' },
	// 	meta: { requiresAuth: true, authorize: [UserRoles.AIRPLANE_CRASH_EDITOR] },
	// },
	// {
	// 	path: '/airplane/new',
	// 	name: 'airplaneAddView',
	// 	component: AirplaneEditForm,
	// 	props: { action: 'new' },
	// 	meta: { requiresAuth: true, authorize: [UserRoles.AIRPLANE_CRASH_EDITOR] },
	// },
	{
		path: '/admin',
		name: 'AdminDashboard',
		component: AdminDashboard,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/users',
		name: 'AdminUserGrid',
		component: AdminUserGrid,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/users/:id',
		name: 'AdminUserView',
		component: AdminUserForm,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/vessel_types',
		name: 'VesselTypeGrid',
		component: VesselTypeGrid,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/causes',
		name: 'CauseGrid',
		component: Cause,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/cemeteries',
		name: 'CemetaryGrid',
		component: Cemetary,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/memberships',
		name: 'MembershipGrid',
		component: Membership,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/occupations',
		name: 'OccupationGrid',
		component: Occupation,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/relationships',
		name: 'RelationsihpGrid',
		component: Relationship,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/religions',
		name: 'ReligionGrid',
		component: Religion,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/categories',
		name: 'CategoryGrid',
		component: Category,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/asset-types',
		name: 'AssetTypeGrid',
		component: AssetType,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/maintainers',
		name: 'IntSiteOwnerGrid',
		component: IntSiteOwner,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/routes',
		name: 'RouteGrid',
		component: Route,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/burials',
		name: 'BurialsGrid',
		component: BurialsGrid,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.BURIALS_EDITOR, UserRoles.BURIALS_VIEWER],
		},
	},
	{
		path: '/burials/view/:name',
		name: 'BurialsViewForm',
		component: BurialsForm,
		props: true,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.BURIALS_EDITOR, UserRoles.BURIALS_VIEWER],
		},
	},
	{
		path: '/burials/edit/:id',
		name: 'BurialsEditForm',
		component: BurialsForm,
		props: true,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.BURIALS_EDITOR, UserRoles.BURIALS_VIEWER],
		},
	},
	{
		path: '/interpretive-sites',
		name: 'InterpretiveSitesGrid',
		component: InterpretiveSitesIndex,
		children: [
			{
				path: '',
				name: 'InterpretiveSitesGrid',
				component: InterpretiveSitesGrid,
				meta: {
					requiresAuth: true,
					authorize: [
						UserRoles.INTERPRETIVE_SITES_EDITOR,
						UserRoles.INTERPRETIVE_SITES_VIEWER,
					],
				},
			},
			{
				path: 'actions',
				name: 'ActionGrid',
				component: ActionGrid,
				meta: {
					requiresAuth: true,
					authorize: [
						UserRoles.INTERPRETIVE_SITES_EDITOR,
						UserRoles.INTERPRETIVE_SITES_VIEWER,
					],
				},
			},
			{
				path: 'assets',
				name: 'AssetGrid',
				component: AssetGrid,
				meta: {
					requiresAuth: true,
					authorize: [
						UserRoles.INTERPRETIVE_SITES_EDITOR,
						UserRoles.INTERPRETIVE_SITES_VIEWER,
					],
				},
			},
		],
	},
	{
		path: '/interpretive-sites/view/:id',
		name: 'InterpretiveSitesView',
		component: InterpretiveSitesForm,
		props: true,
		meta: {
			requiresAuth: true,
			authorize: [
				UserRoles.INTERPRETIVE_SITES_EDITOR,
				UserRoles.INTERPRETIVE_SITES_VIEWER,
			],
		},
		//Disabled for the time being || meta: { requiresAuth: true, authorize: [UserRoles.BURIALS_EDITOR] }
	},
	{
		path: '/interpretive-sites/edit/:id',
		name: 'InterpretiveSitesEdit',
		component: InterpretiveSitesForm,
		props: true,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.INTERPRETIVE_SITES_EDITOR],
		},
		//Disabled for the time being || meta: { requiresAuth: true, authorize: [UserRoles.BURIALS_EDITOR] }
	},
	{
		path: '/interpretive-sites/new',
		name: 'InterpretiveSitesNew',
		component: InterpretiveSitesForm,

		meta: {
			requiresAuth: true,
			authorize: [UserRoles.INTERPRETIVE_SITES_EDITOR],
		},
		//Disabled for the time being || meta: { requiresAuth: true, authorize: [UserRoles.BURIALS_EDITOR] }
	},
	{
		path: '/places',
		name: 'PlacesGrid',
		component: PlacesGrid,
		meta: { requiresAuth: true, authorize: [UserRoles.PLACE_EDITOR] },
	},
	{
		path: '/places/view/:name',
		name: 'placeView',
		component: PlacesForm,
		props: true,
		meta: { requiresAuth: true, authorize: [UserRoles.PLACE_EDITOR] },
	},
	{
		path: '/places/edit/:name',
		name: 'placeEditView',
		component: PlacesForm,
		props: true,
		meta: { requiresAuth: true, authorize: [UserRoles.PLACE_EDITOR] },
	},
	{
		path: '/places/new',
		name: 'placeAddView',
		component: PlacesForm,
		meta: { requiresAuth: true, authorize: [UserRoles.PLACE_EDITOR] },
	},
	{
		path: '/admin/placetype',
		name: 'PlaceTypeGrid',
		component: PlaceTypeGrid,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/community',
		name: 'CommunityGrid',
		component: CommunityGrid,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/photo-owner',
		name: 'PhotoOwnerGrid',
		component: PhotoOwnerGrid,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/photo-project',
		name: 'PhotoProjectGrid',
		component: PhotoProjectGrid,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/admin/photo-subject',
		name: 'PhotoSubjectGrid',
		component: PhotoSubjectGrid,
		meta: { requiresAuth: true, authorize: [UserRoles.ADMINISTRATOR] },
	},
	{
		path: '/photobatches',
		name: 'PhotoBatchGrid',
		component: PhotoBatchGrid,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR],
		},
	},
	{
		path: '/photobatches/attributes',
		name: 'PhotoBatchAttributesView',
		component: PhotoBatchAttributesView,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR],
		},
	},
	{
		path: '/photobatches/attributes/edit',
		name: 'PhotoBatchAttributesEdit',
		component: PhotoBatchAttributesEdit,
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.PHOTO_ADMIN, UserRoles.PHOTO_EDITOR],
		},
	},

	...MapRoutes,

	{
		path: '*',
		name: 'Not Found',
		component: NotFound,
	},
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
	const requiresAuth = to.meta.requiresAuth || false;

	if (!requiresAuth) {
		return next();
	}

	await store.dispatch('checkAuthentication');

	const isAuthenticated = store.getters.isAuthenticated;

	if (requiresAuth && !isAuthenticated) {
		console.log("You aren't authenticatd, redirecting to sign-in");
		return next('/sign-in');
	}

	const authorize = to.meta.authorize || [];
	const isActive = store.getters.userIsActive;

	if (authorize.length > 0 && !isActive) {
		console.log("You aren't active, redirecting to dashboard");
		next('/dashboard');
	}

	const isAuthorized = store.getters.userInRole(authorize);

	if (!isAuthorized) {
		console.log("You aren't authorized, redirecting to dashboard");
		next('/dashboard');
	}

	next();
});

export default router;
