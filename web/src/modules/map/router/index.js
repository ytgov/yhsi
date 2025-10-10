
import Maps from "../views/Maps.vue";

export default [
    {
        path: "/maps",
        name: "Maps",
        component: Maps,
        meta: { requiresAuth: true },
    }
];
