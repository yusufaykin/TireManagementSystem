import React from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';

function HomePage() {
  return (
    <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="h4" gutterBottom color="primary">
        Hoşgeldiniz
      </Typography>
      <Typography variant="body1" paragraph>
        Lastik Stok Takip Sistemimize hoş geldiniz. Firmamız, yüksek kaliteli lastik satışı ve depolama hizmetleri sunmaktadır.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box bgcolor="background.default" p={2} borderRadius={1}>
            <Typography variant="h6" gutterBottom>
              Lastik Satışı
            </Typography>
            <Typography variant="body2">
              Geniş ürün yelpazemizle her türlü araca uygun lastikleri sunuyoruz. Uzman ekibimiz, size en uygun lastiği seçmenizde yardımcı olacaktır.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box bgcolor="background.default" p={2} borderRadius={1}>
            <Typography variant="h6" gutterBottom>
              Lastik Oteli
            </Typography>
            <Typography variant="body2">
              Mevsimlik lastiklerinizi güvenle saklıyoruz. Lastik oteli hizmetimizle, lastiklerinizi uygun koşullarda muhafaza ediyor ve ihtiyacınız olduğunda hazır hale getiriyoruz.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default HomePage;