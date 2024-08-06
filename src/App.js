import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import TireForm from './components/TireForm';
import TireList from './components/TireList';
import Dashboard from './components/Dashboard';
import SaleForm from './components/SaleForm';
import TireHotel from './components/TireHotel';
import HomePage from './components/HomePage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#424242',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [tires, setTires] = useState([]);
  const [sales, setSales] = useState([]);
  const [hotelTires, setHotelTires] = useState([]);

  useEffect(() => {
    const storedTires = JSON.parse(localStorage.getItem('tires')) || [];
    const storedSales = JSON.parse(localStorage.getItem('sales')) || [];
    const storedHotelTires = JSON.parse(localStorage.getItem('hotelTires')) || [];
    setTires(storedTires);
    setSales(storedSales);
    setHotelTires(storedHotelTires);
  }, []);

  useEffect(() => {
    localStorage.setItem('tires', JSON.stringify(tires));
  }, [tires]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('hotelTires', JSON.stringify(hotelTires));
  }, [hotelTires]);

  const addTire = (tire) => {
    setTires([...tires, { ...tire, id: Date.now() }]);
  };

  const addSale = (sale) => {
    const tire = tires.find(t => t.id === sale.tireId);
    const profit = (sale.price - tire.price) * sale.quantity;
    setSales([...sales, { ...sale, id: Date.now(), profit }]);
    updateStock(sale.tireId, sale.quantity);
  };

  const updateStock = (tireId, soldQuantity) => {
    setTires(tires.map(tire => 
      tire.id === tireId 
        ? { ...tire, stock: parseInt(tire.stock) - parseInt(soldQuantity) } 
        : tire
    ));
  };

  const addHotelTire = (hotelTire) => {
    setHotelTires([...hotelTires, { ...hotelTire, id: Date.now() }]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Lastik Stok Takip Sistemi
            </Typography>
            <Button color="inherit" component={Link} to="/">Ana Sayfa</Button>
            <Button color="inherit" component={Link} to="/stok">Stok Takip</Button>
            <Button color="inherit" component={Link} to="/hotel">Lastik Oteli</Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stok" element={
              <>
                <Box mb={4}>
                  <Dashboard tires={tires} sales={sales} />
                </Box>
                <Box mb={4}>
                  <TireForm addTire={addTire} />
                </Box>
                <Box mb={4}>
                  <SaleForm tires={tires} addSale={addSale} />
                </Box>
                <TireList tires={tires} />
              </>
            } />
            <Route path="/hotel" element={<TireHotel hotelTires={hotelTires} addHotelTire={addHotelTire} />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;