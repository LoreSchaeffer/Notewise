import axios from "axios";
import {Env} from "../Env.ts";

export const axiosPrivate = axios.create({
    baseURL: Env.API_BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});