import _get from "lodash/get";
import CryptoJS from "crypto-js";

let dataErrorStringList = [];

let successStatusCodes = [200];

const ENCRYPTION_KEY = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"; // Must be 256 bits (32 characters)

// Helper function to decrypt data
const decrypt = (text) => {
  let textParts = text.split(":");
  let iv = CryptoJS.enc.Hex.parse(textParts.shift());
  let encryptedText = CryptoJS.enc.Hex.parse(textParts.join(":"));
  let decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encryptedText },
    CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY),
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
};

export async function handleResponse(response, authHeader, refId) {
  try {
    // Check for error codes
    //const errorCodeList = findErrors(response);

    // Format response so all responses are understood the same within the application

    // Return a response or some sort of valid alert we can display via 2nd param [null, errorResponse]

    //console.log(response);
    //console.log(parsedResponse);

    const decryptedData = JSON.parse(decrypt(response.data.data));

    //console.log(decryptedData);

    const parsedResponse = _get(decryptedData, "result.data.json", {});

    //console.log(parsedResponse);

    if (decryptedData.request.status === 400) {
      return [
        null,
        {
          request: decryptedData.request,
          message: decryptedData.message,
        },
      ];
    } else {
      return [parsedResponse, null];
    }
  } catch (e) {
    console.warn(e);
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
