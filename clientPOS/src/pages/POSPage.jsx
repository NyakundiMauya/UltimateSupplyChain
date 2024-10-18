import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '../layouts/SecLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

// TODO: my key
const UNSPLASH_ACCESS_KEY = 'NGdifT54YM80s69x0V6jhelsvOZX9TCwbEuc5LyUWyo';

// Add this constant for the exchange rate (1 USD to KSH)
const USD_TO_KSH_RATE = 135.5; // This is an example rate, you should use a live rate in production

function POSPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/products');
      const productsWithImages = await Promise.all(response.data.map(async product => ({
        ...product,
        image: await fetchProductImage(product.name, product.category)
      })));
      setProducts(productsWithImages);
    } catch (error) {
      toast.error('Failed to fetch products', toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  const addProductToCart = (product) => {
    const existingProduct = cart.find(item => item._id === product._id);

    if (existingProduct) {
      const updatedCart = cart.map(cartItem =>
        cartItem._id === product._id
          ? { ...cartItem, quantity: cartItem.quantity + 1, totalAmount: cartItem.price * (cartItem.quantity + 1) }
          : cartItem
      );
      setCart(updatedCart);
      toast(`Added ${existingProduct.name} to cart`, toastOptions);
    } else {
      const newProduct = { ...product, quantity: 1, totalAmount: product.price };
      setCart([...cart, newProduct]);
      toast(`Added ${product.name} to cart`, toastOptions);
    }
  };

  const removeProductFromCart = (product) => {
    const updatedCart = cart.filter(cartItem => cartItem._id !== product._id);
    setCart(updatedCart);
    toast(`Removed ${product.name} from cart`, toastOptions);
  };

  const clearCart = () => {
    setCart([]);
    toast('Cart cleared', toastOptions);
  };

  const componentRef = useRef();
  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length > 0) {
      // Pass the original totalAmount without conversion
      navigate('/checkout', { state: { cart, totalAmount } });
    } else {
      toast.error('Your cart is empty!', toastOptions);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const newTotalAmount = cart.reduce((total, cartItem) => total + cartItem.totalAmount, 0);
    setTotalAmount(newTotalAmount);
  }, [cart]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered products by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    (acc[product.category] = acc[product.category] || []).push(product);
    return acc;
  }, {});

  const fetchProductImage = async (productName, category) => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: {
          query: `${productName} ${category}`,
          per_page: 1,
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });
      return response.data.results[0]?.urls.small || 'https://via.placeholder.com/200x200?text=No+Image';
    } catch (error) {
      console.error('Failed to fetch image:', error);
      return 'https://via.placeholder.com/200x200?text=No+Image';
    }
  };

  // Add this function to convert USD to KSH
  const convertToKSH = (usdAmount) => {
    return (usdAmount * USD_TO_KSH_RATE).toFixed(2);
  };

  return (
    <MainLayout>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 8, // Increase top margin
        px: 2,
        pt: 2, // Add top padding
      }}>
        {/* Left side - Product display */}
        <Box sx={{ flex: 1, mr: 2 }}>
          {/* Add search bar */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          {isLoading ? (
            <CircularProgress />
          ) : (
            Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <Box key={category} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                  {category}
                </Typography>
                <Grid container spacing={2}>
                  {categoryProducts.map((product) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={product._id}>
                      <Card
                        sx={{
                          boxShadow: 1,
                          transition: 'box-shadow 0.3s',
                          '&:hover': { 
                            boxShadow: 3,
                            '& .MuiCardContent-root': { borderColor: 'primary.main' },
                          },
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <CardContent 
                          sx={{ 
                            p: 1, 
                            '&:last-child': { pb: 1 },
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid transparent',
                            borderRadius: 1,
                          }}
                        >
                          <Box
                            sx={{
                              paddingTop: '100%',
                              position: 'relative',
                              mb: 1,
                            }}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </Box>
                          <Typography variant="body2" noWrap>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mt: 'auto' }}>
                            KSH {product.price.toFixed(2)}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AddShoppingCartIcon />}
                            onClick={() => addProductToCart(product)}
                            sx={{ 
                              mt: 1, 
                              textTransform: 'none',
                              borderColor: 'orange',
                              color: 'orange',
                              '&:hover': {
                                borderColor: 'darkorange',
                                backgroundColor: 'rgba(255, 165, 0, 0.04)',
                              },
                            }}
                          >
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))
          )}
        </Box>

        {/* Right side - Shopping cart */}
        <Box sx={{ width: '25%', minWidth: 300 }}>
          <Box sx={{ backgroundColor: 'grey.100', borderRadius: 2, p: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Cart
            </Typography>
            <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
              {cart.length > 0 ? (
                cart.map((cartProduct, key) => (
                  <Box
                    key={key}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      borderBottom: '1px solid #ccc',
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {cartProduct.name} (x{cartProduct.quantity}) - KSH {convertToKSH(cartProduct.totalAmount)}
                    </Typography>
                    <IconButton color="error" onClick={() => removeProductFromCart(cartProduct)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  No Items in Cart
                </Typography>
              )}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Total: KSH {totalAmount.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={clearCart}
                disabled={cart.length === 0}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  padding: '6px 16px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  },
                }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                disabled={totalAmount === 0}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  padding: '6px 16px',
                  '&:hover': {
                    backgroundColor: 'rgba(63, 81, 181, 0.9)',
                  },
                }}
              >
                Pay
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}

export default POSPage;
