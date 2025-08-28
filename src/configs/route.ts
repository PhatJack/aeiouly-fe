export const ROUTE = {
  HOME: "/",
  TOPIC: "/topic",
  LEARN: "/learn",
  ONION: "/onion",
  GYM: "/gym",
	NEWS: "/news",
  USER: (username: string) => `/u/${username}`,
  PROFILE: `/profile`,
  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
  },
};
