import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TextField, Button, Grid, Paper, Typography, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Chip, Tooltip, FormControlLabel, Switch, ThemeProvider, createTheme, CssBaseline,
  Avatar, Card, CardContent, CardActions, Divider, InputAdornment, Tabs, Tab, CircularProgress, LinearProgress,
  List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Menu, MenuItem
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line } from 'recharts';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f4f6f8' },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-cell': {
    color: theme.palette.text.primary,
  },
  '& .MuiPaginationItem-root': {
    borderRadius: 4,
  },
  '& .MuiDataGrid-toolbarContainer': {
    padding: theme.spacing(2),
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    '& .MuiButton-root': {
      marginRight: theme.spacing(1.5),
    },
  },
}));

const TireImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B6B', '#4ECDC4'];

const localizer = momentLocalizer(moment);

function TireHotel() {
  const [hotelTires, setHotelTires] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newTire, setNewTire] = useState({
    customerName: '', brand: '', size: '', quantity: '',
    storageDate: '', retrievalDate: '', photo: null, notes: '',
    plateNumber: '', vehicleModel: ''
  });
  const [editingTire, setEditingTire] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API calls
      const mockTires = [
        { id: 1, customerName: 'John Doe', brand: 'Michelin', size: '205/55R16', quantity: 4, storageDate: '2023-01-01', retrievalDate: '2023-12-31', notes: 'Winter tires', retrieved: false, plateNumber: '34ABC123', vehicleModel: 'Toyota Corolla' },
        { id: 2, customerName: 'Jane Smith', brand: 'Goodyear', size: '225/45R17', quantity: 4, storageDate: '2023-02-15', retrievalDate: '2023-11-30', notes: 'Summer tires', retrieved: false, plateNumber: '34XYZ789', vehicleModel: 'Ford Focus' },
        { id: 3, customerName: 'Bob Johnson', brand: 'Continental', size: '195/65R15', quantity: 4, storageDate: '2023-03-10', retrievalDate: '2023-10-31', notes: 'All-season tires', retrieved: false, plateNumber: '34DEF456', vehicleModel: 'Honda Civic' },
        { id: 4, customerName: 'Alice Brown', brand: 'Pirelli', size: '235/40R18', quantity: 4, storageDate: '2023-04-05', retrievalDate: '2023-09-30', notes: 'Performance tires', retrieved: false, plateNumber: '34GHI789', vehicleModel: 'BMW 3 Series' },
        { id: 5, customerName: 'Charlie Davis', brand: 'Bridgestone', size: '215/60R16', quantity: 4, storageDate: '2023-05-20', retrievalDate: '2023-11-15', notes: 'SUV tires', retrieved: false, plateNumber: '34JKL012', vehicleModel: 'Nissan Qashqai' },
      ];
      setHotelTires(mockTires);

      const mockCustomers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-9012' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '555-3456' },
        { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', phone: '555-7890' },
      ];
      setCustomers(mockCustomers);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const tireEvents = hotelTires.map(tire => ({
      title: `${tire.customerName} - ${tire.brand}`,
      start: new Date(tire.storageDate),
      end: new Date(tire.retrievalDate),
      resource: tire,
    }));
    setEvents(tireEvents);
  }, [hotelTires]);

  useEffect(() => {
    checkExpiredTires();
  }, [hotelTires]);

  const checkExpiredTires = useCallback(() => {
    const today = new Date();
    const expiredTires = hotelTires.filter(tire => 
      tire.retrievalDate && new Date(tire.retrievalDate) < today && !tire.retrieved
    );
    if (expiredTires.length > 0) {
      setSnackbar({
        open: true,
        message: `${expiredTires.length} lastik(ler) için alınma tarihi geçti!`,
        severity: 'warning'
      });
    }
  }, [hotelTires]);

  const handleChange = (e) => {
    setNewTire({ ...newTire, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTire({ ...newTire, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addHotelTire = useCallback((tire) => {
    const newId = Math.max(...hotelTires.map(t => t.id), 0) + 1;
    setHotelTires(prevTires => [...prevTires, { ...tire, id: newId }]);
  }, [hotelTires]);

  const updateHotelTire = useCallback((id, updatedTire) => {
    setHotelTires(prevTires => 
      prevTires.map(tire => tire.id === id ? { ...tire, ...updatedTire } : tire)
    );
  }, []);

  const removeHotelTire = useCallback((id) => {
    setHotelTires(prevTires => prevTires.filter(tire => tire.id !== id));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tireWithDates = {
      ...newTire,
      storageDate: newTire.storageDate ? new Date(newTire.storageDate).toISOString() : null,
      retrievalDate: newTire.retrievalDate ? new Date(newTire.retrievalDate).toISOString() : null
    };
    if (editingTire) {
      updateHotelTire(editingTire.id, tireWithDates);
      setSnackbar({ open: true, message: 'Lastik başarıyla güncellendi', severity: 'success' });
    } else {
      addHotelTire(tireWithDates);
      setSnackbar({ open: true, message: 'Yeni lastik başarıyla eklendi', severity: 'success' });
    }
    resetForm();
  };

  const resetForm = () => {
    setNewTire({
      customerName: '', brand: '', size: '', quantity: '',
      storageDate: '', retrievalDate: '', photo: null, notes: '',
      plateNumber: '', vehicleModel: ''
    });
    setEditingTire(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (tire) => {
    setEditingTire(tire);
    setNewTire({
      ...tire,
      storageDate: tire.storageDate ? new Date(tire.storageDate).toISOString().split('T')[0] : '',
      retrievalDate: tire.retrievalDate ? new Date(tire.retrievalDate).toISOString().split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    removeHotelTire(id);
    setSnackbar({ open: true, message: 'Lastik başarıyla silindi', severity: 'success' });
  };

  const handleRetrieve = (id) => {
    const tire = hotelTires.find(t => t.id === id);
    if (tire) {
      const updatedTire = { ...tire, retrievalDate: new Date().toISOString(), retrieved: true };
      updateHotelTire(id, updatedTire);
      setSnackbar({ open: true, message: 'Lastik teslim edildi', severity: 'info' });
    }
  };

  const filteredTires = useMemo(() => {
    return hotelTires.filter(tire =>
      (tire.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tire.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tire.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tire.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!showExpiredOnly || (tire.retrievalDate && new Date(tire.retrievalDate) < new Date() && !tire.retrieved))
    );
  }, [hotelTires, searchTerm, showExpiredOnly]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const columns = [
    {
      field: 'photo',
      headerName: 'Fotoğraf',
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          variant="rounded"
          sx={{ width: 60, height: 60 }}
        >
          {params.row.brand[0]}
        </Avatar>
      ),
    },
    { field: 'customerName', headerName: 'Müşteri Adı', width: 150 },
    { field: 'plateNumber', headerName: 'Plaka', width: 120 },
    { field: 'vehicleModel', headerName: 'Araç Modeli', width: 150 },
    { field: 'brand', headerName: 'Marka', width: 120 },
    { field: 'size', headerName: 'Ebat', width: 120 },
    { field: 'quantity', headerName: 'Adet', width: 80, type: 'number' },
    {
      field: 'status',
      headerName: 'Durum',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.retrieved ? 'Teslim Edildi' : 'Depoda'}
          color={params.row.retrieved ? 'success' : 'primary'}
          icon={params.row.retrieved ? <LocalShippingIcon /> : <InventoryIcon />}
        />
      ),
    },
    {
      field: 'storageDate',
      headerName: 'Depolama Tarihi',
      width: 130,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'retrievalDate',
      headerName: 'Alınma Tarihi',
      width: 130,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 300,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Düzenle">
            <IconButton onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sil">
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {!params.row.retrieved && (
            <Tooltip title="Teslim Et">
              <Button variant="outlined" size="small" onClick={() => handleRetrieve(params.row.id)}>
                Teslim Et
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Depo Fişi Yazdır">
            <IconButton onClick={() => generateStorageSlip(params.row)}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Otel Fişi Oluştur">
            <IconButton onClick={() => generateHotelReceipt(params.row)}>
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const generateStorageSlip = (tire) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const slipWidth = (pageWidth - 3 * margin) / 2;
    const slipHeight = (pageHeight - 3 * margin) / 2;
  
    const createSlip = (x, y) => {
      doc.rect(x, y, slipWidth, slipHeight);
      doc.setFontSize(12);
      doc.text("Lastik Oteli Depo Fişi", x + 5, y + 10);
      doc.setFontSize(10);
      doc.text(`Plaka: ${tire.plateNumber}`, x + 5, y + 20);
      doc.text(`Tarih: ${formatDate(tire.storageDate)}`, x + 5, y + 30);
      doc.text(`Marka: ${tire.brand}`, x + 5, y + 40);
      doc.text(`Ebat: ${tire.size}`, x + 5, y + 50);
      doc.text(`Not: ${tire.notes}`, x + 5, y + 60);
    };
  
    createSlip(margin, margin);
    createSlip(margin * 2 + slipWidth, margin);
    createSlip(margin, margin * 2 + slipHeight);
    createSlip(margin * 2 + slipWidth, margin * 2 + slipHeight);
  
    doc.save("lastik_oteli_depo_fisi.pdf");
  };
  
  const generateHotelReceipt = (tire) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Lastik Oteli Fişi", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.text("Müşteri Bilgileri", 20, 40);
    doc.setFontSize(10);
    doc.text(`Ad Soyad: ${tire.customerName}`, 20, 50);
    
    doc.setFontSize(12);
    doc.text("Araç Bilgileri", 20, 70);
    doc.setFontSize(10);
    doc.text(`Plaka: ${tire.plateNumber}`, 20, 80);
    doc.text(`Model: ${tire.vehicleModel}`, 20, 90);
    
    doc.setFontSize(12);
    doc.text("Lastik Bilgileri", 20, 110);
    doc.setFontSize(10);
    doc.text(`Marka: ${tire.brand}`, 20, 120);
    doc.text(`Ebat: ${tire.size}`, 20, 130);
    doc.text(`Adet: ${tire.quantity}`, 20, 140);
    doc.text(`Depolama Tarihi: ${formatDate(tire.storageDate)}`, 20, 150);
    doc.text(`Tahmini Alınma Tarihi: ${formatDate(tire.retrievalDate)}`, 20, 160);
    doc.text(`Not: ${tire.notes}`, 20, 170);
    
    doc.setFontSize(12);
    doc.text("İmza", 20, 200);
    doc.line(20, 210, 100, 210);
    
    doc.save("lastik_oteli_fisi.pdf");
  };
  
  const getDashboardData = () => {
    const totalTires = hotelTires.length;
    const storedTires = hotelTires.filter(tire => !tire.retrieved).length;
    const retrievedTires = totalTires - storedTires;
    const expiredTires = hotelTires.filter(tire => 
      tire.retrievalDate && new Date(tire.retrievalDate) < new Date() && !tire.retrieved
    ).length;
  
    return [
      { name: 'Depoda', value: storedTires },
      { name: 'Teslim Edilmiş', value: retrievedTires },
      { name: 'Süresi Geçmiş', value: expiredTires },
    ];
  };
  
  const getBrandDistribution = () => {
    const brandCounts = hotelTires.reduce((acc, tire) => {
      acc[tire.brand] = (acc[tire.brand] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(brandCounts).map(([brand, count]) => ({
      name: brand,
      value: count,
    }));
  };

  const getMonthlyStats = () => {
    const monthlyData = hotelTires.reduce((acc, tire) => {
      const month = new Date(tire.storageDate).getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, count]) => ({
      month: new Date(0, month).toLocaleString('default', { month: 'short' }),
      count: count,
    }));
  };

  const handleCustomerClick = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ flexGrow: 1, padding: 3 }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ marginBottom: 3 }}>
            Lastik Oteli Yönetim Sistemi
          </Typography>
          
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ marginBottom: 3 }}>
            <Tab label="Dashboard" icon={<DashboardIcon />} />
            <Tab label="Lastik Yönetimi" icon={<InventoryIcon />} />
            <Tab label="Müşteri Yönetimi" icon={<PersonIcon />} />
            <Tab label="Takvim" icon={<CalendarMonthIcon />} />
            <Tab label="Raporlar" icon={<BarChartIcon />} />
          </Tabs>
  
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Lastik Durumu</Typography>
                    <PieChart width={400} height={300}>
                      <Pie
                        data={getDashboardData()}
                        cx={200}
                        cy={150}
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getDashboardData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Marka Dağılımı</Typography>
                    <BarChart
                      width={400}
                      height={300}
                      data={getBrandDistribution()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Aylık İstatistikler</Typography>
                    <LineChart
                      width={800}
                      height={300}
                      data={getMonthlyStats()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Hızlı İstatistikler</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={3}>
                        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4">{hotelTires.length}</Typography>
                          <Typography variant="subtitle1">Toplam Lastik</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4">
                            {hotelTires.filter(tire => !tire.retrieved).length}
                          </Typography>
                          <Typography variant="subtitle1">Depodaki Lastik</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4">
                            {hotelTires.filter(tire => 
                              tire.retrievalDate && new Date(tire.retrievalDate) < new Date() && !tire.retrieved
                            ).length}
                          </Typography>
                          <Typography variant="subtitle1">Süresi Geçmiş Lastik</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4">{customers.length}</Typography>
                          <Typography variant="subtitle1">Toplam Müşteri</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
  
  {activeTab === 1 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <TextField
                  label="Ara"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<InventoryIcon />}
                    onClick={() => setIsDialogOpen(true)}
                    sx={{ marginRight: 2 }}
                  >
                    Yeni Lastik Ekle
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showExpiredOnly}
                        onChange={(e) => setShowExpiredOnly(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Sadece Süresi Geçenleri Göster"
                  />
                </Box>
              </Box>
              <StyledDataGrid
                rows={filteredTires}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                checkboxSelection
                disableSelectionOnClick
                components={{
                  Toolbar: GridToolbar,
                }}
              />
            </>
          )}

          {activeTab === 2 && (
            <Grid container spacing={3}>
              {customers.map((customer) => (
                <Grid item xs={12} sm={6} md={4} key={customer.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{customer.name}</Typography>
                      <Typography color="textSecondary">{customer.email}</Typography>
                      <Typography color="textSecondary">{customer.phone}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={(event) => handleCustomerClick(event, customer)}>
                        Detaylar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Düzenle</MenuItem>
                <MenuItem onClick={handleClose}>Sil</MenuItem>
                <MenuItem onClick={handleClose}>Lastikleri Görüntüle</MenuItem>
              </Menu>
            </Grid>
          )}

          {activeTab === 3 && (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
          )}

          {activeTab === 4 && (
            <Typography variant="h6">Raporlar bölümü geliştirme aşamasında...</Typography>
          )}
        </Box>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingTire ? 'Lastik Düzenle' : 'Yeni Lastik Ekle'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="customerName"
                    label="Müşteri Adı"
                    value={newTire.customerName}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="plateNumber"
                    label="Plaka"
                    value={newTire.plateNumber}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="vehicleModel"
                    label="Araç Modeli"
                    value={newTire.vehicleModel}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="brand"
                    label="Marka"
                    value={newTire.brand}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="size"
                    label="Ebat"
                    value={newTire.size}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="quantity"
                    label="Adet"
                    type="number"
                    value={newTire.quantity}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="storageDate"
                    label="Depolama Tarihi"
                    type="date"
                    value={newTire.storageDate}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="retrievalDate"
                    label="Tahmini Alınma Tarihi"
                    type="date"
                    value={newTire.retrievalDate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="notes"
                    label="Notlar"
                    value={newTire.notes}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handlePhotoChange}
                  />
                  <label htmlFor="raised-button-file">
                    <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>
                      Fotoğraf Yükle
                    </Button>
                  </label>
                  {newTire.photo && (
                    <TireImage src={newTire.photo} alt="Lastik fotoğrafı" />
                  )}
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>İptal</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingTire ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default TireHotel;