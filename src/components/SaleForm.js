import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper as TablePaper, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as XLSX from 'xlsx';

function SaleForm({ tires, addSale }) {
  const [sale, setSale] = useState({
    tireId: '',
    quantity: '',
    price: '',
    date: '',
    customerName: ''
  });
  const [salesHistory, setSalesHistory] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState('customerName');
  const [filterValue, setFilterValue] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'tireId') {
      const selectedTire = tires.find(tire => tire.id === e.target.value);
      setSale({ ...sale, [e.target.name]: e.target.value, price: selectedTire.price });
    } else {
      setSale({ ...sale, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addSale(sale);
    setSalesHistory([...salesHistory, sale]);
    setSale({ tireId: '', quantity: '', price: '', date: '', customerName: '' });
  };

  const handleOpenHistory = () => setOpenHistory(true);
  const handleCloseHistory = () => setOpenHistory(false);

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(salesHistory.map(sale => {
      const tire = tires.find(tire => tire.id === sale.tireId);
      return {
        Tarih: sale.date,
        'Müşteri Adı Soyadı': sale.customerName,
        Marka: tire?.brand || 'N/A',
        Ebat: tire?.size || 'N/A',
        'Satış Adedi': sale.quantity,
        'Satış Fiyatı': sale.price
      };
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Satış Geçmişi');
    XLSX.writeFile(wb, 'satis_gecmisi.xlsx');
  };

  const filteredSales = salesHistory.filter(sale => {
    const tire = tires.find(tire => tire.id === sale.tireId);
    switch (filterCriteria) {
      case 'customerName':
        return sale.customerName.toLowerCase().includes(filterValue.toLowerCase());
      case 'brand':
        return tire?.brand.toLowerCase().includes(filterValue.toLowerCase());
      case 'size':
        return tire?.size.toLowerCase().includes(filterValue.toLowerCase());
      case 'price':
        return sale.price.toString().includes(filterValue);
      case 'date':
        return sale.date.includes(filterValue);
      default:
        return true;
    }
  });

  return (
    <div>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Satış Yap
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Lastik</InputLabel>
                <Select
                  name="tireId"
                  value={sale.tireId}
                  onChange={handleChange}
                  required
                  label="Lastik"
                >
                  {tires.map(tire => (
                    <MenuItem key={tire.id} value={tire.id}>
                      {tire.brand} - {tire.size} - {tire.season} ({tire.stock} adet)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth name="quantity" label="Satış Adedi" type="number" value={sale.quantity} onChange={handleChange} required variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth name="price" label="Satış Fiyatı" type="number" value={sale.price} onChange={handleChange} required variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth name="date" label="Tarih" type="date" value={sale.date} onChange={handleChange} required variant="outlined" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth name="customerName" label="Müşteri Adı Soyadı" value={sale.customerName} onChange={handleChange} required variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" style={{ marginRight: '10px' }}>
                  Satış Yap
                </Button>
                <Button variant="contained" onClick={handleOpenHistory}>
                  Satış Geçmişi
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog open={openHistory} onClose={handleCloseHistory} fullWidth maxWidth="md">
        <DialogTitle>
          Satış Geçmişi
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseHistory}
            aria-label="close"
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ marginBottom: '20px' , marginTop: '1px'}}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
              <InputLabel>Filtre Kriteri</InputLabel>
                <Select
                  value={filterCriteria}
                  onChange={(e) => setFilterCriteria(e.target.value)}
                  label="Filtre Kriteri"
                >
                  <MenuItem value="customerName">Müşteri Adı Soyadı</MenuItem>
                  <MenuItem value="brand">Marka</MenuItem>
                  <MenuItem value="size">Ebat</MenuItem>
                  <MenuItem value="price">Fiyat</MenuItem>
                  <MenuItem value="date">Tarih</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`${filterCriteria === 'customerName' ? 'Müşteri Adı Soyadı' : filterCriteria === 'brand' ? 'Marka' : filterCriteria === 'size' ? 'Ebat' : filterCriteria === 'price' ? 'Fiyat' : 'Tarih'}`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" onClick={handleExportToExcel} style={{ marginBottom: '20px' }}>
            Excel'e İndir
          </Button>
          <TableContainer component={TablePaper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Müşteri Adı Soyadı</TableCell>
                  <TableCell>Marka</TableCell>
                  <TableCell>Ebat</TableCell>
                  <TableCell>Satış Adedi</TableCell>
                  <TableCell>Satış Fiyatı</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale, index) => {
                    const tire = tires.find(tire => tire.id === sale.tireId);
                    return (
                      <TableRow key={index}>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.customerName}</TableCell>
                        <TableCell>{tire?.brand || 'N/A'}</TableCell>
                        <TableCell>{tire?.size || 'N/A'}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>{sale.price}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center' }}>Veri bulunamadı</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SaleForm;