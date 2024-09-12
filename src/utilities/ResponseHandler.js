export async function handleResponse(response, authHeader, refId) {
  try {
    return [response, null];
  } catch (e) {
    console.warn(e);
  }
}
