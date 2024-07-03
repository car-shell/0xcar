import axios from 'axios'

const apiAxios = axios.create({
  baseURL: 'https://testnet.api.0xcardinal.io/api/v1',
  // baseURL: "http://localhost:31500/api/v1",
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

apiAxios.interceptors.request.use(
    config => {
      console.log(`-------------`)
      let address = sessionStorage.getItem('cur_address')
      let token = sessionStorage.getItem(`cur_token_${address}`)
      console.log(`token:${token}`)
      if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
)

// apiAxios.interceptors.response.use(
//     resp => {
//         if(resp.data.code == '18001003'){
//             localStorage.removeItem('currentUser');
//             localStorage.removeItem('accountRS');
//             localStorage.removeItem('account');
//             window.location.href='/login';
//         }
//         return resp;
//     },
//     error => {
//         return Promise.reject(error);
//     }
// )

apiAxios.interceptors.response.use(
    resp => {
      return resp;
    },
    error => {
      return Promise.reject(error);
    }
)

export const getUrl = (url, params = {}) => {
    return apiAxios.get(url, params);
};

export const remove = (url, params = {}) => {
    return apiAxios.delete(url, params);
};

export const put = (url, params = {}) => {
    return apiAxios.put(url, params);
};

export const post = (url, params = {}) => {
  return apiAxios.post(url, params);
};

export default apiAxios;
