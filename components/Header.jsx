import { Box, Typography} from "@mui/material";
import NextLink from "next/link";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

export default function Header() {
  const auth0 = useAuth0();

  const links =
    auth0.isLoading ? null :
      auth0.isAuthenticated ? (<>
        <Typography marginX={2}>
          <NextLink href='/dashboard' >
            {auth0.user.name}
          </NextLink >
        </Typography>
        <LogoutButton/>
      </>) :
        <LoginButton/>;

  return (
    <Box width="100%" padding={3} bgcolor="primary.bg" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Typography marginX={2}><NextLink href={'/'}>Home</NextLink></Typography>
      {links}
    </Box>
  );
}
