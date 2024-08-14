import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Paper,
  Chip,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import {
  Edit,
  Delete,
  CheckCircle,
  EventNote,
  PictureAsPdf,
  Email,
  Notifications,
  CalendarToday,
  AccessTime,
  Person,
  Phone,
  Note,
} from "@mui/icons-material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import emailjs from 'emailjs-com';

const localizer = momentLocalizer(moment);

const services = [
  "Lastik Değişimi",
  "Balans Ayarı",
  "Rot Ayarı",
  "Fren Bakımı",
  "Yağ Değişimi",
  "Genel Bakım",
];

const AppointmentSystem = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    service: "",
    date: null,
    time: null,
    notes: "",
    sendReminder: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const storedAppointments = localStorage.getItem("appointments");
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleTimeChange = (time) => {
    setFormData({ ...formData, time });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updatedAppointments = appointments.map((app) =>
        app.id === editingId
          ? { ...app, ...formData, status: "Güncellendi" }
          : app
      );
      setAppointments(updatedAppointments);
      setEditingId(null);
      showSnackbar("Randevu başarıyla güncellendi", "success");
    } else {
      const newAppointment = {
        id: Date.now(),
        ...formData,
        status: "Yeni",
      };
      setAppointments([...appointments, newAppointment]);
      showSnackbar("Yeni randevu başarıyla eklendi", "success");
    }
    setFormData({
      customerName: "",
      phoneNumber: "",
      email: "",
      service: "",
      date: null,
      time: null,
      notes: "",
      sendReminder: false,
    });
  };

  const handleEdit = (appointment) => {
    setFormData(appointment);
    setEditingId(appointment.id);
    setTabValue(0);
  };

  const handleDelete = (id) => {
    setAppointments(appointments.filter((app) => app.id !== id));
    showSnackbar("Randevu silindi", "info");
  };

  const handleComplete = (id) => {
    const updatedAppointments = appointments.map((app) =>
      app.id === id ? { ...app, status: "Tamamlandı" } : app
    );
    setAppointments(updatedAppointments);
    showSnackbar("Randevu tamamlandı olarak işaretlendi", "success");
  };

  const handleOpenDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredAppointments = filterStatus
    ? appointments.filter((app) => app.status === filterStatus)
    : appointments;

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Müşteri Adı",
          "Telefon",
          "E-posta",
          "Hizmet",
          "Tarih",
          "Saat",
          "Durum",
        ],
      ],
      body: appointments.map((app) => [
        app.customerName,
        app.phoneNumber,
        app.email,
        app.service,
        new Date(app.date).toLocaleDateString(),
        new Date(app.time).toLocaleTimeString(),
        app.status,
      ]),
    });
    doc.save("randevular.pdf");
  };

  const sendReminderEmail = (appointment) => {
    console.log(`Hatırlatma e-postası gönderildi: ${appointment.email}`);
    showSnackbar(`Hatırlatma e-postası gönderildi: ${appointment.email}`, "success");
  };

  const calendarEvents = appointments.map((app) => ({
    id: app.id,
    title: `${app.customerName} - ${app.service}`,
    start: new Date(app.date + "T" + app.time),
    end: moment(new Date(app.date + "T" + app.time))
      .add(1, "hours")
      .toDate(),
    resource: app,
  }));

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          mb: 4,
          fontWeight: "bold",
          color: "#1976d2",
        }}
      >
        Kurumsal Randevu Yönetim Sistemi
      </Typography>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Randevu Ekle/Düzenle" />
          <Tab label="Randevu Listesi" />
          <Tab label="Takvim Görünümü" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Müşteri Adı"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <Person color="action" />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefon Numarası"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <Phone color="action" />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="E-posta"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <Email color="action" />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Hizmet</InputLabel>
                  <Select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                  >
                    {services.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Tarih"
                    value={formData.date}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <CalendarToday color="action" />,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Saat"
                    value={formData.time}
                    onChange={handleTimeChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <AccessTime color="action" />,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notlar"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: <Note color="action" />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.sendReminder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sendReminder: e.target.checked,
                        })
                      }
                      name="sendReminder"
                      color="primary"
                    />
                  }
                  label="Hatırlatma E-postası Gönder"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {editingId ? "Randevuyu Güncelle" : "Randevu Ekle"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Durum Filtrele</InputLabel>
              <Select value={filterStatus} onChange={handleStatusFilterChange}>
                <MenuItem value="">Tümü</MenuItem>
                <MenuItem value="Yeni">Yeni</MenuItem>
                <MenuItem value="Güncellendi">Güncellendi</MenuItem>
                <MenuItem value="Tamamlandı">Tamamlandı</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="secondary"
              onClick={exportToPDF}
              startIcon={<PictureAsPdf />}
            >
              PDF İndir
            </Button>
          </Box>

          <Grid container spacing={3}>
            {filteredAppointments.map((appointment) => (
              <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                <Card
                  raised
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#ffffff",
                    borderLeft: 6,
                    borderColor:
                      appointment.status === "Tamamlandı"
                        ? "#4caf50"
                        : appointment.status === "Güncellendi"
                        ? "#ff9800"
                        : "#2196f3",
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {appointment.customerName}
                      </Typography>
                      <Chip
                        label={appointment.status}
                        color={
                          appointment.status === "Tamamlandı"
                            ? "success"
                            : appointment.status === "Güncellendi"
                            ? "warning"
                            : "info"
                        }
                        size="small"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Phone
                        fontSize="small"
                        sx={{ mr: 1, color: "#757575" }}
                      />{" "}
                      {appointment.phoneNumber}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Email
                        fontSize="small"
                        sx={{ mr: 1, color: "#757575" }}
                      />{" "}
                      {appointment.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        color: "#1976d2",
                        fontWeight: "medium",
                      }}
                    >
                      <EventNote fontSize="small" sx={{ mr: 1 }} />{" "}
                      {appointment.service}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <CalendarToday
                        fontSize="small"
                        sx={{ mr: 1, color: "#757575" }}
                      />
                      {new Date(appointment.date).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <AccessTime
                        fontSize="small"
                        sx={{ mr: 1, color: "#757575" }}
                      />
                      {new Date(appointment.time).toLocaleTimeString()}
                    </Typography>
                    {appointment.notes && (
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          fontStyle: "italic",
                          color: "#616161",
                        }}
                      >
                        <Note fontSize="small" sx={{ mr: 1 }} />
                        {appointment.notes}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      backgroundColor: "#f5f5f5",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    <Box>
                      <Tooltip title="Düzenle">
                        <IconButton
                          onClick={() => handleEdit(appointment)}
                          size="small"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Tamamlandı olarak işaretle">
                        <IconButton
                          onClick={() => handleComplete(appointment.id)}
                          size="small"
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sil">
                        <IconButton
                          onClick={() => handleDelete(appointment.id)}
                          size="small"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box>
                      <Tooltip title="Detaylar">
                        <IconButton
                          onClick={() => handleOpenDialog(appointment)}
                          size="small"
                        >
                          <EventNote fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {appointment.sendReminder && (
                        <Tooltip title="Hatırlatma E-postası Gönder">
                          <IconButton
                            onClick={() => sendReminderEmail(appointment)}
                            size="small"
                          >
                            <Notifications fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper elevation={3} sx={{ p: 3, height: 600 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            onSelectEvent={(event) => handleOpenDialog(event.resource)}
          />
        </Paper>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Randevu Detayları</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {selectedAppointment.customerName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Telefon:</strong> {selectedAppointment.phoneNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>E-posta:</strong> {selectedAppointment.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Hizmet:</strong> {selectedAppointment.service}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Tarih:</strong>{" "}
                  {new Date(selectedAppointment.date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Saat:</strong>{" "}
                  {new Date(selectedAppointment.time).toLocaleTimeString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Durum:</strong> {selectedAppointment.status}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>Notlar:</strong> {selectedAppointment.notes}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Kapat</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppointmentSystem;