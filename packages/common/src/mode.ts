/** Checks if we are in production environment. */
export const isProduction = () => process.env.NODE_ENV === 'production';
