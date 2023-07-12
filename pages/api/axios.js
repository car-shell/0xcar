import axios from 'axios'

const apiAxios = axios.create({
  baseURL: 'https://api-testnet.bscscan.com/api',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// apiAxios.interceptors.request.use(
//     config => {
//       var currentUser = localStorage.getItem('currentUser')
//       const {token} = JSON.parse(currentUser) || {}
//       if (token) {
//         config.headers['Authorization'] = 'Bearer ' + token;
//       }
//       return config;
//     },
//     error => {
//       return Promise.reject(error);
//     }
// )

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

export const getUrl = (params = {}) => {
    return apiAxios.get('/', params);
};

export const remove = (url, params = {}) => {
    return axios.delete(url, params);
};

export const put = (url, params = {}) => {
    return axios.put(url, params);
};

export default apiAxios;
