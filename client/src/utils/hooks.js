import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { useKeycloak } from '@react-keycloak/web';
import { useCurrentRoute } from 'react-navi';
import Logger from './logger';

export const useAxios = () => {
  const [keycloak, initialized] = useKeycloak();
  const [axiosInstance, setAxiosInstance] = useState({});

  const routeRef = useRef(useCurrentRoute());

  useEffect(() => {
    const instance = axios.create({
      baseURL: '/',
      headers: {
        Authorization: initialized ? `Bearer ${keycloak.token}` : undefined,
      },
    });

    instance.interceptors.response.use((response) => response, async (error) => {
      const message = `${error.response.data.message}`;
      Logger.error({
        token: keycloak.token,
        message,
        path: routeRef.current.url.pathname,
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
