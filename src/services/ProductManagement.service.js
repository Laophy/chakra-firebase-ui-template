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

export async function getAllProducts() {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.product.getProducts);
  try {
    let response = await axios.get(
      API.capabilites.userManagement +
        API.routes.product +
        API.productBaseRoute +
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

export async function getProductById(productId) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(
    API.endpoints.product.getProductById + productId
  );
  try {
    let response = await axios.get(
      API.capabilites.userManagement +
        API.routes.product +
        API.productBaseRoute +
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

export async function createProduct(authHeader, product) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.product.createProduct);
  try {
    let response = await axios.post(
      API.capabilites.userManagement +
        API.routes.product +
        API.productBaseRoute +
        obfuscatedEndpoint,
      {
        product,
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

export async function updateProduct(authHeader, product) {
  const refId = ReferenceId();
  const obfuscatedEndpoint = btoa(API.endpoints.product.updateProduct);
  try {
    let response = await axios.put(
      API.capabilites.userManagement +
        API.routes.product +
        API.productBaseRoute +
        obfuscatedEndpoint,
      {
        product,
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
