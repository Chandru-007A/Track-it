# Track It - AI-Based Laser QR Code Marking & Tracking System

A comprehensive React Native application for tracking railway track fittings from manufacturing to installation using AI-powered analytics and laser-engraved QR codes.

## 🚀 Features

### Core Functionality
- **QR Code Scanning**: Scan laser-engraved QR codes on track fittings
- **Lifecycle Tracking**: Track fittings through manufacturing, supply, inspection, and installation
- **AI Analytics**: Predictive analytics for failure probability and maintenance recommendations
- **Offline Support**: Work without internet connection with data synchronization
- **Role-Based Access**: Different interfaces for vendors, inspectors, engineers, and depot managers

### Data Management
- **CSV Import/Export**: Import your existing track fittings dataset
- **Supabase Integration**: Cloud database with real-time synchronization
- **Local Storage**: SQLite for offline data storage
- **Data Validation**: Comprehensive data validation and error handling

## 📊 Dataset

The system works with your comprehensive dataset containing:
- **Track Fittings**: Elastic Rail Clips, Liners, Rail Pads, Sleepers
- **Manufacturer Data**: Vendor information, lot numbers, supply dates
- **QR Code Data**: Unique identifiers, laser marking status, portal links
- **Warranty Information**: Start/end dates, warranty periods
- **Inspection Records**: Multiple inspection stages and results
- **Performance Data**: In-service status, condition monitoring, remarks

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Database**: Supabase (PostgreSQL) + SQLite (offline)
- **QR Scanning**: expo-barcode-scanner
- **Charts**: react-native-chart-kit
- **State Management**: React Context + AsyncStorage
- **Authentication**: Supabase Auth
- **File Handling**: expo-file-system

## 📱 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Track_it
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Follow the instructions in `SUPABASE_SETUP.md`
   - Create a `.env` file with your Supabase credentials:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
   - Install the URL polyfill: `npm install react-native-url-polyfill`

4. **Import your data**
   - Copy your `track_fittings_dataset.csv` to the `Dataset/` folder
   - Run the data import script:
     ```bash
     node scripts/import-csv-data.js
     ```
   - Execute the generated SQL in your Supabase SQL Editor

5. **Start the development server**
   ```bash
   npm expo start
   ```

## 🗄️ Database Schema

### Tables
- **track_fittings**: Main table storing all fitting information
- **vendors**: Manufacturer/vendor information
- **qr_codes**: QR code data and verification status
- **inspections**: Inspection records and results
- **users**: User accounts and role management
- **performance_analytics**: AI-generated analytics and predictions

### Key Features
- **JSONB Fields**: Flexible storage for complex data structures
- **Row Level Security**: Secure data access based on user roles
- **Real-time Updates**: Live synchronization across devices
- **Audit Trail**: Complete history of all changes

## 🔧 Usage

### Data Import
1. Open the app and navigate to the Data Management section
2. Use "Import from Assets CSV" to import your dataset
3. Monitor the import progress and review any errors
4. Verify data in the Supabase dashboard

### QR Code Scanning
1. Tap "QR Scanner" in the main interface
2. Point camera at the laser-engraved QR code
3. View detailed fitting information including:
   - Manufacturer details
   - Warranty information
   - Inspection history
   - Performance data
   - AI predictions

### Analytics Dashboard
- **Vendor Performance**: Quality ratings and defect rates
- **Fitting Status**: In-service, needs attention, replacement scheduled
- **Predictive Analytics**: Failure probability and maintenance recommendations
- **Compliance Tracking**: Inspection status and quality metrics

## 🔐 User Roles

### Vendor/Manufacturer
- Generate and manage QR codes
- Upload batch data
- View quality metrics and feedback

### Depot Manager
- Scan QR codes during supply receipt
- Update inventory status
- Monitor vendor performance

### Inspector
- Log inspection results
- Update fitting status
- Generate inspection reports

### Engineer
- Access AI analytics dashboard
- Monitor fitting performance
- Plan maintenance schedules

### Admin
- Manage users and permissions
- Configure system settings
- Access all data and analytics

## 🤖 AI Features

### Predictive Analytics
- **Failure Probability**: Predict which fittings are likely to fail
- **Maintenance Scheduling**: Recommend optimal maintenance intervals
- **Quality Scoring**: Rate vendor and fitting quality
- **Risk Assessment**: Identify high-risk fittings and batches

### Machine Learning Models
- **Anomaly Detection**: Identify defective batches early
- **Pattern Recognition**: Learn from historical data
- **Recommendation Engine**: Suggest preventive actions
- **Performance Prediction**: Forecast fitting lifespan

## 📈 Workflow Integration

### Manufacturing Stage
1. Vendor generates unique QR code
2. Laser engraves QR on fitting
3. Data uploaded to central database
4. Quality inspection logged

### Supply Stage
1. Depot scans QR on receipt
2. Verifies with UDM portal
3. Updates inventory status
4. Logs supply details

### Inspection Stage
1. Inspector scans QR code
2. Records inspection results
3. Updates fitting status
4. Syncs with TMS portal

### Installation Stage
1. Engineer scans QR before installation
2. Links to track section in TMS
3. Records installation details
4. Activates performance monitoring

### Service Stage
1. AI monitors performance data
2. Generates maintenance alerts
3. Tracks warranty status
4. Predicts replacement needs

## 🔄 Offline Synchronization

- **Local Storage**: SQLite database for offline access
- **Sync Queue**: Pending changes stored locally
- **Auto Sync**: Automatic synchronization when online
- **Conflict Resolution**: Smart handling of data conflicts
- **Data Integrity**: Validation and consistency checks

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
expo build:android
expo build:ios
```

### Web Deployment
```bash
expo build:web
```

## 📊 Monitoring & Analytics

### Real-time Metrics
- Active fittings count
- Inspection compliance rate
- Vendor quality scores
- System performance metrics

### Historical Analysis
- Trend analysis over time
- Seasonal pattern recognition
- Vendor performance comparison
- Cost-benefit analysis

## 🔧 Configuration

### Environment Variables
```bash
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_API_BASE_URL=your-api-url
```

### Database Configuration
- Update connection strings in `lib/supabase.ts`
- Configure RLS policies in Supabase dashboard
- Set up backup and monitoring

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📚 API Documentation

### Database Service
- `DatabaseService.getAllTrackFittings()`
- `DatabaseService.getTrackFittingByQRCode(qrId)`
- `DatabaseService.createInspection(inspection)`
- `DatabaseService.getPerformanceAnalytics()`

### Data Import Service
- `DataImportService.importFromCSV(filePath)`
- `DataImportService.exportToCSV()`
- `DataImportService.parseCSV(csvContent)`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `docs/` folder
- Review the Supabase setup guide

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic QR scanning
- ✅ Data import/export
- ✅ Supabase integration
- ✅ Core database schema

### Phase 2 (Next)
- 🔄 Advanced QR scanner with offline capability
- 🔄 User role management
- 🔄 AI analytics dashboard
- 🔄 Real-time notifications

### Phase 3 (Future)
- 📋 UDM/TMS portal integration
- 📋 Advanced AI models
- 📋 Mobile app optimization
- 📋 Enterprise features

---

**Built with ❤️ for Indian Railways and the future of track maintenance**
