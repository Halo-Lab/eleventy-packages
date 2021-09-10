/** Match stylesheet link and get URL of file from HTML. */
export const STYLESHEET_LINK_REGEXP =
  /<link\s+[^>]*href="([^"]+\.(?:css|scss|sass))"[^>]*>/g;

