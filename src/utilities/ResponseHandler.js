import _get from "lodash/get";

let dataErrorStringList = [];

let successStatusCodes = [200];

export async function handleResponse(response, authHeader, refId) {
  try {
    // Check for error codes
    //const errorCodeList = findErrors(response);

    // Format response so all responses are understood the same within the application

    // Return a response or some sort of valid alert we can display via 2nd param [null, errorResponse]

    console.log(response);
    const parsedResponse = _get(response, "data.result.data.json", {});
    console.log(parsedResponse);

    if (response.data.request.status === 400) {
      return [null, parsedResponse];
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
