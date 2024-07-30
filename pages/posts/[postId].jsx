import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, ButtonGroup, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { getServerDomainForBrowser } from "../../utils/request-util";

export async function getServerSideProps(ctx) {
  const { params } = ctx;
  const res = await axios.get(process.env.NEXT_PUBLIC_serverDomain + '/posts/' + params.postId);

  const post = res.data;
  return {
    props: {
      post
    }
  };
}


export default function Post({post}) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(post.content);
  const router = useRouter();
  const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();

  const isAuthor = isAuthenticated && user.name === post.username;

  async function save() {
    setLoading(true);
    const token = await getAccessTokenSilently();

    await axios.put(`${getServerDomainForBrowser()}/posts/${post.id}`, {
      content: content
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    await router.replace(router.asPath);
    setEditing(false);
    setLoading(false);
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant={"h2"}>{post.title}</Typography>
          <Typography variant={'body2'}>Posted by {post.username}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {!editing && <Box padding={2} bgcolor={'white'} borderRadius={1}>
            <Typography variant={'body1'}>{post.content}</Typography>
          </Box>
          }
          {editing && <TextField multiline rows={6} fullWidth name="content" label="Content" variant="outlined"
            onChange={e => setContent(e.target.value)}
            defaultValue={post.content}
            sx={{ bgcolor: 'common.white' }}
          />
          }
        </Grid>

        {isAuthor &&
        <Grid item xs={12}>
          {!editing && <Button variant={"outlined"} onClick={(() => setEditing(true))} disabled={loading}>{'Edit'}</Button>}
          {editing &&
          <ButtonGroup size="medium">
            <Button variant={"outlined"} onClick={(() => setEditing(false))} disabled={loading}>{'Cancel'}</Button>
            <Button variant={"contained"} onClick={(() => {
              save();
            })}>
              {'Save'}
            </Button>
            {loading && <CircularProgress sx={{marginLeft: '5px'}}/>}
          </ButtonGroup>
          }
        </Grid>
        }
      </Grid>
    </>
  );
}
