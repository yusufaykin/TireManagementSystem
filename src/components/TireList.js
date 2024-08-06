import React, { useState, useRef, useMemo, useCallback } from 'react';
import { 
  TextField, List, ListItemText, ListItemAvatar, 
  Avatar, Paper, Typography, Dialog, DialogTitle, DialogContent, 
  IconButton, Tooltip, Snackbar, Button, Box, Grid, Select, 
  MenuItem, FormControl, InputLabel, Switch, FormControlLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Carousel from 'react-material-ui-carousel';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode';
import HistoryIcon from '@mui/icons-material/History';
import GetAppIcon from '@mui/icons-material/GetApp';
import ListItem from '@mui/material/ListItem';

import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode.react';
import './i18n';


const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f8f9fa',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: '#343a40',
  color: '#ffffff',
  padding: theme.spacing(2),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const ShareableContent = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  padding: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#f1f3f5',
  },
}));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#303030',
      paper: '#424242',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function TireList({ tires, setTires }) {
  const [filter, setFilter] = useState('');
  const [selectedTire, setSelectedTire] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [sortBy, setSortBy] = useState('brand');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showSalesHistory, setShowSalesHistory] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const shareableContentRef = useRef(null);
  const [showSalesForm, setShowSalesForm] = useState(false);
  const [saleDate, setSaleDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [saleQuantity, setSaleQuantity] = useState(1);


  const filteredAndSortedTires = useMemo(() => {
    return tires
      .filter(tire => 
        tire.brand.toLowerCase().includes(filter.toLowerCase()) ||
        tire.size.toLowerCase().includes(filter.toLowerCase()) ||
        tire.season.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'price') {
          return a.price - b.price;
        }
        return a[sortBy].localeCompare(b[sortBy]);
      });
  }, [tires, filter, sortBy]);

  const handleTireClick = useCallback((tire) => {
    setSelectedTire(tire);
    setSalePrice('');
    setEditMode(false);
    setShowQRCode(false);
    setShowSalesHistory(false);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedTire(null);
    setEditMode(false);
    setShowQRCode(false);
    setShowSalesHistory(false);
    setShowSalesForm(false);
  }, []);

  const handleShare = useCallback(async () => {
    if (selectedTire && shareableContentRef.current) {
      if (!salePrice) {
        setSnackbarMessage('Lütfen satış fiyatı girin.');
        setSnackbarOpen(true);
        return;
      }

      try {
        const canvas = await html2canvas(shareableContentRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        
        canvas.toBlob((blob) => {
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]).then(() => {
            setSnackbarMessage('Lastik detayları panoya kopyalandı!');
            setSnackbarOpen(true);
          });
        });
      } catch (error) {
        console.error('Paylaşım sırasında bir hata oluştu:', error);
        setSnackbarMessage('Paylaşım sırasında bir hata oluştu.');
        setSnackbarOpen(true);
      }
    }
  }, [selectedTire, salePrice]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(tires);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lastikler");
    XLSX.writeFile(workbook, "lastikler.xlsx");
  }, [tires]);

  const handleEdit = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    // Implement the logic to save edited tire information
    setEditMode(false);
    setSnackbarMessage('Lastik bilgileri güncellendi!');
    setSnackbarOpen(true);
  }, []);

   const handleDelete = useCallback(() => {
    // Implement the logic to delete the tire
    setTires(prevTires => prevTires.filter(tire => tire.id !== selectedTire.id));
    setSelectedTire(null);
    setSnackbarMessage('Lastik silindi!');
    setSnackbarOpen(true);
  }, [selectedTire, setTires]);

  const handleGenerateQRCode = useCallback(() => {
    setShowQRCode(true);
  }, []);

  const handleViewSalesHistory = useCallback(() => {
    setShowSalesHistory(true);
  }, []);

  const handleSale = useCallback(() => {
    if (!salePrice || !saleDate || !customerName || saleQuantity <= 0) {
      setSnackbarMessage('Lütfen tüm satış bilgilerini doldurun ve geçerli bir miktar girin.');
      setSnackbarOpen(true);
      return;
    }

    if (saleQuantity > selectedTire.stock) {
      setSnackbarMessage('Satış miktarı stok miktarından fazla olamaz.');
      setSnackbarOpen(true);
      return;
    }

    const newSale = {
      date: saleDate,
      customerName: customerName,
      price: salePrice,
      quantity: saleQuantity,
      size: selectedTire.size,
    };

    setTires(prevTires => prevTires.map(tire => {
      if (tire.id === selectedTire.id) {
        return {
          ...tire,
          stock: tire.stock - saleQuantity,
          salesHistory: [...(tire.salesHistory || []), newSale],
        };
      }
      return tire;
    }));

    setSnackbarMessage('Satış başarıyla kaydedildi!');
    setSnackbarOpen(true);
    setShowSalesForm(false);
    setSalePrice('');
    setSaleDate('');
    setCustomerName('');
    setSaleQuantity(1);
    setSelectedTire(prevTire => ({
      ...prevTire,
      stock: prevTire.stock - saleQuantity,
      salesHistory: [...(prevTire.salesHistory || []), newSale],
    }));
  }, [salePrice, saleDate, customerName, saleQuantity, selectedTire, setTires]);


  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom color="primary" style={{ marginBottom: '20px' }}>
          Lastik Takip Sistemi
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth
              label="Ara..."
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sırala</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sırala"
              >
                <MenuItem value="brand">Marka</MenuItem>
                <MenuItem value="size">Boyut</MenuItem>
                <MenuItem value="year">Yıl</MenuItem>
                <MenuItem value="price">Fiyat</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box mt={2} mb={2}>
          <FormControlLabel
            control={<Switch checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />}
            label="Karanlık Mod"
          />
        </Box>
        <List>
          {filteredAndSortedTires.map((tire) => (
            <StyledListItem key={tire.id} button onClick={() => handleTireClick(tire)}>
              <ListItemAvatar>
                <Avatar src={tire.images[0]} alt={tire.brand} />
              </ListItemAvatar>
              <ListItemText 
                primary={<Typography variant="subtitle1">{`${tire.brand} - ${tire.size}`}</Typography>}
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {`${tire.season} - ${tire.year} - Stok: ${tire.stock}`}
                  </Typography>
                }
              />
            </StyledListItem>
          ))}
        </List>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {/* Yeni lastik ekleme mantığı */}}
          >
            Yeni Lastik Ekle
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<GetAppIcon />}
            onClick={exportToExcel}
          >
            Excel'e Aktar
          </Button>
        </Box>
        <StyledDialog open={selectedTire !== null} onClose={handleClose} maxWidth="md" fullWidth>
          {selectedTire && (
            <>
              <StyledDialogTitle>
                {selectedTire.brand} - {selectedTire.size}
                <IconButton
                  aria-label="kapat"
                  onClick={handleClose}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: '#ffffff',
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </StyledDialogTitle>
              <StyledDialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <ShareableContent ref={shareableContentRef}>
                      <Typography variant="h6" gutterBottom style={{ color: '#343a40', textAlign: 'center' }}>
                        {selectedTire.brand} - {selectedTire.size}
                      </Typography>
                      <Carousel>
                        {selectedTire.images.map((image, index) => (
                          <img 
                            key={index}
                            src={image} 
                            alt={`${selectedTire.brand} ${index + 1}`} 
                            style={{ width: '100%', height: '300px', objectFit: 'contain', marginBottom: '16px' }} 
                          />
                        ))}
                      </Carousel>
                      <Typography variant="body1" gutterBottom style={{ color: '#343a40' }}>
                        <strong>Boyut:</strong> {selectedTire.size}
                      </Typography>
                      <Typography variant="body1" gutterBottom style={{ color: '#343a40' }}>
                        <strong>Yıl:</strong> {selectedTire.year}
                      </Typography>
                      <Typography variant="body1" gutterBottom style={{ color: '#343a40' }}>
                        <strong>Mevsim:</strong> {selectedTire.season}
                      </Typography>
                      <Typography variant="body1" gutterBottom style={{ color: '#343a40' }}>
                        <strong>Stok:</strong> {selectedTire.stock}
                      </Typography>
                      {salePrice && (
                        <Typography variant="body1" gutterBottom style={{ color: '#343a40' }}>
                          <strong>Fiyat:</strong> {salePrice} TL
                        </Typography>
                      )}
                    </ShareableContent>
                  </Grid>
                  <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom style={{ color: '#343a40' }}>Detaylar</Typography>
                    {editMode ? (
                      <>
                        <TextField fullWidth label="Marka" defaultValue={selectedTire.brand} margin="normal" />
                        <TextField fullWidth label="Boyut" defaultValue={selectedTire.size} margin="normal" />
                        <TextField fullWidth label="Yıl" defaultValue={selectedTire.year} margin="normal" />
                        <TextField fullWidth label="Mevsim" defaultValue={selectedTire.season} margin="normal" />
                        <TextField fullWidth label="Alış Fiyatı" defaultValue={selectedTire.price} margin="normal" />
                        <TextField fullWidth label="Stok" defaultValue={selectedTire.stock} margin="normal" />
                        <Button variant="contained" color="primary" onClick={handleSaveEdit} style={{marginTop: '16px'}}>
                          Kaydet
                        </Button>
                      </>
                    ) : (
                      <>
                         <Typography variant="body1" gutterBottom><strong>Marka:</strong> {selectedTire.brand}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Boyut:</strong> {selectedTire.size}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Yıl:</strong> {selectedTire.year}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Mevsim:</strong> {selectedTire.season}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Alış Fiyatı:</strong> {selectedTire.price} TL</Typography>
                        <Typography variant="body1" gutterBottom><strong>Stok:</strong> {selectedTire.stock}</Typography>
                        <TextField
                          fullWidth
                          label="Satış Fiyatı (TL)"
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                          type="number"
                          style={{ marginTop: '16px', marginBottom: '16px' }}
                          variant="outlined"
                        />
                        <Box display="flex" justifyContent="space-between">
                          <Tooltip title="Paylaş">
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<ShareIcon />}
                              onClick={handleShare}
                            >
                              Paylaş
                            </Button>
                          </Tooltip>
                          <Tooltip title="Düzenle">
                            <Button
                              variant="contained"
                              color="secondary"
                              startIcon={<EditIcon />}
                              onClick={handleEdit}
                            >
                              Düzenle
                            </Button>
                          </Tooltip>
                          <Tooltip title="Sil">
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={handleDelete}
                            >
                              Sil
                            </Button>
                          </Tooltip>
                        </Box>
                        <Box mt={2}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => setShowSalesForm(true)}
                          >
                            Satış Yap
                          </Button>
                        </Box>
                        <Box mt={2}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<QrCodeIcon />}
                            onClick={handleGenerateQRCode}
                          >
                            QR Kod Oluştur
                          </Button>
                        </Box>
                        <Box mt={2}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<HistoryIcon />}
                            onClick={handleViewSalesHistory}
                          >
                            Satış Geçmişini Görüntüle
                          </Button>
                        </Box>
                      </>
                    )}
                    {showQRCode && (
                      <Box mt={2} display="flex" justifyContent="center">
                        <QRCode value={JSON.stringify(selectedTire)} size={256} />
                      </Box>
                    )}
                   {showSalesHistory && (
                      <Box mt={2}>
                        <Typography variant="h6">Satış Geçmişi</Typography>
                        {selectedTire.salesHistory && selectedTire.salesHistory.length > 0 ? (
                          <TableContainer component={Paper}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Tarih</TableCell>
                                  <TableCell>Müşteri</TableCell>
                                  <TableCell>Ebat</TableCell>
                                  <TableCell>Adet</TableCell>
                                  <TableCell>Fiyat</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {selectedTire.salesHistory.map((sale, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{sale.date}</TableCell>
                                    <TableCell>{sale.customerName}</TableCell>
                                    <TableCell>{sale.size}</TableCell>
                                    <TableCell>{sale.quantity}</TableCell>
                                    <TableCell>{sale.price} TL</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Typography>Henüz satış geçmişi bulunmamaktadır.</Typography>
                        )}
                      </Box>
                    )}
                 {showSalesForm && (
                      <Box mt={2}>
                        <Typography variant="h6">Yeni Satış</Typography>
                        <TextField
                          fullWidth
                          label="Satış Tarihi"
                          type="date"
                          value={saleDate}
                          onChange={(e) => setSaleDate(e.target.value)}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label="Müşteri Adı Soyadı"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label="Satış Adeti"
                          value={saleQuantity}
                          onChange={(e) => setSaleQuantity(parseInt(e.target.value))}
                          type="number"
                          InputProps={{ inputProps: { min: 1, max: selectedTire.stock } }}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label="Satış Fiyatı (TL)"
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                          type="number"
                          margin="normal"
                        />
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={handleSale}
                          style={{ marginTop: '16px' }}
                        >
                          Satışı Kaydet
                        </Button>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </StyledDialogContent>
            </>
          )}
        </StyledDialog>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="kapat"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </StyledPaper>
    </ThemeProvider>
  );
}

export default TireList;
