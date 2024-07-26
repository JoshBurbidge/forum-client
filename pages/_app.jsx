import '../styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Layout from '../components/Layout';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
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
          <Auth protected={pageProps.protected}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Auth>
        </ThemeProvider>
      </Auth0Provider>
    </>
  );
}

export default MyApp;
