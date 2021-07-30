export const applicationName = "Yukon Historic Sites Inventory";
export const applicationIcon = "mdi-cash-register";
export const hasSidebar = true;
export const hasSidebarClosable = false;

export const sections = [
    {
        name: "Home",
        url: "/",
        icon: "mdi-home-account"
    },
    {
        name: "Dashboard",
        url: "/dashboard",
        icon: "mdi-view-dashboard"
    },
    {
        name: "YHSI Sites",
        url: "/sites",
        icon: "mdi-home-city"
    },
    {
        name: "Photos",
        url: "/photos",
        icon: "mdi-wallpaper"
    },
    {
        name: "Maps",
        url: "/maps",
        icon: "mdi-map"
    },
];
export const environment = process.env.NODE_ENV;
export const apiBaseUrl = process.env.NODE_ENV == "production" ? "" : "http://localhost:3000";
