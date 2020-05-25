import React from 'react';
import { Box, Text } from 'rebass/styled-components';

export default function TableOfContents({ items }) {
  console.log('items', items);
  return items ? (
    <Box
      as="nav"
      // sx={{
      //   // mb: [8, null, null, null, null, 0],
      //   // pb: [6, null, null, null, null, 0],
      //   borderBottom: t => [
      //     `1px solid ${t.colors.ui.border}`,
      //     null,
      //     null,
      //     null,
      //     null,
      //     0,
      //   ],
      // }}
    >
      <Text
        as="h3"
        sx={{
          // color: `textMuted`,
          // fontSize: 1,
          // letterSpacing: `tracked`,
          // mt: 0,
          textTransform: `uppercase`,
        }}
      >
        Table of Contents
      </Text>
      {items}
    </Box>
  ) : null;
}
