import React from 'react';
import { Box, Text } from 'rebass/styled-components';

export default function TableOfContents({ items, currentHeaderUrl }) {
  return items ? (
    <Box
      as="nav"
      className="table-of-contents"
      mt="80px"
      color="grey01"
      width="calc((100vw - 720px) / 2 - 50px)"
      sx={{
        display: 'none',
        '@media screen and (min-width: 1200px)': {
          position: `sticky`,
          top: '70px',
          display: 'block',
          maxWidth: '360px',
          marginRight: '20px',
          overflow: 'auto',
          wordBreak: 'break-word',
          maxHeight: 'calc(100vh - 200px)',
          fontSize: '14px',
        },
      }}
    >
      <Text as="h3" mb="15px" ml="20px">
        TABLE OF CONTENTS
      </Text>
      <Box
        dangerouslySetInnerHTML={{ __html: items }}
        sx={{
          '& ul': {
            listStyle: 'none',
            marginLeft: '20px',
            marginBottom: '0px',
          },
          '& ul > li': {
            lineHeight: '1.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          [`& ul > li a[href="${currentHeaderUrl}"]`]: {
            fontSize: '15px',
            color: '#333333',
            fontWeight: '600',
          },
        }}
      />
    </Box>
  ) : null;
}
