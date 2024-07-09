import axios from 'axios';

export default (baseUrl: string, headers = { 'Content-Type': 'application/json' }) => {

  return axios.create({
    baseURL: baseUrl,
    headers,
  });
}
