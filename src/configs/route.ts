export const ROUTE = {
  HOME: "/",
  CREATE: "/create",
  LEARN: "/learn",
  ONION: "/onion",
  GYM: "/gym",
  USER: (username: string) => `/u/${username}`,
  PROFILE: `/profile`,
  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
  },
};
