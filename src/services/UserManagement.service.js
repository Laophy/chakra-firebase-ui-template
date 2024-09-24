import axios from "axios";
import { ReferenceId } from "../utilities/ReferenceId";
import { handleResponse } from "../utilities/ResponseHandler";
import { API, HTTP } from "../utilities/constants";

const {
  CONTENT_TYPE,
  APP_JSON,
  AUTH_HEADER,
  X_AMZ_TRACE_ID_HEADER,
  X_B3_SPANID_ID_HEADER,
  X_B3_TRACEID_HEADER,
} = HTTP;

export async function getUserByFirebaseAuth(user) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.getUser);
  try {
    let response = await axios.post(
      API.capabilites.userManagement +
        API.routes.user +
        API.baseRoute +
        obfuscatedEndpoint,
      { params: { user } },
      {
        headers: {
          [CONTENT_TYPE]: APP_JSON,
          [AUTH_HEADER]: AUTH_HEADER,
          [X_AMZ_TRACE_ID_HEADER]: refId,
          [X_B3_SPANID_ID_HEADER]: refId,
          [X_B3_TRACEID_HEADER]: refId,
        },
      }
    );

    return await handleResponse(response, AUTH_HEADER, refId);
  } catch (e) {
    console.log("request failed??: ", e.response);
    return await handleResponse(e.response, AUTH_HEADER, refId);
  }
}

export async function createNewUser(user) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.createUser);
  try {
    let response = await axios.post(
      API.capabilites.userManagement +
        API.routes.user +
        API.baseRoute +
        obfuscatedEndpoint,
      { params: { user } },
      {
        headers: {
          [CONTENT_TYPE]: APP_JSON,
          [AUTH_HEADER]: AUTH_HEADER,
          [X_AMZ_TRACE_ID_HEADER]: refId,
          [X_B3_SPANID_ID_HEADER]: refId,
          [X_B3_TRACEID_HEADER]: refId,
        },
      }
    );

    return await handleResponse(response, AUTH_HEADER, refId);
  } catch (e) {
    console.log("request failed??: ", e.response);
    return await handleResponse(e.response, AUTH_HEADER, refId);
  }
}

export async function getAllUserData() {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.getAllUsers);
  try {
    let response = await axios.post(
      API.capabilites.userManagement +
        API.routes.user +
        API.baseRoute +
        obfuscatedEndpoint,
      {
        headers: {
          [CONTENT_TYPE]: APP_JSON,
          [AUTH_HEADER]: AUTH_HEADER,
          [X_AMZ_TRACE_ID_HEADER]: refId,
          [X_B3_SPANID_ID_HEADER]: refId,
          [X_B3_TRACEID_HEADER]: refId,
        },
      }
    );

    return await handleResponse(response, AUTH_HEADER, refId);
  } catch (e) {
    console.log("request failed??: ", e.response);
    return await handleResponse(e.response, AUTH_HEADER, refId);
  }
}

export async function updateUsername(authHeader, newUsernameAndPhotoURL) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.updateUsername);
  try {
    let response = await axios.post(
      API.capabilites.userManagement +
        API.routes.user +
        API.baseRoute +
        obfuscatedEndpoint,
      {
        params: { newUsernameAndPhotoURL },
      },
      {
        headers: {
          [CONTENT_TYPE]: APP_JSON,
          [AUTH_HEADER]: authHeader,
          [X_AMZ_TRACE_ID_HEADER]: refId,
          [X_B3_SPANID_ID_HEADER]: refId,
          [X_B3_TRACEID_HEADER]: refId,
        },
      }
    );

    return await handleResponse(response, AUTH_HEADER, refId);
  } catch (e) {
    console.log("request failed??: ", e.response);
    return await handleResponse(e.response, AUTH_HEADER, refId);
  }
}

export async function onPromoteUserToStaff(authHeader, promotedPlayersUUID) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.promoteUser);
  try {
    let response = await axios.post(
      API.capabilites.userManagement +
        API.routes.user +
        API.baseRoute +
        obfuscatedEndpoint,
      {
        params: { promotedPlayersUUID },
      },
      {
        headers: {
          [CONTENT_TYPE]: APP_JSON,
          [AUTH_HEADER]: authHeader,
          [X_AMZ_TRACE_ID_HEADER]: refId,
          [X_B3_SPANID_ID_HEADER]: refId,
          [X_B3_TRACEID_HEADER]: refId,
        },
      }
    );

    return await handleResponse(response, AUTH_HEADER, refId);
  } catch (e) {
    console.log("request failed??: ", e.response);
    return await handleResponse(e.response, AUTH_HEADER, refId);
  }
}

export async function onDemoteStaffToPlayer(
  authHeader,
  user,
  demotedPlayersUUID
) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.demoteUser);
  try {
    let response = await axios.post(
      API.capabilites.userManagement +
        API.routes.user +
        API.baseRoute +
        obfuscatedEndpoint,
      {
        params: { user, demotedPlayersUUID },
      },
      {
        headers: {
          [CONTENT_TYPE]: APP_JSON,
          [AUTH_HEADER]: authHeader,
          [X_AMZ_TRACE_ID_HEADER]: refId,
          [X_B3_SPANID_ID_HEADER]: refId,
          [X_B3_TRACEID_HEADER]: refId,
        },
      }
    );

    return await handleResponse(response, AUTH_HEADER, refId);
  } catch (e) {
    console.log("request failed??: ", e.response);
    return await handleResponse(e.response, AUTH_HEADER, refId);
  }
}

export async function updateUser(authHeader, user, uid, newUserData) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.updateUser);
  try {
    let response = await axios.post(
      API.capabilites.userManagement +
        API.routes.user +
        API.baseRoute +
        obfuscatedEndpoint,
      {
        params: { user, uid, newUserData },
      },
      {
        headers: {
          [CONTENT_TYPE]: APP_JSON,
          [AUTH_HEADER]: authHeader,
          [X_AMZ_TRACE_ID_HEADER]: refId,
          [X_B3_SPANID_ID_HEADER]: refId,
          [X_B3_TRACEID_HEADER]: refId,
        },
      }
    );

    return await handleResponse(response, AUTH_HEADER, refId);
  } catch (e) {
    console.log("request failed??: ", e.response);
    return await handleResponse(e.response, AUTH_HEADER, refId);
  }
}
