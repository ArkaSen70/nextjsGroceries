import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#222', color: '#fff', py: 2, mt: 'auto' }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} CRUD App. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;