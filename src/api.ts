import axios from "axios";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000" });