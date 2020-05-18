import { useKeycloak } from '@react-keycloak/web';

const Logout = () => {
  const [keycloak] = useKeycloak();
  keycloak.logout({
    redirectUri: window.location.origin.toString(),
  });
  return null;
};

export default Logout;
