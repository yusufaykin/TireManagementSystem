import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Grid, Typography, Paper, TextField, Button, List, ListItem,
  ListItemText, Divider, IconButton, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Slide, Avatar, Chip, Tooltip, useTheme,
  useMediaQuery, Box, Card, CardContent, TableContainer, Table, TableHead,
  TableRow, TableCell, TableBody, Menu, MenuItem, TableSortLabel, TablePagination,
  AppBar, Toolbar, CssBaseline, Drawer, ListItemIcon, Tabs, Tab, FormControl,
  InputLabel, Select, Switch, FormControlLabel, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccountBalance as AccountBalanceIcon,
  AccountCircle as AccountCircleIcon,
  AttachMoney as AttachMoneyIcon,
  MoneyOff as MoneyOffIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  History as HistoryIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  ImportExport as ImportExportIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import Fab from '@mui/material/Fab';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(TextField)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const AccountCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const CurrentAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [accountDetails, setAccountDetails] = useState({
    name: '',
    receivable: 0,
    payable: 0,
    email: '',
    phone: '',
    address: '',
    taxId: '',
    category: '',
  });
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    type: 'receivable',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      // Simulating API call
      const response = await new Promise(resolve => 
        setTimeout(() => resolve(JSON.parse(localStorage.getItem('accounts')) || []), 1000)
      );
      setAccounts(response);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      showSnackbar('Hesaplar yüklenirken bir hata oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  const handleOpenDialog = (account = null) => {
    setSelectedAccount(account);
    if (account) {
      setAccountDetails(account);
    } else {
      setAccountDetails({
        name: '',
        receivable: 0,
        payable: 0,
        email: '',
        phone: '',
        address: '',
        taxId: '',
        category: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveAccount = () => {
    if (selectedAccount) {
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc.id === selectedAccount.id ? { ...accountDetails, id: acc.id } : acc
        )
      );
      showSnackbar('Hesap başarıyla güncellendi.', 'success');
    } else {
      setAccounts((prevAccounts) => [
        ...prevAccounts,
        { ...accountDetails, id: Date.now(), transactions: [] },
      ]);
      showSnackbar('Yeni hesap başarıyla eklendi.', 'success');
    }
    setOpenDialog(false);
  };

  const handleDeleteAccount = (id) => {
    setAccounts((prevAccounts) => prevAccounts.filter((acc) => acc.id !== id));
    handleCloseMenu();
    showSnackbar('Hesap başarıyla silindi.', 'success');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAccountDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name === 'receivable' || name === 'payable' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSort = (column) => {
    setSortBy(column);
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  const handleOpenMenu = (event, accountId) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccountId(accountId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAccountId(null);
  };

  const handleOpenTransactionDialog = () => {
    setOpenTransactionDialog(true);
    handleCloseMenu();
  };

  const handleCloseTransactionDialog = () => {
    setOpenTransactionDialog(false);
  };

  const handleTransactionChange = (event) => {
    const { name, value } = event.target;
    setTransactionDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSaveTransaction = () => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (acc.id === selectedAccountId) {
          const updatedAccount = {
            ...acc,
            transactions: [
              ...acc.transactions,
              { ...transactionDetails, id: Date.now() },
            ],
          };
          updatedAccount[transactionDetails.type] += transactionDetails.amount;
          return updatedAccount;
        }
        return acc;
      })
    );
    setOpenTransactionDialog(false);
    showSnackbar('İşlem başarıyla kaydedildi.', 'success');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
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

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((account) =>
        account.name.toLowerCase().includes(filter.toLowerCase()) ||
        account.email.toLowerCase().includes(filter.toLowerCase()) ||
        account.phone.includes(filter)
      )
      .sort((a, b) => {
        if (sortDirection === 'asc') {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });
  }, [accounts, filter, sortBy, sortDirection]);

  const paginatedAccounts = filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalReceivables = accounts.reduce(
    (sum, account) => sum + parseFloat(account.receivable),
    0
  );

  const totalPayables = accounts.reduce(
    (sum, account) => sum + parseFloat(account.payable),
    0
  );
  const netBalance = totalReceivables - totalPayables;

  const pieChartData = [
    { name: 'Alacaklar', value: totalReceivables },
    { name: 'Borçlar', value: totalPayables },
  ];

  const barChartData = accounts.map((account) => ({
    name: account.name,
    Alacak: account.receivable,
    Borç: account.payable,
  }));

  const lineChartData = accounts.flatMap(account =>
    account.transactions.map(transaction => ({
      date: new Date(transaction.date).toLocaleDateString(),
      amount: transaction.type === 'receivable' ? transaction.amount : -transaction.amount,
      accountName: account.name
    }))
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Cari Hesap Raporu", 20, 10);
    
    const tableColumn = ["Hesap Adı", "Alacak", "Borç", "Bakiye"];
    const tableRows = accounts.map(account => [
      account.name,
      account.receivable.toFixed(2),
      account.payable.toFixed(2),
      (account.receivable - account.payable).toFixed(2)
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("cari_hesap_raporu.pdf");
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Hesap Adı,Alacak,Borç,Bakiye\n"
      + accounts.map(account => 
          `${account.name},${account.receivable},${account.payable},${account.receivable - account.payable}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cari_hesap_raporu.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={openDrawer}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(openDrawer && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Cari Hesap Yönetim Paneli
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Ara…"
              inputProps={{ 'aria-label': 'search' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Search>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleToggleDarkMode} />}
            label="Karanlık Mod"
          />
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={openDrawer}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem button onClick={() => setCurrentTab(0)}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Genel Bakış" />
          </ListItem>
          <ListItem button onClick={() => setCurrentTab(1)}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Hesaplar" />
          </ListItem>
          <ListItem button onClick={() => setCurrentTab(2)}>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="İşlem Geçmişi" />
          </ListItem>
          <ListItem button onClick={() => setCurrentTab(3)}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Raporlar" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Ayarlar" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Çıkış" />
          </ListItem>
        </List>
      </Drawer>
      <Main open={openDrawer}>
        <DrawerHeader />
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Genel Bakış" />
          <Tab label="Hesaplar" />
          <Tab label="İşlem Geçmişi" />
          <Tab label="Raporlar" />
        </Tabs>
        {currentTab === 0 && (
          <>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={3}>
                <MetricCard elevation={3}>
                  <Typography variant="h6" gutterBottom>
                    Toplam Alacak
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {totalReceivables.toFixed(2)} ₺
                  </Typography>
                </MetricCard>
              </Grid>
              <Grid item xs={12} md={3}>
                <MetricCard elevation={3}>
                  <Typography variant="h6" gutterBottom>
                    Toplam Borç
                  </Typography>
                  <Typography variant="h4" color="error">
                    {totalPayables.toFixed(2)} ₺
                  </Typography>
                </MetricCard>
              </Grid>
              <Grid item xs={12} md={3}>
                <MetricCard elevation={3}>
                  <Typography variant="h6" gutterBottom>
                    Net Durum
                  </Typography>
                  <Typography variant="h4" color={netBalance >= 0 ? 'success' : 'error'}>
                    {netBalance.toFixed(2)} ₺
                  </Typography>
                </MetricCard>
              </Grid>
              <Grid item xs={12} md={3}>
                <MetricCard elevation={3}>
                  <Typography variant="h6" gutterBottom>
                    Toplam Hesap
                  </Typography>
                  <Typography variant="h4">
                    {accounts.length}
                  </Typography>
                </MetricCard>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Alacak/Borç Dağılımı
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Hesap Bazlı Alacak/Borç Durumu
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="Alacak" fill="#8884d8" />
                      <Bar dataKey="Borç" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {currentTab === 1 && (
          <Paper sx={{ width: '100%', mb: 2, mt: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'name'}
                        direction={sortBy === 'name' ? sortDirection : 'asc'}
                        onClick={() => handleSort('name')}
                      >
                        Hesap Adı
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'receivable'}
                        direction={sortBy === 'receivable' ? sortDirection : 'asc'}
                        onClick={() => handleSort('receivable')}
                      >
                        Alacak
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'payable'}
                        direction={sortBy === 'payable' ? sortDirection : 'asc'}
                        onClick={() => handleSort('payable')}
                      >
                        Borç
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.receivable.toFixed(2)} ₺</TableCell>
                      <TableCell>{account.payable.toFixed(2)} ₺</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(event) => handleOpenMenu(event, account.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAccounts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        {currentTab === 2 && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              İşlem Geçmişi
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Başlangıç Tarihi"
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateRangeChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bitiş Tarihi"
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateRangeChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        )}

        {currentTab === 3 && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Raporlar
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={generatePDF}
                  fullWidth
                >
                  PDF Raporu Oluştur
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<TableChartIcon />}
                  onClick={exportToCSV}
                  fullWidth
                >
                  CSV Raporu Oluştur
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      </Main>

      <Dialog
          open={openDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
        >
          <DialogTitle>{selectedAccount ? 'Hesap Düzenle' : 'Yeni Hesap Ekle'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Hesap bilgilerini girin.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Hesap Adı"
              type="text"
              fullWidth
              variant="standard"
              value={accountDetails.name}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="receivable"
              name="receivable"
              label="Alacak"
              type="number"
              fullWidth
              variant="standard"
              value={accountDetails.receivable}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="payable"
              name="payable"
              label="Borç"
              type="number"
              fullWidth
              variant="standard"
              value={accountDetails.payable}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              value={accountDetails.email}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="phone"
              name="phone"
              label="Telefon"
              type="text"
              fullWidth
              variant="standard"
              value={accountDetails.phone}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="address"
              name="address"
              label="Adres"
              type="text"
              fullWidth
              variant="standard"
              value={accountDetails.address}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="taxId"
              name="taxId"
              label="Vergi Kimlik Numarası"
              type="text"
              fullWidth
              variant="standard"
              value={accountDetails.taxId}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="category"
              name="category"
              label="Kategori"
              type="text"
              fullWidth
              variant="standard"
              value={accountDetails.category}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Vazgeç</Button>
            <Button onClick={handleSaveAccount}>Kaydet</Button>
          </DialogActions>
        </Dialog>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleOpenTransactionDialog}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Yeni İşlem" />
          </MenuItem>
          <MenuItem onClick={() => handleDeleteAccount(selectedAccountId)}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Hesabı Sil" />
          </MenuItem>
        </Menu>

        <Dialog
          open={openTransactionDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseTransactionDialog}
        >
          <DialogTitle>Yeni İşlem Ekle</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="type"
              name="type"
              label="İşlem Türü"
              select
              fullWidth
              variant="standard"
              value={transactionDetails.type}
              onChange={handleTransactionChange}
            >
              <MenuItem value="receivable">Alacak</MenuItem>
              <MenuItem value="payable">Borç</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              id="amount"
              name="amount"
              label="Tutar"
              type="number"
              fullWidth
              variant="standard"
              value={transactionDetails.amount}
              onChange={handleTransactionChange}
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Açıklama"
              type="text"
              fullWidth
              variant="standard"
              value={transactionDetails.description}
              onChange={handleTransactionChange}
            />
            <TextField
              margin="dense"
              id="date"
              name="date"
              label="Tarih"
              type="date"
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
              value={transactionDetails.date}
              onChange={handleTransactionChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTransactionDialog}>Vazgeç</Button>
            <Button onClick={handleSaveTransaction}>Kaydet</Button>
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
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
    </Box>
  );
};

export default CurrentAccount;
