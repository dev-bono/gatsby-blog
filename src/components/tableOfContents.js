import React from 'react';
import { Box, Text } from 'rebass/styled-components';

export default function TableOfContents({ items }) {
  return items ? (
    <Box
      as="nav"
      className="table-of-contents"
      mt="30px"
      color="grey01"
      sx={{
        maxHeight: 'calc(100vh - 200px)',
        fontSize: '14px',
      }}
    >
      <Text
        as="h3"
        mb="15px"
        ml="10px"
        sx={{
          textTransform: `uppercase`,
        }}
      >
        Table of Contents
      </Text>
      <Box
        dangerouslySetInnerHTML={{ __html: items }}
        sx={{
          '& ul ': {
            listStyle: 'none',
            marginLeft: '10px',
            marginBottom: '0px',
          },
          '& ul > li': {
            lineHeight: '1.5rem',
          },
          '& ul > li > a': {
            color: 'grey01',
            borderBottom: '2px solid #d7c3ee',
          },
        }}
      />
    </Box>
  ) : null;
}

// function createItems(items) {
//   return (
//     <
//   )
// }
