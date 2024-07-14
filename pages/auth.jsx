import { useAuth0 } from "@auth0/auth0-react";

export default function Auth({protected: isProtectedPage, children}) {
  const {isAuthenticated, loginWithRedirect, isLoading} = useAuth0();

  if (isLoading) {
    return <div>{'Auth is Loading...'}</div>;
  }

  if (isProtectedPage && !isAuthenticated) {
    console.log('redirecting to login');
    loginWithRedirect();
    return null;
  }

  return children;
}
