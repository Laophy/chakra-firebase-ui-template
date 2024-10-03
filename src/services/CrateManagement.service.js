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

export async function getAllCrates() {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.crate.getCrates);
  try {
    let response = await axios.get(
      API.capabilites.userManagement +
        API.routes.crate +
        API.crateBaseRoute +
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

export async function getCrateById(crateId) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.crate.getCrateById + crateId);
  try {
    let response = await axios.get(
      API.capabilites.userManagement +
        API.routes.crate +
        API.crateBaseRoute +
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

export async function createCrate(authHeader, crate) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.crate.createCrate);
  try {
    let response = await axios.post(
      API.capabilites.userManagement +
        API.routes.crate +
        API.crateBaseRoute +
        obfuscatedEndpoint,
      {
        crate,
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

export async function updateCrate(authHeader, crate) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.crate.updateCrate);
  try {
    let response = await axios.put(
      API.capabilites.userManagement +
        API.routes.crate +
        API.crateBaseRoute +
        obfuscatedEndpoint,
      {
        crate,
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

export async function deleteCrateById(authHeader, crateId) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.crate.deleteCrate + crateId);
  try {
    let response = await axios.delete(
      API.capabilites.userManagement +
        API.routes.crate +
        API.crateBaseRoute +
        obfuscatedEndpoint,
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
