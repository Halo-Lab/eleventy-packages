/** Match script link (src) and get URL of script from HTML */
export const SCRIPTS_LINK_REGEXP =
	/<script\s+[^>]*src="([^"]+\.(?:js|ts))"[^>]*>/g;
