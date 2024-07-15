import { Typography, Link, Card } from "@mui/material";
import NextLink from "next/link";
import { useState } from 'react';

export default function Post(props) {
  const [hover, setHover] = useState(false);

  const toggleHover = function () {
    setHover(!hover);
  };

  return (
    <NextLink href={"/posts/" + props.post.id} passHref>
      <Link underline={'none'} color={'black'}>

        <Card onMouseEnter={() => toggleHover()} onMouseLeave={() => toggleHover()}
          sx={{
            border: 1,
            borderColor: hover ? 'black' : 'transparent'
          }}>
          <Typography pl={1} variant="subtitle2">
            posted by {props.post.username}
          </Typography>

          <Typography p={2} variant='h6'>
            {props.post.title}
          </Typography>
        </Card>
      </Link>
    </NextLink >

  );
}
