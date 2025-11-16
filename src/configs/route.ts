export const ROUTE = {
  HOME: '/',
  APP: '/app',
  TOPIC: '/topic',
  LEARN: '/learn',
  ONION: '/onion',
  GYM: '/gym',
  READING: '/reading',
  VOCABULARY: '/vocabulary',
  SPACE: '/solo',
  USER: (username: string) => `/u/${username}`,
  ADMIN: {
    INDEX: '/admin',
    USER_MANAGEMENT: '/admin/users',
    POST_MANAGEMENT: '/admin/posts',
    LISTENING_SESSION_MANAGEMENT: '/admin/listening-tests',
    SOLO_SPACE_MANAGEMENT: {
      INDEX: '/admin/spaces',
      SOUNDS: {
        INDEX: '/admin/spaces',
        EDIT: (id: string | number) => `/admin/spaces/sounds/${id}`,
      },
      BACKGROUND_VIDEOS: {
        INDEX: '/admin/spaces',
        EDIT: (id: string | number) => `/admin/spaces/videos/${id}`,
      },
      VIDEO_TYPES: {
        INDEX: '/admin/spaces',
        EDIT: (id: string | number) => `/admin/spaces/types/${id}`,
      },
    },
  },
  SETTING: {
    INDEX: '/settings',
    CHANGE_PASSWORD: '/settings/change-password',
    POLICY: '/settings/policy',
    TERMS: '/settings/terms',
    CONTACT: '/settings/contact',
    DELETE_ACCOUNT: '/settings/delete-account',
  },
  PROFILE: `/profile`,
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
};
