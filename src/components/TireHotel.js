import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TextField, Button, Grid, Paper, Typography, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Chip, Tooltip, FormControlLabel, Switch, ThemeProvider, createTheme
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const theme = createTheme({
  palette: {
    primary: { main: '#0056b3' },
    secondary: { main: '#6c757d' },
  },
  typography: { fontFamily: 'Arial, sans-serif' },
});

function TireHotel() {
  const [hotelTires, setHotelTires] = useState([]);
  const [newTire, setNewTire] = useState({
    customerName: '', brand: '', size: '', quantity: '',
    storageDate: '', retrievalDate: '', photo: null, notes: ''
  });
  const [editingTire, setEditingTire] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);

  useEffect(() => {
    // Simulating fetching data from an API
    const fetchTires = async () => {
      // In a real application, you would fetch data from an API here
      const mockData = [
        { id: 1, customerName: 'John Doe', brand: 'Michelin', size: '205/55R16', quantity: 4, storageDate: '2023-01-01', retrievalDate: '2023-12-31', notes: 'Winter tires', retrieved: false },
        { id: 2, customerName: 'Jane Smith', brand: 'Goodyear', size: '225/45R17', quantity: 4, storageDate: '2023-02-15', retrievalDate: '2023-11-30', notes: 'Summer tires', retrieved: false },
      ];
      setHotelTires(mockData);
    };
    fetchTires();
  }, []);

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
      storageDate: '', retrievalDate: '', photo: null, notes: ''
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
    } else {
      console.error('Tire not found');
      setSnackbar({ open: true, message: 'Lastik bulunamadı', severity: 'error' });
    }
  };

  const filteredTires = useMemo(() => {
    return hotelTires.filter(tire =>
      (tire.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tire.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tire.size.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!showExpiredOnly || (tire.retrievalDate && new Date(tire.retrievalDate) < new Date() && !tire.retrieved))
    );
  }, [hotelTires, searchTerm, showExpiredOnly]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const columns = [
    { field: 'customerName', headerName: 'Müşteri Adı', width: 150 },
    { field: 'brand', headerName: 'Marka', width: 120 },
    { field: 'size', headerName: 'Ebat', width: 120 },
    { field: 'quantity', headerName: 'Adet', width: 80, type: 'number' },
    {
      field: 'storageDate',
      headerName: 'Depolama Tarihi',
      width: 150,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'retrievalDate',
      headerName: 'Alınma Tarihi',
      width: 150,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'status',
      headerName: 'Durum',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.retrieved ? 'Teslim Edildi' : 'Depoda'}
          color={params.row.retrieved ? 'success' : 'primary'}
          icon={params.row.retrieved ? <LocalShippingIcon /> : <CalendarTodayIcon />}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 200,
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
        </Box>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ marginBottom: 3 }}>
            Lastik Oteli Yönetim Sistemi
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsDialogOpen(true)}
                startIcon={<PhotoCamera />}
                fullWidth
              >
                Yeni Lastik Ekle
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Ara"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredTires}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Paper>

        <Dialog open={isDialogOpen} onClose={resetForm} maxWidth="md" fullWidth>
          <DialogTitle>{editingTire ? 'Lastik Düzenle' : 'Yeni Lastik Ekle'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="customerName" label="Müşteri Adı" value={newTire.customerName} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="brand" label="Marka" value={newTire.brand} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="size" label="Ebat" value={newTire.size} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="quantity" label="Adet" type="number" value={newTire.quantity} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="storageDate" label="Depolama Tarihi" type="date" InputLabelProps={{ shrink: true }} value={newTire.storageDate} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="retrievalDate" label="Alınma Tarihi" type="date" InputLabelProps={{ shrink: true }} value={newTire.retrievalDate} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth name="notes" label="Notlar" multiline rows={4} value={newTire.notes} onChange={handleChange} />
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
                    <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                      Fotoğraf Yükle
                    </Button>
                  </label>
                  {newTire.photo && (
                    <img src={newTire.photo} alt="Lastik fotoğrafı" style={{ width: '100%', marginTop: '10px' }} />
                  )}
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetForm}>İptal</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
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