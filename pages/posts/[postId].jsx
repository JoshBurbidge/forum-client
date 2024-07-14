import { Typography } from "@mui/material";
import axios from "axios";

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

export default function Post(props) {

  return (<>
    <Typography>Title: {props.post.title}</Typography>
    <Typography>Content: {props.post.content}</Typography>
    <Typography>Author: {props.post.username}</Typography>

  </>);
}
