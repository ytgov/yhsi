import { UserRoles } from '@/authorization';
const routes = [
	{
		path: '',
		name: 'airplane',
		component: () => import('../views/AirplaneCrashList.vue'),
		meta: { requiresAuth: true, authorize: [UserRoles.AIRPLANE_CRASH_EDITOR] },
	},
	{
		path: '/view/:name',
		name: 'airplaneView',
		component: () => import('../views/AirplaneCrashForm'),
		props: { action: 'view' },
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.AIRPLANE_CRASH_EDITOR],
		},
	},
	{
		path: '/edit/:name',
		name: 'airplaneEditView',
		component: () => import('../views/AirplaneCrashForm'),
		props: { action: 'edit' },
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.AIRPLANE_CRASH_EDITOR],
		},
	},
	{
		path: '/new',
		name: () => import('../views/AirplaneCrashForm'),
		props: { action: 'new' },
		meta: {
			requiresAuth: true,
			authorize: [UserRoles.AIRPLANE_CRASH_EDITOR],
		},
	},
];

export default routes;
