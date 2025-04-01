import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  Box, 
  Typography, 
  Container, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  alpha, 
  IconButton,
  TextField,
  Button,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface GroceryItem {
  id: number;
  name: string;
  price: number;
  quantity?: number;
}

interface Discount {
  threshold: number;
  percentage: number;
}

interface Coupon {
  code: string;
  percentage: number;
  isActive: boolean;
}

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
    h4: { fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.2)' },
  },
});

const DISCOUNTS: Discount[] = [
  { threshold: 50, percentage: 5 },
  { threshold: 100, percentage: 10 },
  { threshold: 200, percentage: 15 },
];

const COUPONS: Coupon[] = [
  { code: 'WELCOME10', percentage: 10, isActive: true },
  { code: 'SPECIAL20', percentage: 20, isActive: true },
  { code: 'SUMMER15', percentage: 15, isActive: true },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<GroceryItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [showCouponAlert, setShowCouponAlert] = useState(false);
  const [couponAlertMessage, setCouponAlertMessage] = useState('');
  const [couponAlertSeverity, setCouponAlertSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedItems = localStorage.getItem('cartItems');
      if (storedItems) {
        setCartItems(JSON.parse(storedItems));
      }
    }
  }, []);

  const updateQuantity = (item: GroceryItem, increment: boolean) => {
    const newQuantity = increment ? (item.quantity || 1) + 1 : (item.quantity || 1) - 1;
    
    if (newQuantity <= 0) {
      const updatedItems = cartItems.filter(cartItem => cartItem.id !== item.id);
      setCartItems(updatedItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    } else {
      const updatedItems = cartItems.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
      setCartItems(updatedItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const calculateDiscount = (subtotal: number) => {
    const applicableDiscount = DISCOUNTS
      .filter(discount => subtotal >= discount.threshold)
      .sort((a, b) => b.percentage - a.percentage)[0];
    
    return applicableDiscount ? (subtotal * applicableDiscount.percentage) / 100 : 0;
  };

  const applyCoupon = () => {
    const coupon = COUPONS.find(c => c.code === couponCode.toUpperCase() && c.isActive);
    
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponAlertMessage('Coupon applied successfully!');
      setCouponAlertSeverity('success');
    } else {
      setCouponAlertMessage('Invalid or expired coupon code');
      setCouponAlertSeverity('error');
    }
    setShowCouponAlert(true);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const thresholdDiscount = calculateDiscount(subtotal);
    const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.percentage) / 100 : 0;
    
    const totalDiscount = Math.max(thresholdDiscount, couponDiscount);
    
    return (subtotal - totalDiscount).toFixed(2);
  };

  const getDiscountInfo = () => {
    const subtotal = calculateSubtotal();
    const thresholdDiscount = DISCOUNTS
      .filter(discount => subtotal >= discount.threshold)
      .sort((a, b) => b.percentage - a.percentage)[0];
    
    if (thresholdDiscount) {
      return `You're eligible for ${thresholdDiscount.percentage}% off on orders over $${thresholdDiscount.threshold}!`;
    }
    return null;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
          </motion.div>
          {cartItems.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <List sx={{ backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.7), borderRadius: 1, p: 2 }}>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListItem>
                      <ListItemText
                        primary={item.name}
                        secondary={`$${item.price.toFixed(2)}`}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton 
                          color="primary" 
                          onClick={() => updateQuantity(item, false)}
                          sx={{
                            '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.1)' }
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ minWidth: '2rem', textAlign: 'center' }}>
                          {item.quantity || 1}
                        </Typography>
                        <IconButton 
                          color="primary" 
                          onClick={() => updateQuantity(item, true)}
                          sx={{
                            '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.1)' }
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                    <Divider component="li" />
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <ListItem>
                    <ListItemText
                      primary="Subtotal"
                      secondary={`$${calculateSubtotal().toFixed(2)}`}
                    />
                  </ListItem>
                  {getDiscountInfo() && (
                    <ListItem>
                      <ListItemText
                        secondary={getDiscountInfo()}
                        secondaryTypographyProps={{ style: { color: '#90caf9' } }}
                      />
                    </ListItem>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
                    <TextField
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      sx={{ 
                        width: '200px',
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={applyCoupon}
                      disabled={!couponCode || !!appliedCoupon}
                      startIcon={<LocalOfferIcon />}
                    >
                      Apply Coupon
                    </Button>
                  </Box>
                  {appliedCoupon && (
                    <ListItem>
                      <ListItemText
                        secondary={`Coupon "${appliedCoupon.code}" applied: ${appliedCoupon.percentage}% off`}
                        secondaryTypographyProps={{ style: { color: '#90caf9' } }}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemText
                      primary="Total"
                      secondary={`$${calculateTotal()}`}
                      primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                      secondaryTypographyProps={{ style: { fontSize: '1.2rem', color: '#90caf9' } }}
                    />
                  </ListItem>
                </motion.div>
              </List>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Your cart is empty. Add some items from the grocery list!
              </Typography>
            </motion.div>
          )}

          {/* Available Coupons Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                Available Coupons
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
                mt: 2
              }}>
                {COUPONS.map((coupon) => (
                  <Paper
                    key={coupon.code}
                    sx={{
                      p: 2,
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
                    <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                      {coupon.code}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {coupon.percentage}% off on your purchase
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                      {coupon.isActive ? 'Active' : 'Expired'}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </motion.div>

          <Snackbar
            open={showCouponAlert}
            autoHideDuration={3000}
            onClose={() => setShowCouponAlert(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity={couponAlertSeverity} sx={{ width: '100%' }}>
              {couponAlertMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CartPage;