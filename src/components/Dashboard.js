import React from 'react';
import { Paper, Typography, Grid, Box, useTheme, useMediaQuery } from '@mui/material';
import { PieChart as PieChartIcon, AttachMoney as AttachMoneyIcon, TrendingUp as TrendingUpIcon, ShowChart as ShowChartIcon } from '@mui/icons-material';

function Dashboard({ tires, sales }) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const totalTires = tires.reduce((sum, tire) => sum + Number(tire.stock), 0);
  const totalValue = tires.reduce((sum, tire) => sum + (Number(tire.price) * Number(tire.stock)), 0);
  const totalSales = sales.reduce((sum, sale) => sum + (Number(sale.price) * Number(sale.quantity)), 0);
  const totalProfit = sales.reduce((sum, sale) => sum + Number(sale.profit), 0);

  return (
    <Paper elevation={6} style={{ padding: '24px', marginBottom: '24px', borderRadius: '12px', backgroundColor: theme.palette.background.paper }}>
      <Typography variant="h4" gutterBottom color="primary">
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Box 
            bgcolor={theme.palette.grey[200]} 
            p={3} 
            borderRadius={2} 
            boxShadow={3} 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{ transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}
          >
            <PieChartIcon color="action" fontSize="large" />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Toplam Lastik Sayısı
              </Typography>
              <Typography variant="h6" color="textPrimary">
                <strong>{totalTires}</strong>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box 
            bgcolor={theme.palette.grey[200]} 
            p={3} 
            borderRadius={2} 
            boxShadow={3} 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{ transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}
          >
            <AttachMoneyIcon color="action" fontSize="large" />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Toplam Stok Değeri
              </Typography>
              <Typography variant="h6" color="textPrimary">
                <strong>{totalValue.toFixed(2)} TL</strong>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box 
            bgcolor={theme.palette.grey[200]} 
            p={3} 
            borderRadius={2} 
            boxShadow={3} 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{ transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}
          >
            <TrendingUpIcon color="action" fontSize="large" />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Toplam Satış
              </Typography>
              <Typography variant="h6" color="textPrimary">
                <strong>{totalSales.toFixed(2)} TL</strong>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box 
            bgcolor={theme.palette.grey[200]} 
            p={3} 
            borderRadius={2} 
            boxShadow={3} 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{ transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}
          >
            <ShowChartIcon color="action" fontSize="large" />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Toplam Kâr
              </Typography>
              <Typography variant="h6" color="textPrimary">
                <strong>{totalProfit.toFixed(2)} TL</strong>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Dashboard;
