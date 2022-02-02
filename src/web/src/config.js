export const applicationName = "Yukon Historic Sites";
export const applicationIcon = "mdi-cash-register";
export const hasSidebar = true;
export const hasSidebarClosable = false;

export const sections = [
    {
        name: "Summary",
        icon: "mdi-note-text-outline",
        makeUrl: function (id) {
            return `/sites/${id}/summary`
        }
    },
    {
        name: "Location",
        icon: "mdi-map-check",
        makeUrl: (id) => { return `/sites/${id}/location` }
    },
    {
        name: "Dates & Condition",
        icon: "mdi-calendar-range",
        makeUrl: function (id) { return `/sites/${id}/dates_&_condition` }
    },
    {
        name: "Themes & Function",
        icon: "mdi-shape",
        makeUrl: (id) => { return `/sites/${id}/themes_&_function` }
    },
    {
        name: "Associations",
        icon: "mdi-account-group",
        makeUrl: (id) => { return `/sites/${id}/associations` }
    },
    {
        name: "Legal & Zoning",
        icon: "mdi-script-text-outline",
        makeUrl: function (id) { return `/sites/${id}/legal_&_zoning` }
    },
    {
        name: "Photos",
        icon: "mdi-image",
        makeUrl: (id) => { return `/sites/${id}/photos` }
    },
    {
        name: "Management",
        icon: "mdi-hammer-wrench",
        makeUrl: (id) => { return `/sites/${id}/management` }
    },
    {
        name: "Description",
        icon: "mdi-alphabetical",
        makeUrl: (id) => { return `/sites/${id}/description` }
    },    
];
export const environment = process.env.NODE_ENV;
export const apiBaseUrl = process.env.NODE_ENV == "production" ? "" : "http://localhost:3000";
