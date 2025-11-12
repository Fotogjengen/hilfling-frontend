/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from "axios";

//API_BASE_URL sier hvor API'et ligger. HEADERS definerer standard headers for alle kall til API'et.
const API_BASE_URL = "http://localhost:8000";
const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

//Axios er rammeverket vi bruker for å gjøre API kall. Her lager vi en instans av axios med baseURL og headers satt til det vi definerte over.
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: HEADERS,
});
