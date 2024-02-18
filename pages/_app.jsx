import '../styles/globals.css';
import Head from 'next/head';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Layout from '../components/Layout';
import { CookiesProvider, useCookies } from "react-cookie";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import axios from 'axios';
import { useRouter } from 'next/router';
import { UserContext } from '../components/UserContext';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const router = useRouter();

  const theme = createTheme({
    palette: {
      primary: {
        main: blue[700],
        bg: blue[100]
      }
    }
  });

  const currentUser = { loggedIn: false };
  const [user, setUser] = useState(); // maybe set this based on user cookie

  useEffect(() => {
    if (!user && pageProps.page !== 'login') {

      console.log('checking user');
      // get current user from server
      axios.get(process.env.NEXT_PUBLIC_serverDomain + '/users/me', {
        withCredentials: true,
      })
        .then(res => {
          const { loggedIn, username, id } = res.data;
          if (!loggedIn) { // redirect if not logged in
            //setUser({ loggedIn: false, username: null })
            if (pageProps.protected) {
              router.push('/login'); // dont redirect unless necessary
            }
          } else {
            setUser({ loggedIn: loggedIn, username: username, userId: id });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  });

  // make a loading component
  if (pageProps.protected && !user) return <></>;

  return (
    <>
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user, setUser }}>
          <CookiesProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </CookiesProvider>
        </UserContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
