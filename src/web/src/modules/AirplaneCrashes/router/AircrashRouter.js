import { UserRoles } from '@/authorization';
const routes = [
	{
		path: '',
		name: 'airplane',
		component: () => import('../views/AirplaneCrashList.vue'),
		meta: { requiresAuth: true, authorize: [UserRoles.AIRPLANE_CRASH_EDITOR] },
	},
	{
		path: 'view/:crashID',
		name: 'airplaneView',
		component: () => import('../views/AirplaneCrashForm'),
		props: (route) => {
			return { action: 'view', ...route.params };
		},
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.AIRPLANE_CRASH_EDITOR],
		},
	},
	{
		path: 'edit/:crashID',
		name: 'airplaneEditView',
		component: () => import('../views/AirplaneCrashForm'),
		//Setting props as a function gives use the best of both worlds
		//we can use route params to get the crash ID
		//and we can set an action.  This allows us to set different security
		//different actions at the route level
		props: (route) => {
			return { action: 'edit', ...route.params };
		},
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.AIRPLANE_CRASH_EDITOR],
		},
	},
	{
		path: 'new',
		name: 'airplaneAddView',
		component: () => import('../views/AirplaneCrashForm'),
		props: { action: 'new' },
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.AIRPLANE_CRASH_EDITOR],
		},
	},
];

export default routes;
