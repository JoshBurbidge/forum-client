import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import axios from "axios";
import { Typography } from "@mui/material";
import Post from "../components/PostCard";

export async function getServerSideProps() {
  return {
    props: {
      protected: true
    }
  };


}

export default function Dashboard(props) {
  const {user} = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetch() {
      const {data: userPosts} = await axios.get(`${process.env.NEXT_PUBLIC_serverDomain}/users/${user.userId}/posts`);
      setPosts(userPosts);
    }
    fetch();

  }, [user.userId]);

  return (
    <>
      <Typography>Dashboard</Typography>
      <Typography>user: {user.username}</Typography>
      {posts.map(post => (
        <Post post={post} key={post.id}></Post>
      ))}
    </>
  );
}
