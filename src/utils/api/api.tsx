import axios from 'axios';
import { Interface } from 'readline';

// const API_BASE_URL = "http://localhost:8080/api/v1"; //process.env.BASE_URL;
//const API_BASE_URL = process.env.BASE_URL;
const API_BASE_URL = 'jajaj.no';
const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: HEADERS
});

export class BaseApi<T> {
  prefixUrl: string;
  constructor(prefix: string) {
    this.prefixUrl = prefix;
  }
  getAll(): Promise<any> {
    console.log('Getting this url:');
    console.log(API_BASE_URL + this.prefixUrl);
    return api.get(this.prefixUrl);
  }
  getById(id: number): Promise<any> {
    return api.get(this.prefixUrl + id);
  }
  update(object: T): Promise<any> {
    return api.put(this.prefixUrl, object);
  }
  create(object: T): Promise<any> {
    return api.post(this.prefixUrl, object);
  }
}
