import React, { useState, useMemo, useCallback } from 'react';
import { 
  Paper, Typography, Grid, Card, CardContent, Avatar, useTheme, Modal, 
  IconButton, Box, TextField, Button, FormControl, InputLabel, Select, 
  MenuItem, Collapse 
} from '@mui/material';
import { 
  PieChart as PieChartIcon, AttachMoney as AttachMoneyIcon, 
  TrendingUp as TrendingUpIcon, ShowChart as ShowChartIcon, 
  Close as CloseIcon, Inventory as InventoryIcon, 
  Category as CategoryIcon, LocalShipping as LocalShippingIcon, 
  Speed as SpeedIcon, TrendingDown as TrendingDownIcon,
  ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

const StatCard = ({ stat }) => (
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
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box>
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
      </Box>
      <Typography variant="h6" sx={{ 
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        mt: 2,
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
);

function Dashboard({ tires = [], sales = [] }) {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const statistics = useMemo(() => {
    const totalTires = tires.reduce((sum, tire) => sum + (Number(tire.stock) || 0), 0);
    const totalValue = tires.reduce((sum, tire) => sum + ((Number(tire.price) || 0) * (Number(tire.stock) || 0)), 0);
    const totalSales = sales.reduce((sum, sale) => sum + ((Number(sale.price) || 0) * (Number(sale.quantity) || 0)), 0);
    const totalProfit = sales.reduce((sum, sale) => sum + (Number(sale.profit) || 0), 0);
    const uniqueBrands = new Set(tires.map(tire => tire.brand).filter(Boolean)).size;
    const averagePrice = totalTires > 0 ? totalValue / totalTires : 0;

    const tireSales = {};
    sales.forEach(sale => {
      if (tireSales[sale.tireId]) {
        tireSales[sale.tireId] += Number(sale.quantity) || 0;
      } else {
        tireSales[sale.tireId] = Number(sale.quantity) || 0;
      }
    });

    let topSellingTire = { brand: 'Bilinmiyor', model: 'Bilinmiyor', quantity: 0 };
    if (Object.keys(tireSales).length > 0) {
      const topSellingTireId = Object.keys(tireSales).reduce((a, b) => tireSales[a] > tireSales[b] ? a : b);
      const foundTire = tires.find(tire => tire.id === topSellingTireId);
      if (foundTire) {
        topSellingTire = { 
          brand: foundTire.brand || 'Bilinmiyor', 
          model: foundTire.model || 'Bilinmiyor', 
          quantity: tireSales[topSellingTireId] 
        };
      }
    }
    
    const inventoryTurnover = totalValue > 0 ? totalSales / totalValue : 0;

    let lowestStockTire = { brand: 'Bilinmiyor', stock: 0 };
    if (tires.length > 0) {
      lowestStockTire = tires.reduce((min, tire) => 
        (Number(tire.stock) || 0) < (Number(min.stock) || Infinity) ? tire : min
      , {stock: Infinity});
    }

    const averageProfit = totalSales > 0 ? totalProfit / totalSales * 100 : 0;
    const mostExpensiveTire = tires.reduce((max, tire) => (Number(tire.price) > Number(max.price) ? tire : max), { price: 0 });
    const leastProfitableTire = sales.reduce((min, sale) => {
      const profitMargin = (Number(sale.profit) / (Number(sale.price) * Number(sale.quantity))) * 100;
      return profitMargin < min.profitMargin ? { ...sale, profitMargin } : min;
    }, { profitMargin: Infinity });

    return [
      { icon: <PieChartIcon fontSize="large" />, label: 'Toplam Lastik Sayısı', value: totalTires, color: '#3f51b5' },
      { icon: <AttachMoneyIcon fontSize="large" />, label: 'Toplam Stok Değeri', value: `${totalValue.toFixed(2)} TL`, color: '#f44336' },
      { icon: <TrendingUpIcon fontSize="large" />, label: 'Toplam Satış', value: `${totalSales.toFixed(2)} TL`, color: '#4caf50' },
      { icon: <ShowChartIcon fontSize="large" />, label: 'Toplam Kâr', value: `${totalProfit.toFixed(2)} TL`, color: '#ff9800' },
      { icon: <InventoryIcon fontSize="large" />, label: 'Benzersiz Marka Sayısı', value: uniqueBrands, color: '#9c27b0' },
      { icon: <CategoryIcon fontSize="large" />, label: 'Ortalama Lastik Fiyatı', value: `${averagePrice.toFixed(2)} TL`, color: '#2196f3' },
      { icon: <LocalShippingIcon fontSize="large" />, label: 'En Çok Satan Lastik', value: `${topSellingTire.brand} ${topSellingTire.model} (${topSellingTire.quantity} adet)`, color: '#607d8b' },
      { icon: <SpeedIcon fontSize="large" />, label: 'Stok Devir Hızı', value: inventoryTurnover.toFixed(2), color: '#795548' },
      { icon: <TrendingDownIcon fontSize="large" />, label: 'En Düşük Stoklu Lastik', value: `${lowestStockTire.brand || 'Bilinmiyor'} (${lowestStockTire.stock || 0} adet)`, color: '#e91e63' },
      { icon: <TrendingUpIcon fontSize="large" />, label: 'Ortalama Kâr Marjı', value: `${averageProfit.toFixed(2)}%`, color: '#4caf50' },
      { icon: <AttachMoneyIcon fontSize="large" />, label: 'En Pahalı Lastik', value: `${mostExpensiveTire.brand} ${mostExpensiveTire.model} (${Number(mostExpensiveTire.price).toFixed(2)} TL)`, color: '#f44336' },
      { icon: <TrendingDownIcon fontSize="large" />, label: 'En Düşük Kâr Marjlı Satış', value: `${leastProfitableTire.tireId} (${leastProfitableTire.profitMargin.toFixed(2)}%)`, color: '#ff9800' },
    ];
  }, [tires, sales]);

  const salesData = useMemo(() => 
    sales.map(sale => ({
      date: new Date(sale.date).toLocaleDateString(),
      sales: (Number(sale.price) || 0) * (Number(sale.quantity) || 0),
      profit: Number(sale.profit) || 0
    }))
  , [sales]);

  const tireData = useMemo(() => 
    tires.map(tire => ({
      name: tire.name || 'N/A',
      brand: tire.brand || 'N/A',
      size: tire.size || 'N/A',
      stock: Number(tire.stock) || 0,
      value: (Number(tire.price) || 0) * (Number(tire.stock) || 0)
    }))
  , [tires]);

  const handleChartClick = (chartType) => {
    setSelectedChart(chartType);
    setModalOpen(true);
  };

  const handleDateRangeChange = (event) => {
    setDateRange({ ...dateRange, [event.target.name]: event.target.value });
  };

  const filterDataByDateRange = useCallback((data) => {
    if (!dateRange.start || !dateRange.end) return data;
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }, [dateRange]);

  const filterTireData = useCallback((data) => {
    return data.filter(tire => 
      (!selectedBrand || tire.brand === selectedBrand) &&
      (!selectedSize || tire.size === selectedSize)
    );
  }, [selectedBrand, selectedSize]);

  const uniqueBrands = useMemo(() => [...new Set(tires.map(tire => tire.brand))], [tires]);
  const uniqueSizes = useMemo(() => [...new Set(tires.map(tire => tire.size))], [tires]);

  const renderChart = (chartType, height = 300, data = salesData) => {
    const filteredSalesData = filterDataByDateRange(data);
    const filteredTireData = filterTireData(tireData);
    
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={filteredSalesData}>
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
            <BarChart data={filteredSalesData}>
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
            <AreaChart data={filteredSalesData}>
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
        const totalSales = filteredSalesData.reduce((sum, data) => sum + data.sales, 0);
        const totalProfit = filteredSalesData.reduce((sum, data) => sum + data.profit, 0);
        const pieData = [
          { name: 'Satış', value: totalSales },
          { name: 'Kâr', value: totalProfit },
        ];
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
      case 'tire-line':
      case 'tire-bar':
      case 'tire-area':
      case 'tire-pie':
        return renderTireChart(chartType, height, filteredTireData);
      default:
        return null;
    }
  };

  const renderTireChart = (chartType, height, data) => {
    switch (chartType) {
      case 'tire-line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="stock" stroke="#8884d8" name="Stok" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="value" stroke="#82ca9d" name="Değer" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'tire-bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="stock" fill="#8884d8" name="Stok" />
              <Bar yAxisId="right" dataKey="value" fill="#82ca9d" name="Değer" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'tire-area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="stock" stackId="1" stroke="#8884d8" fill="#8884d8" name="Stok" />
              <Area type="monotone" dataKey="value" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Değer" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'tire-pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
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
        Lastik Satış Dashboard'u
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {statistics.slice(0, 4).map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard stat={stat} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {statistics.slice(4).map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index + 4}>
              <StatCard stat={stat} />
            </Grid>
          ))}
        </Grid>
      </Collapse>

      <Typography variant="h5" color="primary" sx={{ 
        mb: 4, 
        textAlign: 'center',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
      }}>
        Satış ve Kâr Grafikleri
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Başlangıç Tarihi"
          type="date"
          name="start"
          value={dateRange.start}
          onChange={handleDateRangeChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Bitiş Tarihi"
          type="date"
          name="end"
          value={dateRange.end}
          onChange={handleDateRangeChange}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="brand-select-label">Marka</InputLabel>
          <Select
            labelId="brand-select-label"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            label="Marka"
          >
            <MenuItem value="">
              <em>Hepsi</em>
            </MenuItem>
            {uniqueBrands.map((brand) => (
              <MenuItem key={brand} value={brand}>{brand}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="size-select-label">Boyut</InputLabel>
          <Select
            labelId="size-select-label"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            label="Boyut"
          >
            <MenuItem value="">
              <em>Hepsi</em>
            </MenuItem>
            {uniqueSizes.map((size) => (
              <MenuItem key={size} value={size}>{size}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          onClick={() => {
            setDateRange({ start: '', end: '' });
            setSelectedBrand('');
            setSelectedSize('');
          }}
          sx={{ height: '56px' }}
        >
          Filtreleri Temizle
        </Button>
      </Box>

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
                  {chartType === 'line' ? 'Satış ve Kâr Çizgi Grafiği' : 
                   chartType === 'bar' ? 'Satış ve Kâr Sütun Grafiği' : 
                   chartType === 'area' ? 'Satış ve Kâr Alan Grafiği' : 'Satış ve Kâr Pasta Grafiği'}
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

      <Typography variant="h5" color="primary" sx={{ 
        mt: 6,
        mb: 4, 
        textAlign: 'center',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
      }}>
        Lastik Stok ve Değer Grafikleri
      </Typography>

      <Grid container spacing={4}>
        {['tire-line', 'tire-bar', 'tire-area', 'tire-pie'].map((chartType) => (
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
                  {chartType === 'tire-line' ? 'Lastik Stok ve Değer Çizgi Grafiği' : 
                   chartType === 'tire-bar' ? 'Lastik Stok ve Değer Sütun Grafiği' : 
                   chartType === 'tire-area' ? 'Lastik Stok ve Değer Alan Grafiği' : 'Lastik Stok ve Değer Pasta Grafiği'}
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
            {selectedChart === 'line' ? 'Satış ve Kâr Çizgi Grafiği' : 
             selectedChart === 'bar' ? 'Satış ve Kâr Sütun Grafiği' : 
             selectedChart === 'area' ? 'Satış ve Kâr Alan Grafiği' : 
             selectedChart === 'pie' ? 'Satış ve Kâr Pasta Grafiği' :
             selectedChart === 'tire-line' ? 'Lastik Stok ve Değer Çizgi Grafiği' : 
             selectedChart === 'tire-bar' ? 'Lastik Stok ve Değer Sütun Grafiği' : 
             selectedChart === 'tire-area' ? 'Lastik Stok ve Değer Alan Grafiği' : 'Lastik Stok ve Değer Pasta Grafiği'}
          </Typography>
          {renderChart(selectedChart, 600)}
        </Box>
      </Modal>
    </Paper>
  );
}

export default Dashboard;