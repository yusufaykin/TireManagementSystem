import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Paper, Typography, IconButton, Select, MenuItem, FormControl, InputLabel, Box, Divider } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';

// Örnek veriler (gerçek uygulamada bu veriler API'den gelebilir)
const tireBrands = [
  'Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Pirelli', 'Hankook', 'Yokohama', 
  'Dunlop', 'Toyo', 'Kumho', 'Falken', 'BFGoodrich', 'Nexen', 'Firestone', 'Cooper'
];

const vehicleTypes = ['Otomobil', 'SUV', 'Kamyonet', 'Kamyon', 'Tır', 'Hafriyat', 'Motosiklet', 'Traktör'];

const seasons = ['Yaz', 'Kış', 'Dört Mevsim'];

// Örnek ebat listesi (gerçek uygulamada araç türüne göre dinamik olarak yüklenebilir)
const tireSizes = {
  'Otomobil': ['155/65R13', '175/65R14', '185/65R15', '195/65R15', '205/55R16', '225/45R17', '235/45R18'],
  'SUV': ['215/65R16', '225/65R17', '235/60R18', '255/55R19', '265/50R20'],
  'Kamyonet': ['195R14C', '205/65R16C', '215/65R16C', '225/70R15C'],
  'Kamyon': ['11R22.5', '295/80R22.5', '315/80R22.5', '385/65R22.5'],
  'Tır': ['385/65R22.5', '315/70R22.5', '295/60R22.5', '315/80R22.5'],
  'Hafriyat': ['23.5R25', '26.5R25', '29.5R25', '35/65R33'],
  'Motosiklet': ['120/70R17', '180/55R17', '160/60R17', '190/50R17'],
  'Traktör': ['18.4-30', '12.4-24', '11.2-24', '13.6-38']
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
}));

function TireForm({ addTire }) {
  const [tire, setTire] = useState({
    brand: '',
    vehicleType: '',
    size: '',
    year: '',
    season: '',
    price: '',
    stock: '',
    images: []
  });

  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    if (tire.vehicleType) {
      setAvailableSizes(tireSizes[tire.vehicleType] || []);
    } else {
      setAvailableSizes([]);
    }
  }, [tire.vehicleType]);

  const handleChange = (e) => {
    setTire({ ...tire, [e.target.name]: e.target.value });
  };

  const handleAutocompleteChange = (name, value) => {
    setTire({ ...tire, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }))
    .then(results => {
      setTire(prevTire => ({
        ...prevTire,
        images: [...prevTire.images, ...results]
      }));
    });
  };

  const removeImage = (index) => {
    setTire(prevTire => ({
      ...prevTire,
      images: prevTire.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTire(tire);
    setTire({
      brand: '',
      vehicleType: '',
      size: '',
      year: '',
      season: '',
      price: '',
      stock: '',
      images: []
    });
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
        Yeni Lastik Ekle
      </Typography>
      <Divider style={{ margin: '16px 0' }} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              options={tireBrands}
              renderInput={(params) => <TextField {...params} label="Marka" required />}
              value={tire.brand}
              onChange={(event, newValue) => handleAutocompleteChange('brand', newValue)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Araç Türü</InputLabel>
              <Select
                name="vehicleType"
                value={tire.vehicleType}
                onChange={handleChange}
              >
                {vehicleTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Ebat</InputLabel>
              <Select
                name="size"
                value={tire.size}
                onChange={handleChange}
                disabled={!tire.vehicleType}
              >
                {availableSizes.map((size) => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="year" label="Üretim Yılı" type="number" value={tire.year} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Mevsim</InputLabel>
              <Select
                name="season"
                value={tire.season}
                onChange={handleChange}
              >
                {seasons.map((season) => (
                  <MenuItem key={season} value={season}>{season}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="price" label="Fiyat (TL)" type="number" value={tire.price} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="stock" label="Stok Adedi" type="number" value={tire.stock} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="outlined" component="span" startIcon={<AddPhotoAlternateIcon />}>
                Fotoğraf Ekle
              </Button>
            </label>
            <Box mt={2}>
              <Grid container spacing={2}>
                {tire.images.map((image, index) => (
                  <Grid item key={index}>
                    <Box position="relative" width={100} height={100}>
                      <img src={image} alt={`Lastik ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      <IconButton
                        size="small"
                        style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.7)' }}
                        onClick={() => removeImage(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <StyledButton type="submit" variant="contained" color="primary" size="large" fullWidth>
              Lastik Ekle
            </StyledButton>
          </Grid>
        </Grid>
      </form>
    </StyledPaper>
  );
}

export default TireForm;