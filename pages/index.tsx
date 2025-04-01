import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  alpha,
  CssBaseline,
} from '@mui/material';
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import DiscountIcon from '@mui/icons-material/Discount';
import { useRouter } from 'next/router';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: 'rgba(255, 255, 255, 0.7)' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { 
      fontWeight: 700,
      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
      background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h4: { fontWeight: 600 },
  },
});

const features = [
  {
    icon: <LocalGroceryStoreIcon sx={{ fontSize: 40 }} />,
    title: 'Wide Selection',
    description: 'Browse through our extensive collection of fresh groceries and household items.',
  },
  {
    icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
    title: 'Easy Shopping',
    description: 'Simple and intuitive interface for a seamless shopping experience.',
  },
  {
    icon: <DiscountIcon sx={{ fontSize: 40 }} />,
    title: 'Great Deals',
    description: 'Enjoy automatic discounts and special coupon codes on your purchases.',
  },
];

const LandingPage = () => {
  const router = useRouter();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(144, 202, 249, 0.1) 0%, transparent 50%)',
            zIndex: 1,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Hero Section */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              py: 8,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 4,
              }}
            >
              Welcome to GroceryList
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Your one-stop destination for all your grocery needs. Shop smart, save time, and enjoy great deals!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/cms/groceryList')}
              sx={{
                background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(45deg, #90caf9 40%, #f48fb1 100%)',
                },
              }}
            >
              Start Shopping
            </Button>
          </Box>

          {/* Features Section */}
          <Box sx={{ py: 8 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4 
            }}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      background: alpha('#1e1e1e', 0.7),
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: 'primary.main',
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ textAlign: 'center' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
