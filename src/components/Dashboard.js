import React, { useState } from 'react';
import { Paper, Typography, Grid, Card, CardContent, Avatar, useTheme, Modal, IconButton, Box } from '@mui/material';
import { PieChart as PieChartIcon, AttachMoney as AttachMoneyIcon, TrendingUp as TrendingUpIcon, ShowChart as ShowChartIcon, Close as CloseIcon } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

function Dashboard({ tires, sales }) {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);

  const totalTires = tires.reduce((sum, tire) => sum + Number(tire.stock), 0);
  const totalValue = tires.reduce((sum, tire) => sum + (Number(tire.price) * Number(tire.stock)), 0);
  const totalSales = sales.reduce((sum, sale) => sum + (Number(sale.price) * Number(sale.quantity)), 0);
  const totalProfit = sales.reduce((sum, sale) => sum + Number(sale.profit), 0);

  const statistics = [
    { icon: <PieChartIcon fontSize="large" />, label: 'Toplam Lastik Sayısı', value: totalTires, color: '#3f51b5' },
    { icon: <AttachMoneyIcon fontSize="large" />, label: 'Toplam Stok Değeri', value: `${totalValue.toFixed(2)} TL`, color: '#f44336' },
    { icon: <TrendingUpIcon fontSize="large" />, label: 'Toplam Satış', value: `${totalSales.toFixed(2)} TL`, color: '#4caf50' },
    { icon: <ShowChartIcon fontSize="large" />, label: 'Toplam Kâr', value: `${totalProfit.toFixed(2)} TL`, color: '#ff9800' },
  ];

  const salesData = sales.map(sale => ({
    date: new Date(sale.date).toLocaleDateString(),
    sales: Number(sale.price) * Number(sale.quantity),
    profit: Number(sale.profit)
  }));

  const handleChartClick = (chartType) => {
    setSelectedChart(chartType);
    setModalOpen(true);
  };

  const renderChart = (chartType, height = 300) => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" name="Satış" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#82ca9d" name="Kâr" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="Satış" />
              <Bar yAxisId="right" dataKey="profit" fill="#82ca9d" name="Kâr" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="sales" stackId="1" stroke="#8884d8" fill="#8884d8" name="Satış" />
              <Area type="monotone" dataKey="profit" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Kâr" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'pie':
        const totalSales = salesData.reduce((sum, data) => sum + data.sales, 0);
        const totalProfit = salesData.reduce((sum, data) => sum + data.profit, 0);
        const pieData = [
          { name: 'Satış', value: totalSales },
          { name: 'Kâr', value: totalProfit },
        ];
        const COLORS = ['#0088FE', '#00C49F'];
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={6} sx={{ 
      p: 4, 
      mb: 4, 
      borderRadius: 4, 
      bgcolor: theme.palette.background.default, 
      position: 'relative',
      backgroundImage: 'linear-gradient(to bottom right, rgba(63, 81, 181, 0.1), rgba(255, 152, 0, 0.1))',
    }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ 
        fontWeight: 'bold', 
        mb: 4, 
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {statistics.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                bgcolor: stat.color,
                color: 'white',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                borderRadius: 3,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px) scale(1.02)',
                  boxShadow: '0 12px 20px 0 rgba(0,0,0,0.2)',
                },
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.4)', 
                  width: 60, 
                  height: 60, 
                  mb: 2,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  {stat.icon}
                </Avatar>
                <Typography variant="body1" sx={{ 
                  fontWeight: 'medium', 
                  fontSize: '1.1rem', 
                  mb: 1,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>
                  {stat.label}
                </Typography>
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>
                  {stat.value}
                </Typography>
              </CardContent>
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  right: 0, 
                  width: '50%', 
                  height: '100%', 
                  background: 'rgba(255,255,255,0.1)', 
                  transform: 'skew(-20deg) translateX(50%)',
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" color="primary" sx={{ 
        mb: 4, 
        textAlign: 'center',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
      }}>
        Satış ve Kâr Grafikleri
      </Typography>

      <Grid container spacing={4}>
        {['line', 'bar', 'area', 'pie'].map((chartType) => (
          <Grid item xs={12} md={6} key={chartType}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                },
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
              }}
              onClick={() => handleChartClick(chartType)}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>
                  {chartType === 'line' ? 'Çizgi Grafiği' : 
                   chartType === 'bar' ? 'Sütun Grafiği' : 
                   chartType === 'area' ? 'Alan Grafiği' : 'Pasta Grafiği'}
                </Typography>
                {renderChart(chartType)}
              </CardContent>
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '5px', 
                  background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '90%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
        }}>
          <IconButton
            aria-label="close"
            onClick={() => setModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ 
            mb: 2,
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            {selectedChart === 'line' ? 'Çizgi Grafiği' : 
             selectedChart === 'bar' ? 'Sütun Grafiği' : 
             selectedChart === 'area' ? 'Alan Grafiği' : 'Pasta Grafiği'}
          </Typography>
          {renderChart(selectedChart, 600)}
        </Box>
      </Modal>
    </Paper>
  );
}

export default Dashboard;