import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Avatar,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  Box,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
  TableSortLabel,
  TablePagination,
  AppBar,
  Toolbar,
  CssBaseline,
  Drawer,
  ListItemIcon,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
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
  Print as PrintIcon,
  ExpandMore as ExpandMoreIcon,
  Receipt as ReceiptIcon,
  LocalAtm as LocalAtmIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import MenuIcon from "@mui/icons-material/Menu";
import Badge from "@mui/material/Badge";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import Fab from "@mui/material/Fab";

const drawerWidth = 240;

const handleDownloadInvoice = (invoice) => {
  const doc = new jsPDF();

  // Başlık
  doc.setFontSize(20);
  doc.text("FATURA", 105, 15, null, null, "center");

  // Fatura bilgileri
  doc.setFontSize(12);
  doc.text(`Fatura No: ${invoice.number}`, 14, 30);
  doc.text(`Tarih: ${new Date(invoice.date).toLocaleDateString()}`, 14, 37);
  doc.text(`Vade Tarihi: ${new Date(invoice.dueDate).toLocaleDateString()}`, 14, 44);
  doc.text(`Müşteri: ${invoice.customerName}`, 14, 51);

  // Fatura kalemleri tablosu
  doc.autoTable({
    startY: 60,
    head: [["Açıklama", "Miktar", "Birim Fiyat", "Toplam"]],
    body: invoice.items.map((item) => [
      item.description,
      item.quantity,
      `${item.price.toFixed(2)} ${invoice.currency}`,
      `${(item.quantity * item.price).toFixed(2)} ${invoice.currency}`,
    ]),
    foot: [
      ["", "", "Ara Toplam:", `${(invoice.total - invoice.total * 0.18).toFixed(2)} ${invoice.currency}`],
      ["", "", "KDV (%18):", `${(invoice.total * 0.18).toFixed(2)} ${invoice.currency}`],
      ["", "", "Genel Toplam:", `${invoice.total.toFixed(2)} ${invoice.currency}`],
    ],
    theme: "striped",
  });

  // Altbilgi
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      "Sayfa " + String(i) + " / " + String(pageCount),
      195,
      285,
      null,
      null,
      "right"
    );
  }

  // PDF'i indir
  doc.save(`Fatura_${invoice.number}.pdf`);
};

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(TextField)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const AccountCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const CurrentAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [accountDetails, setAccountDetails] = useState({
    name: "",
    receivable: 0,
    payable: 0,
    email: "",
    phone: "",
    address: "",
    taxId: "",
    category: "",
    currency: "TRY",
  });
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    type: "receivable",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
    currency: "TRY",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState({
    number: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    items: [],
    total: 0,
    tax: 0,
    currency: "TRY",
  });
  const [currencies, setCurrencies] = useState(["TRY", "USD", "EUR", "GBP"]);
  const [exchangeRates, setExchangeRates] = useState({
    TRY: 1,
    USD: 0.12,
    EUR: 0.1,
    GBP: 0.086,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchAccounts();
    // Simüle edilmiş kur verileri çekme
    fetchExchangeRates();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      // Simulating API call
      const response = await new Promise((resolve) =>
        setTimeout(
          () => resolve(JSON.parse(localStorage.getItem("accounts")) || []),
          1000
        )
      );
      setAccounts(response);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      showSnackbar("Hesaplar yüklenirken bir hata oluştu.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRates = async () => {
    // Gerçek bir API'den kur verilerini çekebilirsiniz
    // Şimdilik sabit değerler kullanıyoruz
    setExchangeRates({
      TRY: 1,
      USD: 0.12,
      EUR: 0.1,
      GBP: 0.086,
    });
  };

  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    const savedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setAccounts(savedAccounts);
    setInvoices(savedInvoices);
  }, []);

  const handleOpenDialog = (account = null) => {
    setSelectedAccount(account);
    if (account) {
      setAccountDetails(account);
    } else {
      setAccountDetails({
        name: "",
        receivable: 0,
        payable: 0,
        email: "",
        phone: "",
        address: "",
        taxId: "",
        category: "",
        currency: "TRY",
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
          acc.id === selectedAccount.id
            ? { ...accountDetails, id: acc.id }
            : acc
        )
      );
      showSnackbar("Hesap başarıyla güncellendi.", "success");
    } else {
      setAccounts((prevAccounts) => [
        ...prevAccounts,
        { ...accountDetails, id: Date.now(), transactions: [] },
      ]);
      showSnackbar("Yeni hesap başarıyla eklendi.", "success");
    }
    setOpenDialog(false);
  };

  const handleDeleteAccount = (id) => {
    setAccounts((prevAccounts) => prevAccounts.filter((acc) => acc.id !== id));
    handleCloseMenu();
    showSnackbar("Hesap başarıyla silindi.", "success");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAccountDetails((prevDetails) => ({
      ...prevDetails,
      [name]:
        name === "receivable" || name === "payable"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSort = (column) => {
    setSortBy(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
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
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
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
    showSnackbar("İşlem başarıyla kaydedildi.", "success");
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
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInvoice = (invoiceId) => {
    // Fatura düzenleme işlemi için gerekli kodu buraya ekleyin
    console.log("Fatura düzenleniyor:", invoiceId);
  };
  
  const handleDeleteInvoice = (invoiceId) => {
    setInvoices((prevInvoices) => {
      const updatedInvoices = prevInvoices.filter((invoice) => invoice.id !== invoiceId);
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      return updatedInvoices;
    });
    showSnackbar("Fatura başarıyla silindi.", "success");
  };
  
  const handleTogglePaymentStatus = (invoiceId) => {
    setInvoices((prevInvoices) => {
      const updatedInvoices = prevInvoices.map((invoice) => {
        if (invoice.id === invoiceId) {
          const newStatus = invoice.status === "Ödendi" ? "Ödenmedi" : "Ödendi";
          return { ...invoice, status: newStatus };
        }
        return invoice;
      });
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      return updatedInvoices;
    });
    showSnackbar("Fatura ödeme durumu güncellendi.", "success");
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

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredAccounts = useMemo(() => {
    return accounts
      .filter(
        (account) =>
          account.name.toLowerCase().includes(filter.toLowerCase()) ||
          account.email.toLowerCase().includes(filter.toLowerCase()) ||
          account.phone.includes(filter)
      )
      .sort((a, b) => {
        if (sortDirection === "asc") {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });
  }, [accounts, filter, sortBy, sortDirection]);

  const paginatedAccounts = filteredAccounts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
    { name: "Alacaklar", value: totalReceivables },
    { name: "Borçlar", value: totalPayables },
  ];

  const barChartData = accounts.map((account) => ({
    name: account.name,
    Alacak: account.receivable,
    Borç: account.payable,
  }));

  const lineChartData = accounts
    .flatMap((account) =>
      account.transactions.map((transaction) => ({
        date: new Date(transaction.date).toLocaleDateString(),
        amount:
          transaction.type === "receivable"
            ? transaction.amount
            : -transaction.amount,
        accountName: account.name,
      }))
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Cari Hesap Raporu", 20, 10);

    const tableColumn = [
      "Hesap Adı",
      "Alacak",
      "Borç",
      "Bakiye",
      "Para Birimi",
    ];
    const tableRows = accounts.map((account) => [
      account.name,
      account.receivable.toFixed(2),
      account.payable.toFixed(2),
      (account.receivable - account.payable).toFixed(2),
      account.currency,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("cari_hesap_raporu.pdf");
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Hesap Adı,Alacak,Borç,Bakiye,Para Birimi\n" +
      accounts
        .map(
          (account) =>
            `${account.name},${account.receivable},${account.payable},${
              account.receivable - account.payable
            },${account.currency}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cari_hesap_raporu.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleOpenInvoiceDialog = () => {
    setInvoiceDetails({
      number: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      items: [],
      total: 0,
      tax: 0,
      currency: "TRY",
    });
    setOpenInvoiceDialog(true);
  };

  const handleCloseInvoiceDialog = () => {
    setOpenInvoiceDialog(false);
  };

  const handleInvoiceChange = (event) => {
    const { name, value } = event.target;
    setInvoiceDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddInvoiceItem = () => {
    setInvoiceDetails((prevDetails) => ({
      ...prevDetails,
      items: [...prevDetails.items, { description: "", quantity: 1, price: 0 }],
    }));
  };

  const handleInvoiceItemChange = (index, field, value) => {
    setInvoiceDetails((prevDetails) => {
      const newItems = [...prevDetails.items];
      newItems[index][field] =
        field === "quantity" || field === "price"
          ? parseFloat(value) || 0
          : value;
      const total = newItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      const tax = total * 0.18; // Assuming 18% tax rate
      return { ...prevDetails, items: newItems, total, tax };
    });
  };

  const handleSaveInvoice = () => {
    const customer = accounts.find((acc) => acc.id === selectedAccountId);
    const newInvoice = {
      id: Date.now(),
      number: invoiceDetails.number,
      date: invoiceDetails.date,
      dueDate: invoiceDetails.dueDate,
      customerName: customer ? customer.name : 'Bilinmeyen Müşteri',
      customerId: selectedAccountId,
      total: invoiceDetails.total + invoiceDetails.tax,
      currency: invoiceDetails.currency,
      status: "Ödenmedi",
      items: invoiceDetails.items,
    };

    setInvoices((prevInvoices) => {
      const updatedInvoices = [...prevInvoices, newInvoice];
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
      return updatedInvoices;
    });

    setAccounts((prevAccounts) => {
      const updatedAccounts = prevAccounts.map((acc) => {
        if (acc.id === selectedAccountId) {
          return {
            ...acc,
            receivable: acc.receivable + newInvoice.total,
          };
        }
        return acc;
      });
      localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
      return updatedAccounts;
    });

    setOpenInvoiceDialog(false);
    setInvoiceDetails({
      number: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      items: [],
      total: 0,
      tax: 0,
      currency: "TRY",
    });
    showSnackbar("Fatura başarıyla kaydedildi.", "success");
  };

  const calculateBalance = (account) => {
    return account.receivable - account.payable;
  };

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    return (amount / exchangeRates[fromCurrency]) * exchangeRates[toCurrency];
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={openDrawer}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(openDrawer && { display: "none" }) }}
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
              inputProps={{ "aria-label": "search" }}
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
            control={
              <Switch checked={darkMode} onChange={handleToggleDarkMode} />
            }
            label="Karanlık Mod"
          />
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={openDrawer}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
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
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Faturalar" />
          </ListItem>
          <ListItem button onClick={() => setCurrentTab(3)}>
            <ListItemIcon>
              <LocalAtmIcon />
            </ListItemIcon>
            <ListItemText primary="Nakit Akışı" />
          </ListItem>
          <ListItem button onClick={() => setCurrentTab(4)}>
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Kâr/Zarar" />
          </ListItem>
          <ListItem button onClick={() => setCurrentTab(5)}>
            <ListItemIcon>
              <AccountBalanceWalletIcon />
            </ListItemIcon>
            <ListItemText primary="Vergi Yönetimi" />
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
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
        >
          <Tab label="Genel Bakış" />
          <Tab label="Hesaplar" />
          <Tab label="Faturalar" />
          <Tab label="Nakit Akışı" />
          <Tab label="Kâr/Zarar" />
          <Tab label="Vergi Yönetimi" />
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
                  <Typography
                    variant="h4"
                    color={netBalance >= 0 ? "success" : "error"}
                  >
                    {netBalance.toFixed(2)} ₺
                  </Typography>
                </MetricCard>
              </Grid>
              <Grid item xs={12} md={3}>
                <MetricCard elevation={3}>
                  <Typography variant="h6" gutterBottom>
                    Toplam Hesap
                  </Typography>
                  <Typography variant="h4">{accounts.length}</Typography>
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
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
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
          <Paper sx={{ width: "100%", mb: 2, mt: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === "name"}
                        direction={sortBy === "name" ? sortDirection : "asc"}
                        onClick={() => handleSort("name")}
                      >
                        Hesap Adı
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === "receivable"}
                        direction={
                          sortBy === "receivable" ? sortDirection : "asc"
                        }
                        onClick={() => handleSort("receivable")}
                      >
                        Alacak
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === "payable"}
                        direction={sortBy === "payable" ? sortDirection : "asc"}
                        onClick={() => handleSort("payable")}
                      >
                        Borç
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Bakiye</TableCell>
                    <TableCell>Para Birimi</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.receivable.toFixed(2)}</TableCell>
                      <TableCell>{account.payable.toFixed(2)}</TableCell>
                      <TableCell>
                        {calculateBalance(account).toFixed(2)}
                      </TableCell>
                      <TableCell>{account.currency}</TableCell>
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
      Faturalar
    </Typography>
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={handleOpenInvoiceDialog}
      sx={{ mb: 2 }}
    >
      Yeni Fatura Oluştur
    </Button>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fatura No</TableCell>
            <TableCell>Tarih</TableCell>
            <TableCell>Müşteri</TableCell>
            <TableCell>Tutar</TableCell>
            <TableCell>Durum</TableCell>
            <TableCell>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.number}</TableCell>
              <TableCell>
                {new Date(invoice.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>
                {invoice.total.toFixed(2)} {invoice.currency}
              </TableCell>
              <TableCell>
                <Chip
                  label={invoice.status}
                  color={invoice.status === "Ödendi" ? "success" : "warning"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleDownloadInvoice(invoice)}>
                  <PictureAsPdfIcon />
                </IconButton>
                <IconButton onClick={() => handleEditInvoice(invoice.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteInvoice(invoice.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => handleTogglePaymentStatus(invoice.id)}>
                  {invoice.status === "Ödendi" ? <MoneyOffIcon /> : <AttachMoneyIcon />}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
)}

        {currentTab === 3 && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Nakit Akışı
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
              <AreaChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        )}

        {currentTab === 4 && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Kâr/Zarar Tablosu
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Kategori</TableCell>
                    <TableCell align="right">Tutar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Toplam Gelir</TableCell>
                    <TableCell align="right">
                      {totalReceivables.toFixed(2)} ₺
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Toplam Gider</TableCell>
                    <TableCell align="right">
                      {totalPayables.toFixed(2)} ₺
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Net Kâr/Zarar</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{netBalance.toFixed(2)} ₺</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {currentTab === 5 && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Vergi Yönetimi
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>KDV Hesaplaması</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Toplam KDV: {(totalReceivables * 0.18).toFixed(2)} ₺
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={12} md={6}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Gelir Vergisi Tahmini</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Tahmini Gelir Vergisi: {(netBalance * 0.15).toFixed(2)} ₺
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
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
        <DialogTitle>
          {selectedAccount ? "Hesap Düzenle" : "Yeni Hesap Ekle"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Hesap bilgilerini girin.</DialogContentText>
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
          <FormControl fullWidth margin="dense">
            <InputLabel id="currency-label">Para Birimi</InputLabel>
            <Select
              labelId="currency-label"
              id="currency"
              name="currency"
              value={accountDetails.currency}
              onChange={handleChange}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Yeni İşlem" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleOpenInvoiceDialog();
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Fatura Oluştur" />
        </MenuItem>
        <MenuItem onClick={() => handleDeleteAccount(selectedAccountId)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
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
          <FormControl fullWidth margin="dense">
            <InputLabel id="transaction-currency-label">Para Birimi</InputLabel>
            <Select
              labelId="transaction-currency-label"
              id="currency"
              name="currency"
              value={transactionDetails.currency}
              onChange={handleTransactionChange}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTransactionDialog}>Vazgeç</Button>
          <Button onClick={handleSaveTransaction}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openInvoiceDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseInvoiceDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Fatura Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="number"
            name="number"
            label="Fatura Numarası"
            type="text"
            fullWidth
            variant="standard"
            value={invoiceDetails.number}
            onChange={handleInvoiceChange}
          />
          <TextField
            margin="dense"
            id="date"
            name="date"
            label="Fatura Tarihi"
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={invoiceDetails.date}
            onChange={handleInvoiceChange}
          />
          <TextField
            margin="dense"
            id="dueDate"
            name="dueDate"
            label="Vade Tarihi"
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={invoiceDetails.dueDate}
            onChange={handleInvoiceChange}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Fatura Kalemleri
          </Typography>
          {invoiceDetails.items.map((item, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Açıklama"
                value={item.description}
                onChange={(e) =>
                  handleInvoiceItemChange(index, "description", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Miktar"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleInvoiceItemChange(index, "quantity", e.target.value)
                }
                sx={{ width: "100px" }}
              />
              <TextField
                label="Birim Fiyat"
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleInvoiceItemChange(index, "price", e.target.value)
                }
                sx={{ width: "150px" }}
              />
            </Box>
          ))}
          <Button onClick={handleAddInvoiceItem} startIcon={<AddIcon />}>
            Kalem Ekle
          </Button>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Özet
          </Typography>
          <Typography>
            Ara Toplam: {invoiceDetails.total.toFixed(2)}{" "}
            {invoiceDetails.currency}
          </Typography>
          <Typography>
            KDV (%18): {invoiceDetails.tax.toFixed(2)} {invoiceDetails.currency}
          </Typography>
          <Typography variant="h6">
            Genel Toplam:{" "}
            {(invoiceDetails.total + invoiceDetails.tax).toFixed(2)}{" "}
            {invoiceDetails.currency}
          </Typography>
          <FormControl fullWidth margin="dense">
            <InputLabel id="invoice-currency-label">Para Birimi</InputLabel>
            <Select
              labelId="invoice-currency-label"
              id="currency"
              name="currency"
              value={invoiceDetails.currency}
              onChange={handleInvoiceChange}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoiceDialog}>Vazgeç</Button>
          <Button onClick={handleSaveInvoice}>Faturayı Kaydet</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default CurrentAccount;
