import {
  useState, useEffect, useRef, useContext,
} from 'react';
import axios from 'axios';

import { useKeycloak } from '@react-keycloak/web';
import { useCurrentRoute } from 'react-navi';
import Logger from './logger';
import { AlertContext } from './AlertContext';

export const useAxios = () => {
  const [keycloak, initialized] = useKeycloak();
  const [axiosInstance, setAxiosInstance] = useState({});
  const { setAlertContext } = useContext(AlertContext);

  const routeRef = useRef(useCurrentRoute());
  const setAlertRef = useRef(setAlertContext);
  useEffect(() => {
    const instance = axios.create({
      baseURL: '/',
      headers: {
        Authorization: initialized ? `Bearer ${keycloak.token}` : undefined,
      },
    });

    instance.interceptors.response.use((response) => response, async (error) => {
      Logger.error({
        token: keycloak.token,
        message: error.response.data,
        path: routeRef.current.url.pathname,
      });

      setAlertRef.current({
        type: 'api-error',
        errors: [{
          status: error.response.status,
          message: error.message,
          path: error.response.config.url,
        }],
      });

      return Promise.reject(error);
    });

    setAxiosInstance({ instance });

    return () => {
      setAxiosInstance({});
    };
  }, [initialized, keycloak.token]);

  return axiosInstance.instance;
};

export const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};

export default useIsMounted;
