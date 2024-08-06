import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

function TireForm({ addTire }) {
  const [tire, setTire] = useState({
    brand: '',
    size: '',
    year: '',
    season: '',
    price: '',
    stock: '',
    images: []
  });

  const handleChange = (e) => {
    setTire({ ...tire, [e.target.name]: e.target.value });
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
    setTire({ brand: '', size: '', year: '', season: '', price: '', stock: '', images: [] });
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="h6" gutterBottom color="primary">
        Yeni Lastik Ekle
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="brand" label="Marka" value={tire.brand} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="size" label="Ebat" value={tire.size} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="year" label="Yıl" value={tire.year} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="season" label="Mevsim" value={tire.season} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="price" label="Fiyat" type="number" value={tire.price} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth name="stock" label="Stok" type="number" value={tire.stock} onChange={handleChange} required />
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
              <Button variant="contained" component="span" startIcon={<AddPhotoAlternateIcon />}>
                Fotoğraf Ekle
              </Button>
            </label>
            <Grid container spacing={1} style={{ marginTop: '10px' }}>
              {tire.images.map((image, index) => (
                <Grid item key={index}>
                  <div style={{ position: 'relative' }}>
                    <img src={image} alt={`Lastik ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    <IconButton
                      size="small"
                      style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.7)' }}
                      onClick={() => removeImage(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Lastik Ekle
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default TireForm;