import { Box, } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from "react";

export default function ArrowButton({onClick}) {
  const [hover, setHover] = useState(false);

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      component={'button'}
      height={'50px'}
      bgcolor={'primary.bg'}
      borderRadius={1}
      borderColor={hover ? 'black' : 'transparent'}
      sx={{cursor: 'pointer', borderWidth: '1px'}}
      onClick={onClick}
      onMouseEnter={() => setHover(!hover)}
      onMouseLeave={() => setHover(!hover)}
    >
      <KeyboardArrowDownIcon fontSize="large"/>
    </Box>
  );
}
