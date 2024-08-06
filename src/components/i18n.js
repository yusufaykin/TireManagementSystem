import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // İngilizce çeviriler
          tireTrakingSystem: 'Tire Tracking System',
          search: 'Search...',
          sortBy: 'Sort by',
          brand: 'Brand',
          size: 'Size',
          year: 'Year',
          darkMode: 'Dark Mode',
          addNewTire: 'Add New Tire',
          exportToExcel: 'Export to Excel',
          details: 'Details',
          salePrice: 'Sale Price (TL)',
          share: 'Share',
          edit: 'Edit',
          delete: 'Delete',
          generateQRCode: 'Generate QR Code',
          viewSalesHistory: 'View Sales History',
          // Diğer çeviriler...
        }
      },
      // Diğer diller için çeviriler ekleyebilirsiniz
    },
    lng: 'en', // Varsayılan dil
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;