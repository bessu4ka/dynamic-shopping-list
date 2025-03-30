// constants
import { BASE_URL } from '../constants/env';
// utils
import axios from 'axios';

export const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});
