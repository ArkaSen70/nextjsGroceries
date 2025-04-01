import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(18, 18, 18, 0.8)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: 'none',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
}));

const Header: React.FC = () => {
  const router = useRouter();
  
  return (
    <StyledAppBar position="static" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            color: '#ffffff',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          Grocery List App
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => router.push('/cms/groceryList')}
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                color: '#90caf9',
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Grocery List
          </Button>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={() => router.push('/cms/cart')}
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                color: '#90caf9',
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ShoppingCartIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;