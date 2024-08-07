import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Drawer, List, ListItem, ListItemText, Box, Container, Typography, IconButton, Toolbar, Divider, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SellIcon from '@mui/icons-material/Sell';
import HotelIcon from '@mui/icons-material/Hotel';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TireForm from './components/TireForm';
import TireList from './components/TireList';
import Dashboard from './components/Dashboard';
import SaleForm from './components/SaleForm';
import TireHotel from './components/TireHotel';

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
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  const [tires, setTires] = useState([]);
  const [sales, setSales] = useState([]);
  const [hotelTires, setHotelTires] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button onClick={() => { setSelectedComponent('Dashboard'); setMobileOpen(false); }} selected={selectedComponent === 'Dashboard'}>
          <DashboardIcon />
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => { setSelectedComponent('TireForm'); setMobileOpen(false); }} selected={selectedComponent === 'TireForm'}>
          <AddCircleIcon />
          <ListItemText primary="Lastik Ekle" />
        </ListItem>
        <ListItem button onClick={() => { setSelectedComponent('SaleForm'); setMobileOpen(false); }} selected={selectedComponent === 'SaleForm'}>
          <SellIcon />
          <ListItemText primary="Lastik Sat" />
        </ListItem>
        <ListItem button onClick={() => { setSelectedComponent('TireHotel'); setMobileOpen(false); }} selected={selectedComponent === 'TireHotel'}>
          <HotelIcon />
          <ListItemText primary="Lastik Oteli" />
        </ListItem>
        <ListItem button onClick={() => { setSelectedComponent('TireList'); setMobileOpen(false); }} selected={selectedComponent === 'TireList'}>
          <ListAltIcon />
          <ListItemText primary="Lastik Listesi" />
        </ListItem>
      </List>
    </div>
  );

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Dashboard':
        return <Dashboard tires={tires} sales={sales} />;
      case 'TireForm':
        return <TireForm addTire={addTire} />;
      case 'SaleForm':
        return <SaleForm tires={tires} addSale={addSale} />;
      case 'TireHotel':
        return <TireHotel hotelTires={hotelTires} addHotelTire={addHotelTire} />;
      case 'TireList':
        return <TireList tires={tires} />;
      default:
        return <Dashboard tires={tires} sales={sales} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <Box component="nav">
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, backgroundColor: theme.palette.primary.main, color: '#fff', top: 0, bottom: 0 },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, backgroundColor: theme.palette.primary.main, color: '#fff', top: 0, bottom: 0 },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
          >
            <Toolbar sx={{ display: { sm: 'none' } }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
            <Container maxWidth="lg" sx={{ paddingTop: '2rem', paddingBottom: '2rem', flexGrow: 1 }}>
              <Paper elevation={3} sx={{ padding: '2rem', borderRadius: '8px', backgroundColor: '#fff' }}>
                <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, marginBottom: '1rem' }}>
                  <Typography variant="h4">{selectedComponent}</Typography>
                </Box>
                {renderComponent()}
              </Paper>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
