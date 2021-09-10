/** Match stylesheet link and get URL of stylesheet from HTML. */
export const STYLESHEET_LINK_REGEXP = /<link\s+[^>]*href="([^"]+\.css)"[^>]*>/g;

/** Match script link (src) and get URL of script from HTML */
export const SCRIPTS_LINK_REGEXP = /<script\s+[^>]*src="([^"]+\.js)"[^>]*>/g;
