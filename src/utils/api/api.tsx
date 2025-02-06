/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from "axios";

const API_BASE_URL =
  "http://localhost:8000"; //process.env.BASE_URL;
const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: HEADERS,
});

/* export async function getTest(): Promise<unknown> {
  // TODO: Fix the ignored eslint error here
  return api
    .get("/")
    .then((res) => res.data[""])
    .catch((e) => console.error(e));
} */
