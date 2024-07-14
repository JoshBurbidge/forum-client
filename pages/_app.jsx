import '../styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Layout from '../components/Layout';
import { CookiesProvider } from "react-cookie";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { UserContext } from '../components/UserContext';
import { useState } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import Auth from './auth';

function MyApp({ Component, pageProps }) {
  const theme = createTheme({
    palette: {
      primary: {
        main: blue[700],
        bg: blue[100]
      }
    }
  });

  const [user, setUser] = useState(); // maybe set this based on user cookie

  return (
    <>
      <Auth0Provider
        domain="dev-ez2f8ejiacjig1qh.us.auth0.com"
        clientId="iYl0gPTSSSAtrQbNVgGVi7nGY07tNznu"
        authorizationParams={{
          redirect_uri: 'http://localhost:3001',
          audience: 'forum-api'
        }}
      >
        <ThemeProvider theme={theme}>
          <UserContext.Provider value={{ user, setUser }}>
            <CookiesProvider>
              <Auth protected={pageProps.protected}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </Auth>
            </CookiesProvider>
          </UserContext.Provider>
        </ThemeProvider>
      </Auth0Provider>
    </>
  );
}

export default MyApp;
