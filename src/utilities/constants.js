const applicationDetails = {
  name: "Lake Country Games",
  shortName: "LCG",
  description: "Gamified Shopping Experience",
  links: {
    discord: "https://discord.gg/FZ5qF2dnrV",
    twitter: "https://x.com/ChadMasterr",
  },
  contact: {
    email: "support@lcgames.com",
  },
  copywrite: "Copyright © Lake Country Games 2024",
};

const volume = 0.15;

const API = {
  capabilites: {
    userManagement: process.env.REACT_APP_API_ENDPOINT,
  },
  routes: {
    user: "/api/user",
  },
  baseRoute: "/user.",
  endpoints: {
    getUser: "getUser",
    createUser: "createUser",
    getAllUsers: "getAllUsers",
    updateUser: "updateUser",
    updateUsername: "updateUsername",
    promoteUser: "promoteUser",
    demoteUser: "demoteUser",
  },
};

const HTTP = {
  CONTENT_TYPE: "content-type",
  APP_JSON: "application/json",
  AUTH_HEADER: process.env.REACT_APP_AUTHORIZATION_HEADER_NAME,
  X_AMZ_TRACE_ID_HEADER: process.env.REACT_APP_X_AMZ_TRACE_ID,
  X_B3_SPANID_ID_HEADER: process.env.REACT_APP_X_B3_SPANID_ID,
  X_B3_TRACEID_HEADER: process.env.REACT_APP_X_B3_TRACE_ID,
};

export { applicationDetails, API, HTTP, volume };
