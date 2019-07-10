import React from 'react';
import Header from './header';
import '../reset.css';
import 'prismjs/themes/prism-tomorrow.css';
import '../common.css';
import { Box } from 'rebass';
import { ThemeProvider } from 'styled-components';
import theme from './theme';

export default function Template(props) {
  const { children } = props;
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Header {...props} />
        <Box
          className="contents"
          mx="auto"
          p="45px 20px"
          css={{
            maxWidth: '800px',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
