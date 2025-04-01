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
  Button, 
  alpha, 
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import UndoIcon from '@mui/icons-material/Undo';

interface GroceryItem {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  category: string;
}

interface ActionHistory {
  type: 'add' | 'remove';
  item: GroceryItem;
  quantity: number;
  timestamp: number;
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

const initialItems: GroceryItem[] = [
  { id: 1, name: 'Apples', price: 2.99, category: 'Fruits' },
  { id: 2, name: 'Bananas', price: 1.99, category: 'Fruits' },
  { id: 3, name: 'Milk', price: 3.99, category: 'Dairy' },
  { id: 4, name: 'Bread', price: 2.49, category: 'Bakery' },
  { id: 5, name: 'Eggs', price: 4.99, category: 'Dairy' },
  { id: 6, name: 'Chicken', price: 8.99, category: 'Meat' },
  { id: 7, name: 'Rice', price: 5.99, category: 'Grains' },
  { id: 8, name: 'Tomatoes', price: 1.49, category: 'Vegetables' },
];

const categories = Array.from(new Set(initialItems.map(item => item.category)));

const GroceryListPage = () => {
  const [items, setItems] = useState<GroceryItem[]>(initialItems);
  const [cartQuantities, setCartQuantities] = useState<{ [key: number]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);
  const [showUndoSnackbar, setShowUndoSnackbar] = useState(false);
  const [lastAction, setLastAction] = useState<ActionHistory | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedItems = localStorage.getItem('cartItems');
      if (storedItems) {
        const cartItems = JSON.parse(storedItems);
        const quantities: { [key: number]: number } = {};
        cartItems.forEach((item: GroceryItem) => {
          quantities[item.id] = item.quantity || 0;
        });
        setCartQuantities(quantities);
      }
    }
  }, []);

  const updateCart = (item: GroceryItem, increment: boolean) => {
    let cartItems: GroceryItem[] = [];
    if (typeof window !== 'undefined') {
      const storedItems = localStorage.getItem('cartItems');
      cartItems = storedItems ? JSON.parse(storedItems) : [];
    }
    
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    const currentQuantity = cartQuantities[item.id] || 0;
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;

    const action: ActionHistory = {
      type: increment ? 'add' : 'remove',
      item: { ...item },
      quantity: currentQuantity,
      timestamp: Date.now()
    };
    setActionHistory(prev => [...prev, action]);
    setLastAction(action);
    setShowUndoSnackbar(true);

    if (newQuantity <= 0) {
      cartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
      setCartQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[item.id];
        return newQuantities;
      });
    } else {
      if (existingItem) {
        existingItem.quantity = newQuantity;
      } else {
        cartItems.push({ ...item, quantity: newQuantity });
      }
      setCartQuantities(prev => ({
        ...prev,
        [item.id]: newQuantity
      }));
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  const undoLastAction = () => {
    if (lastAction) {
      const { type, item, quantity } = lastAction;
      updateCart(item, type === 'remove');
      setActionHistory(prev => prev.slice(0, -1));
      setLastAction(null);
      setShowUndoSnackbar(false);
    }
  };

  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Typography variant="h4" gutterBottom>Grocery List</Typography>
          </motion.div>

          <Stack spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
                }}
                sx={{ 
                  width: { xs: '100%', sm: '300px' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  },
                }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>

          <List sx={{ backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.7), borderRadius: 1, p: 2 }}>
            {filteredAndSortedItems.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <ListItem>
                  <ListItemText 
                    primary={item.name} 
                    secondary={`$${item.price.toFixed(2)} ${cartQuantities[item.id] ? `(In cart: ${cartQuantities[item.id]})` : ''} • ${item.category}`} 
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      color="primary" 
                      onClick={() => updateCart(item, false)}
                      disabled={!cartQuantities[item.id]}
                      sx={{ 
                        '&.Mui-disabled': { 
                          color: 'rgba(255, 255, 255, 0.3)',
                          '&:hover': { backgroundColor: 'transparent' }
                        }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ minWidth: '2rem', textAlign: 'center' }}>
                      {cartQuantities[item.id] || 0}
                    </Typography>
                    <IconButton 
                      color="primary" 
                      onClick={() => updateCart(item, true)}
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.1)' }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              </motion.div>
            ))}
          </List>

          <Snackbar
            open={showUndoSnackbar}
            autoHideDuration={3000}
            onClose={() => setShowUndoSnackbar(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              severity="info" 
              action={
                <Button color="inherit" size="small" onClick={undoLastAction}>
                  <UndoIcon sx={{ mr: 1 }} /> Undo
                </Button>
              }
            >
              {lastAction?.type === 'add' ? 'Item added to cart' : 'Item removed from cart'}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default GroceryListPage;