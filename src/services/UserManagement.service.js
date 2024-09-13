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

export async function getfirebaseUser(user) {
  const refId = ReferenceId();
  try {
    let response = await axios.post(
      API.capabilites.userManagement + API.paths.getUser,
      {
        headers: {
          [CONTENT_TYPE]: APP_JSON,
          [AUTH_HEADER]: AUTH_HEADER,
          [X_AMZ_TRACE_ID_HEADER]: refId,
          [X_B3_SPANID_ID_HEADER]: refId,
          [X_B3_TRACEID_HEADER]: refId,
        },
        params: { user },
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
  try {
    let response = await axios.post(
      API.capabilites.userManagement + API.paths.getAllUsers,
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

export async function updateUsername(user, username) {
  const refId = ReferenceId();
  try {
    let response = await axios.post(
      API.capabilites.userManagement + API.paths.updateUsername,
      {
        headers: {
          [CONTENT_TYPE]: APP_JSON,
          [AUTH_HEADER]: AUTH_HEADER,
          [X_AMZ_TRACE_ID_HEADER]: refId,
          [X_B3_SPANID_ID_HEADER]: refId,
          [X_B3_TRACEID_HEADER]: refId,
        },
        params: { user, username },
      }
    );

    return await handleResponse(response, AUTH_HEADER, refId);
  } catch (e) {
    console.log("request failed??: ", e.response);
    return await handleResponse(e.response, AUTH_HEADER, refId);
  }
}

export async function updateUser(uid, newUserData) {
  const refId = ReferenceId();
  try {
    let response = await axios.post(
      API.capabilites.userManagement + API.paths.updateUser,
      {
        headers: {
          [CONTENT_TYPE]: APP_JSON,
          [AUTH_HEADER]: AUTH_HEADER,
          [X_AMZ_TRACE_ID_HEADER]: refId,
          [X_B3_SPANID_ID_HEADER]: refId,
          [X_B3_TRACEID_HEADER]: refId,
        },
        params: { uid, newUserData },
      }
    );

    return await handleResponse(response, AUTH_HEADER, refId);
  } catch (e) {
    console.log("request failed??: ", e.response);
    return await handleResponse(e.response, AUTH_HEADER, refId);
  }
}
