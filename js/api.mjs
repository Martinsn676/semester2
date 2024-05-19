import { lsList } from "./lsList.mjs";

export const api = {
  baseUrl: "https://v2.api.noroff.dev",
  endProfiles: "/auction/profiles",
  endListings: "/auction/listings",
  endListingSearch: "/auction/listings/search?q=",
  endRegister: "/auth/register",
  endLogin: "/auth/login",
  endApiKey: "/auth/create-api-key",
  get: "GET",
  post: "POST",
  put: "PUT",
  del: "DELETE",
  /**
   * Make any apicall
   * @param {variable} endPoint Choose an endpoint
   * @param {array} endUrl Optional, add an endurl
   * @param {variable} method Choose a method to be used
   * @param {object} body The content of the call
   */
  async makeCall(endPoint, method, security = 0, body = false, endUrl = false) {
    try {
      let endApi = this.baseUrl + endPoint;

      if (Array.isArray(endUrl)) {
        endApi += endPoint.includes("?") ? "&" : "?";
        endApi += this.buildEndUrl(endUrl, endPoint);
      }

      const fetchBody = {
        method: method,
      };
      if (security == 0) {
        fetchBody.headers = {
          "Content-Type": "application/json",
        };
      }
      if (security == 1) {
        const userData = await lsList.get("userData");
        fetchBody.headers = { Authorization: `Bearer ${userData.accessToken}` };
      }
      if (security == 2) {
        const userData = await lsList.get("userData");
        const apiKey = await lsList.get("apiKey");
        fetchBody.headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.accessToken}`,
          "X-Noroff-API-Key": apiKey,
        };
      }
      if (body) {
        fetchBody.body = JSON.stringify(body);
      }
      const response = await this.fetchApi(endApi, fetchBody);

      const json = await response.json();
      if (json.statusCode == 401 && security > 0) {
        alert(
          "You are not allowed to do this, you are being signed out. Please log in again"
        );
        window.location.href = "../index.html";
        return;
      }

      if (!json.data) {
      }
      if (json.data) {
        return { data: json.data, status: response.status };
      } else {
        return { data: json.errors, status: response.status };
      }
    } catch (error) {
      console.warn(error);
    }
  },
  /**
   * Fetch the api
   * @param {string} url created in call()
   * @param {object} postData created in call()
   * @returns response
   */
  async fetchApi(url, postData) {
    try {
      const response = await fetch(url, postData);
      return response;
    } catch (error) {
      console.error("Error occurred:", error);
      return null; // or throw error if needed
    }
  },
  buildEndUrl(endUrl, endPoint) {
    let url = "";
    endUrl.forEach((element, index) => {
      if (index != 0) {
        url += "&";
      }
      url += element;
    });
    return url;
  },
};
