import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  Typography,
  IconButton,
  AppBar as MuiAppBar,
  Toolbar,
  Divider,
  Paper,
  useMediaQuery,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Fade,
  Badge,
  Button,
  SwipeableDrawer,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SellIcon from "@mui/icons-material/Sell";
import HotelIcon from "@mui/icons-material/Hotel";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TireRepairIcon from "@mui/icons-material/BuildCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TireForm from "./components/TireForm";
import TireList from "./components/TireList";
import Dashboard from "./components/Dashboard";
import SaleForm from "./components/SaleForm";
import TireHotel from "./components/TireHotel";
import CurrentAccount from "./components/CurrentAccount";
import Inventory from "./components/Inventory";
import Deliveries from "./components/Deliveries";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      padding: theme.spacing(2),
    },
  })
);

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: 0,
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const Logo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "center",
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const App = () => {
  const [tires, setTires] = useState([]);
  const [sales, setSales] = useState([]);
  const [hotelTires, setHotelTires] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({
    name: "Yusuf AYKIN",
    role: "Admin",
    avatar: "/path/to/avatar.jpg",
  });
  const [notifications, setNotifications] = useState(3);
  const [inventory, setInventory] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    setDarkMode(prefersDarkMode);
    if (isMobile) setOpen(false);
  }, [prefersDarkMode, isMobile]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#90caf9" : "#1976d2",
          },
          secondary: {
            main: darkMode ? "#f48fb1" : "#dc004e",
          },
          background: {
            default: darkMode ? "#303030" : "#f5f5f5",
            paper: darkMode ? "#424242" : "#ffffff",
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 600,
          },
        },
        components: {
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: darkMode ? "#212121" : "#1976d2",
                color: "#ffffff",
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                color: "inherit",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                "&:hover": {
                  boxShadow: "0px 6px 12px -2px rgba(0,0,0,0.2)",
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [darkMode]
  );

  useEffect(() => {
    const loadData = () => {
      const storedTires = JSON.parse(localStorage.getItem("tires")) || [];
      const storedSales = JSON.parse(localStorage.getItem("sales")) || [];
      const storedHotelTires =
        JSON.parse(localStorage.getItem("hotelTires")) || [];
      const storedInventory =
        JSON.parse(localStorage.getItem("inventory")) || [];
      const storedDeliveries =
        JSON.parse(localStorage.getItem("deliveries")) || [];
      setTires(storedTires);
      setSales(storedSales);
      setHotelTires(storedHotelTires);
      setInventory(storedInventory);
      setDeliveries(storedDeliveries);
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("tires", JSON.stringify(tires));
  }, [tires]);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("hotelTires", JSON.stringify(hotelTires));
  }, [hotelTires]);

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("deliveries", JSON.stringify(deliveries));
  }, [deliveries]);

  const addTire = (tire) => {
    setTires((prevTires) => [...prevTires, { ...tire, id: Date.now() }]);
    updateInventory(tire.id, tire.stock, "increase");
  };

  const addSale = (sale) => {
    const tire = tires.find((t) => t.id === sale.tireId);
    const profit = (sale.price - tire.price) * sale.quantity;
    setSales((prevSales) => [
      ...prevSales,
      { ...sale, id: Date.now(), profit },
    ]);
    updateStock(sale.tireId, sale.quantity);
    updateInventory(sale.tireId, sale.quantity, "decrease");
  };

  const updateStock = (tireId, soldQuantity) => {
    setTires((prevTires) =>
      prevTires.map((tire) =>
        tire.id === tireId
          ? { ...tire, stock: parseInt(tire.stock) - parseInt(soldQuantity) }
          : tire
      )
    );
  };

  const addHotelTire = (hotelTire) => {
    setHotelTires((prevHotelTires) => [
      ...prevHotelTires,
      { ...hotelTire, id: Date.now() },
    ]);
  };

  const updateInventory = (tireId, quantity, action) => {
    setInventory((prevInventory) => {
      const existingItem = prevInventory.find((item) => item.tireId === tireId);
      if (existingItem) {
        return prevInventory.map((item) =>
          item.tireId === tireId
            ? {
                ...item,
                quantity:
                  action === "increase"
                    ? item.quantity + quantity
                    : item.quantity - quantity,
              }
            : item
        );
      } else {
        return [...prevInventory, { tireId, quantity }];
      }
    });
  };

  const addDelivery = (delivery) => {
    setDeliveries((prevDeliveries) => [
      ...prevDeliveries,
      { ...delivery, id: Date.now() },
    ]);
    updateInventory(delivery.tireId, delivery.quantity, "increase");
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    {
      text: "Gösterge Paneli",
      icon: <DashboardIcon />,
      component: "Dashboard",
    },
    { text: "Lastik Ekle", icon: <AddCircleIcon />, component: "TireForm" },
    { text: "Lastik Sat", icon: <SellIcon />, component: "SaleForm" },
    { text: "Lastik Oteli", icon: <HotelIcon />, component: "TireHotel" },
    { text: "Lastik Listesi", icon: <ListAltIcon />, component: "TireList" },
    {
      text: "Cari Hesap",
      icon: <AnalyticsIcon />,
      component: "CurrentAccount",
    },
    { text: "Ayarlar", icon: <LocalShippingIcon />, component: "Settings" },
  ];

  const drawer = (
    <div>
      <Logo>
        <TireRepairIcon sx={{ fontSize: 40, mr: 1 }} />
        <Typography variant="h6" noWrap component="div">
          Dost Oto Lastik
        </Typography>
      </Logo>
      <Divider />
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Avatar src={user.avatar} alt={user.name} sx={{ mr: 2 }} />
        <Box>
          <Typography variant="subtitle1">{user.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.role}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              setSelectedComponent(item.component);
              if (isMobile) setOpen(false);
            }}
            selected={selectedComponent === item.component}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return <Dashboard tires={tires} sales={sales} />;
      case "TireForm":
        return <TireForm addTire={addTire} />;
      case "SaleForm":
        return <SaleForm tires={tires} addSale={addSale} />;
      case "TireHotel":
        return (
          <TireHotel hotelTires={hotelTires} addHotelTire={addHotelTire} />
        );
      case "TireList":
        return <TireList tires={tires} />;
      case "CurrentAccount": 
        return <CurrentAccount tires={tires} />;
      case "Inventory":
        return <Inventory inventory={inventory} tires={tires} />;
      case "Deliveries":
        return (
          <Deliveries
            deliveries={deliveries}
            addDelivery={addDelivery}
            tires={tires}
          />
        );
      default:
        return <Dashboard tires={tires} sales={sales} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex" }}>
          <StyledAppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: 2, ...(open && { display: { sm: "none" } }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                {selectedComponent}
              </Typography>
              <IconButton color="inherit" onClick={() => setNotifications(0)}>
                <StyledBadge badgeContent={notifications} color="secondary">
                  <NotificationsIcon />
                </StyledBadge>
              </IconButton>
              <IconButton
                sx={{ ml: 1 }}
                onClick={toggleDarkMode}
                color="inherit"
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <Tooltip title="Hesap ayarları">
                <IconButton onClick={handleMenu} color="inherit">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="inherit">Ayarlar</Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <ExitToAppIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="inherit">Çıkış Yap</Typography>
                </MenuItem>
              </Menu>
            </Toolbar>
          </StyledAppBar>
          {isMobile ? (
            <SwipeableDrawer
              anchor="left"
              open={open}
              onClose={handleDrawerToggle}
              onOpen={handleDrawerToggle}
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
            >
              {drawer}
            </SwipeableDrawer>
          ) : (
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              {drawer}
            </Drawer>
          )}
          <Main open={open}>
            <DrawerHeader />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Fade in={true} timeout={1000}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: "8px" }}>
                  {renderComponent()}
                </Paper>
              </Fade>
            </Container>
          </Main>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
