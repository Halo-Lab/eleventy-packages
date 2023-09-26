/** Match stylesheet link and get URL of file from HTML. */
export const STYLESHEET_LINK_REGEXP =
	/<link\s+[^>]*href=(?:'|")([^"]+\.(?:css|scss|sass|less))(?:'|")[^>]*>/g;

export const STYLESHEET_LINK_WITH_HASH_REGEXP =
	/<link\s+[^>]*href=(?:'|")([^"]+\.(?:css|scss|sass|less)(?:\?\w*)?)(?:'|")[^>]*>/g;

export const CLEAR_STYLE_LINK_REGEXP =
	/(.+?\.(?:css|scss|sass|less))\?[a-zA-Z0-9]+/;
