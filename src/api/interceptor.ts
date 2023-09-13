import axios, { AxiosRequestConfig, AxiosResponse }  from 'axios';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { returnFormData } from './library';
// import { useRouter } from 'vue-router';
// import { getToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  state: any;
  message?: string|any;
  data?: T|string|any;
}



// const {CancelToken} = axios;
axios.defaults.baseURL = import.meta.env.MODE === "development"
                ? `${ window.location.origin}/yqb/`
                : `${ window.location.origin 
                  }/${ 
                  window.location.pathname.split("/")[1] 
                  }/`;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // console.log(config);
    if(config.method === 'post') {
        if(config.headers) {
            const type = config.headers['Content-Type'];
            // console.log(config.headers);
            if(type !== 'application/json') {
                (config.data = returnFormData(config.data));
            }
        }
        // if(config.data) {
        //     config.data = returnFormData(config.data);
        // }
    }
    // const token = getToken();
    // if (token) {
    //   if (!config.headers) {
    //     config.headers = {};
    //   }
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    // do something
    console.log(error);
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    // console.log(res.state);
    // console.log(response);
    // console.log(response.config);
    // eslint-disable-next-line no-new
    // new CancelToken((c: any) => {
    //         console.log(c);
    //     })
    // console.log(CancelToken.source().token);
    if (response.status !== 200) {
        Message.error({
            id: 'request error',
            content: res.message || 'Error',
            duration: 5 * 1000,
        });
        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        //   if (
        //     [50008, 50012, 50014].includes(res.code) &&
        //     response.config.url !== '/api/user/info'
        //   ) {
        //     Modal.error({
        //       title: 'Confirm logout',
        //       content:
        //         'You have been logged out, you can cancel to stay on this page, or log in again',
        //       okText: 'Re-Login',
        //       async onOk() {
        //         const userStore = useUserStore();

        //         await userStore.logout();
        //         window.location.reload();
        //       },
        //     });
        //   }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    // console.log(res.state >= 0 );
    if (res.state >= 0 && res?.state !== 1) {
        if (typeof(res.message) === 'string' && res.message.indexOf('登录过期') >= 0) {
            const userStore = useUserStore();
            userStore.logout();
            // debugger;
            // const router = useRouter();
            // console.log('登录过期----',router.currentRoute.value);
        }
        Message.error({
            id: 'request error',
            content: res?.message || 'request Error',
            duration: 5 * 1000,
        });
        return Promise.reject(new Error(res?.message || 'Error'));
    }
    return res;
  },
  (error) => {
    console.log(error.message);
    Message.error({
        id: 'network error',
        content: error.msg || '系统异常，请联系管理员',
        duration: 5 * 1000,
    });
    console.log(error);
    return Promise.reject(error);
  }
);
