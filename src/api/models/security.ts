
export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    create_date: Date;
    expire_date?: Date;
    last_login_date?: Date;
    status: string;
    roles:string;

    expire_date_display?: string;
    last_login_date_display?: string;
    role_list?: string[];
    site_access?: UserSiteAccess[];
}

export interface SiteAccesType {
    id: number;
    name: string;
}

export interface UserSiteAccess {
    id: number;
    user_id: number;
    access_type_id: number;
    access_text: string | number;

    access_type_name?: string;
    access_text_name?: string;
}
