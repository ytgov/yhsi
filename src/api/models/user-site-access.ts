export interface UserSiteAccess {
	id: number;
	user_id: number;
	access_type_id: number;
	access_text: string | number;

	access_type_name?: string;
	access_text_name?: string;
}
