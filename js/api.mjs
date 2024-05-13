import { lsList } from "./lsList.mjs";

export const api = {
  baseUrl: "https://v2.api.noroff.dev",
  endProfiles: "/auction/profiles",
  endListings: "/auction/listings",
  endRegister: "/auth/register",
  endLogin: "/auth/login",
  endApiKey: "/auth/create-api-key",
  listingExtras: ["_seller", "_bids"],
  get: "GET",
  post: "POST",
  put: "PUT",
  /**
   * Make any apicall
   * @param {variable} endpoint Choose an endpoint
   * @param {array} endUrl Optional, add an endurl
   * @param {variable} method Choose a method to be used
   * @param {object} body The content of the call
   */
  async makeCall(endpoint, method, security = 0, body = false, endUrl = false) {
    let endApi = endUrl ? endUrl : "";
    if (Array.isArray(endUrl)) {
      endApi = this.buildEndUrl(endUrl);
    }
    console.log("endpoint", endpoint);

    const fetchBody = {
      method: method,
    };
    if (security == 0) {
      fetchBody.headers = {
        "Content-Type": "application/json",
      };
    }
    if (security == 1) {
      const accessToken = await lsList.get("accessToken");
      fetchBody.headers = { Authorization: `Bearer ${accessToken}` };
    }
    if (security == 2) {
      const accessToken = await lsList.get("accessToken");
      const apiKey = await lsList.get("apiKey");
      fetchBody.headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      };
    }
    if (body) {
      fetchBody.body = JSON.stringify(body);
    }
    const response = await this.fetchApi(
      this.baseUrl + endpoint + endApi,
      fetchBody
    );
    const json = await response.json();
    if (json.statusCode == 401) {
      alert(
        "You are not allowed to do this, you are being signed out. Please log in again"
      );
      window.location.href = "../index.html";
      return;
    }
    console.log(json, response.status);
    if (json.data) {
      return { data: json.data, status: response.status };
    } else {
      return false;
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
      console.log("Fetching:", url, postData);
      const response = await fetch(url, postData);
      return response;
    } catch (error) {
      console.error("Error occurred:", error);
      return null; // or throw error if needed
    }
  },
  buildEndUrl(endUrl) {
    let url = "";
    endUrl.forEach((element, index) => {
      console.log("element", element);
      if (index === 0) {
        url += "?";
      } else {
        url += "&";
      }
      if (element.startsWith("_")) {
        url += element + "=true";
      } else {
        url += element;
      }
    });
    return url;
  },
};
