import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Paper, Grid, Typography, Dialog, DialogActions,
    DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText,
    Divider, FormControl, InputLabel, Select, MenuItem, Tooltip, Snackbar,
    Alert, Avatar, Card, CardContent, Box, Chip, AppBar, Toolbar, Container
} from '@mui/material';
import {
    Add, Search, Edit, Delete, Download, DirectionsCar, Build,
    EventNote, AttachMoney, Notifications
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, addDays, isBefore, isAfter } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const VehicleTracking = () => {
    const [vehicles, setVehicles] = useState([]);
    const [searchPlate, setSearchPlate] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [newService, setNewService] = useState({
        customerName: '',
        licensePlate: '',
        date: new Date(),
        mechanicName: '',
        workDone: '',
        cost: '',
        nextServiceDate: addDays(new Date(), 180), // Default to 6 months later
    });
    const [openForm, setOpenForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [filter, setFilter] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [statistics, setStatistics] = useState({
        totalVehicles: 0,
        totalServices: 0,
        totalRevenue: 0,
    });
    const [upcomingServices, setUpcomingServices] = useState([]);

    useEffect(() => {
        const savedVehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        setVehicles(savedVehicles);
        updateStatistics(savedVehicles);
        updateUpcomingServices(savedVehicles);
    }, []);

    useEffect(() => {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        updateStatistics(vehicles);
        updateUpcomingServices(vehicles);
    }, [vehicles]);

    const updateStatistics = (vehicleData) => {
        const totalVehicles = vehicleData.length;
        let totalServices = 0;
        let totalRevenue = 0;

        vehicleData.forEach(vehicle => {
            totalServices += vehicle.services.length;
            vehicle.services.forEach(service => {
                totalRevenue += parseFloat(service.cost);
            });
        });

        setStatistics({ totalVehicles, totalServices, totalRevenue });
    };

    const updateUpcomingServices = (vehicleData) => {
        const upcoming = vehicleData.flatMap(vehicle =>
            vehicle.services
                .filter(service => isAfter(new Date(service.nextServiceDate), new Date()))
                .map(service => ({
                    ...service,
                    licensePlate: vehicle.licensePlate
                }))
        ).sort((a, b) => new Date(a.nextServiceDate) - new Date(b.nextServiceDate));

        setUpcomingServices(upcoming.slice(0, 5)); // Show top 5 upcoming services
    };

    const handleSearch = () => {
        const vehicle = vehicles.find(v => v.licensePlate.toLowerCase() === searchPlate.toLowerCase());
        if (vehicle) {
            setSelectedVehicle(vehicle);
            showSnackbar('Araç bulundu.', 'success');
        } else {
            setSelectedVehicle({ licensePlate: searchPlate, services: [] });
            showSnackbar('Yeni araç kaydı oluşturuldu.', 'info');
        }
    };

    const handleAddService = () => {
        if (Object.values(newService).some(field => field === '')) {
            showSnackbar('Lütfen tüm alanları doldurun.', 'error');
            return;
        }
        const formattedService = {
            ...newService,
            date: format(newService.date, 'yyyy-MM-dd'),
            nextServiceDate: format(newService.nextServiceDate, 'yyyy-MM-dd'),
        };
        const updatedVehicle = {
            ...selectedVehicle,
            services: [...selectedVehicle.services, formattedService]
        };
        setVehicles(prevVehicles => {
            const updatedVehicles = prevVehicles.some(v => v.licensePlate === updatedVehicle.licensePlate)
                ? prevVehicles.map(v => v.licensePlate === updatedVehicle.licensePlate ? updatedVehicle : v)
                : [...prevVehicles, updatedVehicle];
            return updatedVehicles;
        });
        setSelectedVehicle(updatedVehicle);
        resetNewServiceForm();
        setOpenForm(false);
        showSnackbar('Yeni servis başarıyla eklendi.', 'success');
    };

    const handleEditService = (service, index) => {
        const updatedServices = [...selectedVehicle.services];
        updatedServices[index] = service;
        const updatedVehicle = { ...selectedVehicle, services: updatedServices };
        setVehicles(vehicles.map(v => v.licensePlate === updatedVehicle.licensePlate ? updatedVehicle : v));
        setSelectedVehicle(updatedVehicle);
        setEditingService(null);
        showSnackbar('Servis başarıyla güncellendi.', 'success');
    };

    const handleDeleteService = (index) => {
        const updatedVehicle = {
            ...selectedVehicle,
            services: selectedVehicle.services.filter((_, i) => i !== index)
        };
        setVehicles(vehicles.map(v => v.licensePlate === updatedVehicle.licensePlate ? updatedVehicle : v));
        setSelectedVehicle(updatedVehicle);
        showSnackbar('Servis başarıyla silindi.', 'success');
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Araç Servis Geçmişi - ${selectedVehicle.licensePlate}`, 14, 22);
        doc.setFontSize(12);
        doc.text(`Oluşturulma Tarihi: ${format(new Date(), 'dd.MM.yyyy')}`, 14, 32);

        const services = selectedVehicle.services.map(service => [
            service.date,
            service.mechanicName,
            service.workDone,
            `₺${service.cost}`,
            service.nextServiceDate
        ]);

        doc.autoTable({
            head: [['Tarih', 'Usta Adı', 'Yapılan İşlem', 'Ücret', 'Sonraki Servis']],
            body: services,
            startY: 40,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [66, 139, 202] },
        });

        doc.save(`${selectedVehicle.licensePlate}_Servis_Gecmisi.pdf`);
    };

    const getChartData = () => {
        const dates = selectedVehicle.services.map(s => s.date);
        const costs = selectedVehicle.services.map(s => parseFloat(s.cost));

        return {
            labels: dates,
            datasets: [
                {
                    label: 'Servis Maliyeti',
                    data: costs,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        };
    };

    const resetNewServiceForm = () => {
        setNewService({
            customerName: '',
            licensePlate: '',
            date: new Date(),
            mechanicName: '',
            workDone: '',
            cost: '',
            nextServiceDate: addDays(new Date(), 180),
        });
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <DirectionsCar sx={{ mr: 2 }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Araç Takip Sistemi
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        İstatistikler
                                    </Typography>
                                    <Typography variant="body1">
                                        Toplam Araç: {statistics.totalVehicles}
                                    </Typography>
                                    <Typography variant="body1">
                                        Toplam Servis: {statistics.totalServices}
                                    </Typography>
                                    <Typography variant="body1">
                                        Toplam Gelir: ₺{statistics.totalRevenue.toFixed(2)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Yaklaşan Servisler
                                    </Typography>
                                    {upcomingServices.map((service, index) => (
                                        <Chip
                                            key={index}
                                            icon={<Notifications />}
                                            label={`${service.licensePlate} - ${service.nextServiceDate}`}
                                            color="primary"
                                            variant="outlined"
                                            sx={{ m: 0.5 }}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            label="Plakaya Göre Ara"
                                            value={searchPlate}
                                            onChange={(e) => setSearchPlate(e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            startIcon={<Search />} 
                                            onClick={handleSearch}
                                            fullWidth
                                        >
                                            Ara
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {selectedVehicle && (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Araç Bilgileri - {selectedVehicle.licensePlate}
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Filtrele</InputLabel>
                                                <Select
                                                    value={filter}
                                                    onChange={(e) => setFilter(e.target.value)}
                                                >
                                                    <MenuItem value="">Tümü</MenuItem>
                                                    <MenuItem value="recent">Son Eklenenler</MenuItem>
                                                    <MenuItem value="upcoming">Yaklaşan Servisler</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {selectedVehicle.services.length > 0 ? (
                                                <List>
                                                    {selectedVehicle.services
                                                        .filter(service => {
                                                            if (filter === 'recent') {
                                                                return isAfter(new Date(service.date), addDays(new Date(), -30));
                                                            } else if (filter === 'upcoming') {
                                                                return isAfter(new Date(service.nextServiceDate), new Date()) &&
                                                                    isBefore(new Date(service.nextServiceDate), addDays(new Date(), 30));
                                                            }
                                                            return true;
                                                        })
                                                        .map((service, index) => (
                                                        <React.Fragment key={index}>
                                                            <ListItem>
                                                                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                                                    {service.mechanicName[0]}
                                                                </Avatar>
                                                                <ListItemText
                                                                    primary={
                                                                        <Typography variant="subtitle1">
                                                                            {service.date} - {service.workDone}
                                                                            <Chip 
                                                                                label={`₺${service.cost}`}
                                                                                size="small"
                                                                                color="primary"
                                                                                sx={{ ml: 1 }}
                                                                            />
                                                                        </Typography>
                                                                    }
                                                                    secondary={
                                                                        <>
                                                                            <Typography variant="body2">
                                                                                Usta: {service.mechanicName}
                                                                            </Typography>
                                                                            <Typography variant="body2">
                                                                                Sonraki Servis: {service.nextServiceDate}
                                                                            </Typography>
                                                                        </>
                                                                    }
                                                                />
                                                                <Tooltip title="Düzenle">
                                                                    <IconButton color="primary" onClick={() => setEditingService({ ...service, index })}>
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Sil">
                                                                    <IconButton color="secondary" onClick={() => handleDeleteService(index)}>
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </ListItem>
                                                            <Divider />
                                                        </React.Fragment>
                                                    ))}
                                                </List>
                                            ) : (
                                                <Typography>Bu araç için işlem bulunamadı.</Typography>
                                            )}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<Add />}
                                                onClick={() => setOpenForm(true)}
                                                sx={{ mt: 2, mr: 1 }}
                                            >
                                                Yeni İşlem Ekle
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                startIcon={<Download />}
                                                onClick={generatePDF}
                                                sx={{ mt: 2 }}
                                            >
                                                PDF İndir
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" gutterBottom>Servis Maliyet Grafiği</Typography>
                                            {selectedVehicle.services.length > 0 ? (
                                                <Line data={getChartData()} />
                                            ) : (
                                                <Typography>Grafik için yeterli veri yok.</Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>


        <Dialog open={openForm} onClose={() => setOpenForm(false)}>
            <DialogTitle>Yeni İşlem Ekle</DialogTitle>
            <DialogContent>
                <TextField
                    label="Müşteri Adı"
                    value={newService.customerName}
                    onChange={(e) => setNewService({ ...newService, customerName: e.target.value })}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Plaka"
                    value={newService.licensePlate}
                    onChange={(e) => setNewService({ ...newService, licensePlate: e.target.value })}
                    fullWidth
                    margin="dense"
                />
                <DatePicker
                    label="Tarih"
                    value={newService.date}
                    onChange={(newDate) => setNewService({ ...newService, date: newDate })}
                    renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                />
                <TextField
                    label="Usta Adı"
                    value={newService.mechanicName}
                    onChange={(e) => setNewService({ ...newService, mechanicName: e.target.value })}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Yapılan İşlem"
                    value={newService.workDone}
                    onChange={(e) => setNewService({ ...newService, workDone: e.target.value })}
                    fullWidth
                    margin="dense"
                    multiline
                    rows={3}
                />
                <TextField
                    label="Ücret"
                    value={newService.cost}
                    onChange={(e) => setNewService({ ...newService, cost: e.target.value })}
                    fullWidth
                    margin="dense"
                    type="number"
                />
                <DatePicker
                    label="Sonraki Servis Tarihi"
                    value={newService.nextServiceDate}
                    onChange={(newDate) => setNewService({ ...newService, nextServiceDate: newDate })}
                    renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddService} color="primary">
                    Ekle
                </Button>
                <Button onClick={() => setOpenForm(false)} color="secondary">
                    İptal
                </Button>
            </DialogActions>
        </Dialog>

        {editingService && (
            <Dialog open={!!editingService} onClose={() => setEditingService(null)}>
                <DialogTitle>Servisi Düzenle</DialogTitle>
                <DialogContent>
                    <DatePicker
                        label="Tarih"
                        value={new Date(editingService.date)}
                        onChange={(newDate) => setEditingService({ ...editingService, date: format(newDate, 'yyyy-MM-dd') })}
                        renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                    />
                    <TextField
                        label="Usta Adı"
                        value={editingService.mechanicName}
                        onChange={(e) => setEditingService({ ...editingService, mechanicName: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Yapılan İşlem"
                        value={editingService.workDone}
                        onChange={(e) => setEditingService({ ...editingService, workDone: e.target.value })}
                        fullWidth
                        margin="dense"
                        multiline
                        rows={3}
                    />
                    <TextField
                        label="Ücret"
                        value={editingService.cost}
                        onChange={(e) => setEditingService({ ...editingService, cost: e.target.value })}
                        fullWidth
                        margin="dense"
                        type="number"
                    />
                    <DatePicker
                        label="Sonraki Servis Tarihi"
                        value={new Date(editingService.nextServiceDate)}
                        onChange={(newDate) => setEditingService({ ...editingService, nextServiceDate: format(newDate, 'yyyy-MM-dd') })}
                        renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEditService(editingService, editingService.index)} color="primary">
                        Değişiklikleri Kaydet
                    </Button>
                    <Button onClick={() => setEditingService(null)} color="secondary">
                        İptal
                    </Button>
                </DialogActions>
            </Dialog>
        )}

                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </LocalizationProvider>
    );
};

export default VehicleTracking;