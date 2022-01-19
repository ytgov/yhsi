namespace Express {
	export interface Request {
		user?: any;
		//isAuthenticated?: boolean;
		sessionId?: string;
		file: any;
		session: any;
		oidc: any;

		isAuthenticated(): boolean;
	}
}
x;
