import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";

export async function getServerSideProps() {
  return {
    props: {
      protected: true
    }
  };
}

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const auth0 = useAuth0();

  const handleSubmit = async function (e) {
    e.preventDefault();
    const token = await auth0.getAccessTokenSilently();

    const res = await axios.post(process.env.NEXT_PUBLIC_serverDomain + '/posts', {
      title: title,
      content: content,
      username: auth0.user.name
    }, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(res);
    router.push('/');
  };

  return (<>
    <Container sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>

      <Grid container component="form" maxWidth={'md'} rowSpacing={1} pt={2} sx={{ width: '100%' }}
        onSubmit={e => handleSubmit(e)}>
        <Grid item xs={12}>
          <Typography variant="h4">Make a new post!</Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField name="title" label="Title" variant="outlined" fullWidth
            onChange={e => setTitle(e.target.value)} margin='normal'
            sx={{ bgcolor: 'common.white' }} autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField multiline rows={6} fullWidth name="content" label="Content" variant="outlined"
            onChange={e => setContent(e.target.value)} margin='normal'
            sx={{ bgcolor: 'common.white' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" type="submit" size="large" fullWidth>Submit Post</Button>
        </Grid>

      </Grid>
    </Container>
  </>);
}
