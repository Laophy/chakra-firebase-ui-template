import _get from "lodash/get";
import CryptoJS from "crypto-js";

let dataErrorStringList = [];

let successStatusCodes = [200];

const ENCRYPTION_KEY = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"; // Must be 256 bits (32 characters)

// Helper function to decrypt data
const decrypt = (text) => {
  try {
    let textParts = text.split(":");
    let iv = CryptoJS.enc.Hex.parse(textParts.shift());
    let encryptedText = CryptoJS.enc.Hex.parse(textParts.join(":"));
    let decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedText },
      CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY),
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return null;
  }
};

export async function handleResponse(response) {
  try {
    const responseData = _get(response, "data", {});
    const statusCode = _get(responseData, "request.status", 500);
    const encryptedDataResponse = _get(responseData, "result.data.json", {});

    // Decrypt data if available
    let decryptedData = null;
    if (encryptedDataResponse) {
      try {
        decryptedData = JSON.parse(decrypt(encryptedDataResponse));
      } catch (decryptError) {
        console.warn("Failed to decrypt data:", decryptError);
      }
    }

    // Check if status code indicates success
    if (successStatusCodes.includes(statusCode)) {
      return [decryptedData, null];
    } else {
      // Handle error cases
      const errorMessage =
        _get(responseData, "message") || getDefaultErrorMessage(statusCode);

      const errorObject = {
        type: "error",
        code: statusCode,
        message: errorMessage,
        details: [],
      };

      // Add request message if available
      const requestMessage = _get(responseData, "request.message");
      if (requestMessage) {
        errorObject.details.push({
          type: "request",
          message: requestMessage,
        });
      }

      // Add any additional errors from the response
      const additionalErrors = _get(responseData, "request.errors", []);
      additionalErrors.forEach((error) => {
        errorObject.details.push({
          type: "additional",
          ...error,
        });
      });

      return [null, [errorObject]];
    }
  } catch (e) {
    console.warn("Error in handleResponse:", e);
    return [
      null,
      [
        {
          type: "internal",
          code: 500,
          message:
            "An unexpected error occurred while processing the response.",
          details: [],
        },
      ],
    ];
  }
}

// Helper function to get a default error message based on status code
function getDefaultErrorMessage(statusCode) {
  switch (statusCode) {
    case 400:
      return "Bad request. Please check your input.";
    case 401:
      return "Unauthorized. Please log in and try again.";
    case 403:
      return "Forbidden. You don't have permission to access this resource.";
    case 404:
      return "Not found. The requested resource doesn't exist.";
    case 500:
      return "Internal server error. Please try again later.";
    default:
      return `An error occurred (Status code: ${statusCode})`;
  }
}

// const findErrors = (response) => {
//   try {
//     const statusCode = checkStatusCode(response);

//     const errorCodesFromData = checkData(response);

//     const errorCodesFromErrors = checkForErrors(response);

//     return buildErrorCodeList(
//       statusCode,
//       errorCodesFromData,
//       errorCodesFromErrors
//     );
//   } catch (e) {
//     console.warn(e);
//   }
// };
