# Supabase Setup Guide for Track Fittings AI-Based Laser QR Code Marking & Tracking System

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `track-fittings-ai-system`
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
6. Click "Create new project"
7. Wait for the project to be set up (usually takes 2-3 minutes)

## 2. Get Project Credentials

1. Go to your project dashboard
2. Click on "Settings" in the left sidebar
3. Click on "API" in the settings menu
4. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## 3. Update Environment Configuration

1. Create a `.env` file in your project root:
```bash
EXPO_PUBLIC_SUPABASE_URL=your-project-url-here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Update `lib/supabase.ts` with your credentials:
```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
```

## 4. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire contents of `database/supabase-schema.sql`
5. Click "Run" to execute the schema

## 5. Import Your CSV Data

### Option A: Using the Mobile App
1. Copy your `track_fittings_dataset.csv` to the app's document directory
2. Use the DataImportComponent in the app to import the data

### Option B: Using Supabase Dashboard
1. Go to "Table Editor" in your Supabase dashboard
2. For each table (vendors, track_fittings, inspections, etc.):
   - Click on the table name
   - Click "Insert" → "Insert row"
   - Manually add a few sample records
   - Or use the "Import data from CSV" feature if available

### Option C: Using SQL Script
1. Convert your CSV data to SQL INSERT statements
2. Run them in the SQL Editor

## 6. Set Up Authentication (Optional)

1. Go to "Authentication" → "Settings" in your Supabase dashboard
2. Configure your preferred authentication methods:
   - Email/Password
   - Google OAuth
   - GitHub OAuth
   - etc.

## 7. Configure Row Level Security (RLS)

The schema includes basic RLS policies, but you may want to customize them:

1. Go to "Authentication" → "Policies" in your Supabase dashboard
2. Review and modify the policies based on your security requirements
3. Consider adding policies for different user roles (Vendor, Inspector, Engineer, etc.)

## 8. Set Up Real-time Subscriptions (Optional)

1. Go to "Database" → "Replication" in your Supabase dashboard
2. Enable replication for tables you want to sync in real-time
3. This is useful for live updates across multiple devices

## 9. Configure Storage (Optional)

1. Go to "Storage" in your Supabase dashboard
2. Create buckets for storing:
   - QR code images
   - Inspection photos
   - Document attachments
   - etc.

## 10. Test Your Setup

1. Run your React Native app
2. Try importing data using the DataImportComponent
3. Verify that data appears in your Supabase dashboard
4. Test basic CRUD operations

## 11. Production Considerations

### Security
- Review and tighten RLS policies
- Use service role key only on the server side
- Implement proper user authentication and authorization
- Enable audit logging

### Performance
- Add appropriate database indexes
- Consider using database functions for complex queries
- Implement caching where appropriate
- Monitor query performance

### Backup
- Set up automated backups
- Test restore procedures
- Consider point-in-time recovery

### Monitoring
- Set up alerts for database issues
- Monitor API usage and limits
- Track performance metrics

## 12. API Usage Examples

### Basic Query
```typescript
import { DatabaseService } from '@/lib/database-service';

// Get all track fittings
const fittings = await DatabaseService.getAllTrackFittings();

// Get fitting by QR code
const fitting = await DatabaseService.getTrackFittingByQRCode('QR-LIN-2025-001');

// Search fittings
const searchResults = await DatabaseService.searchTrackFittings('Liner');
```

### Real-time Subscription
```typescript
import { supabase } from '@/lib/supabase';

// Subscribe to track fittings changes
const subscription = supabase
  .channel('track_fittings_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'track_fittings' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();
```

## 13. Troubleshooting

### Common Issues

1. **Connection Issues**
   - Verify your project URL and API key
   - Check if your project is paused (free tier limitation)
   - Ensure your network allows Supabase connections

2. **Permission Issues**
   - Check RLS policies
   - Verify user authentication
   - Review API key permissions

3. **Data Import Issues**
   - Check CSV format and encoding
   - Verify data types match schema
   - Look for constraint violations

4. **Performance Issues**
   - Add database indexes
   - Optimize queries
   - Consider pagination for large datasets

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 14. Next Steps

1. Implement QR code scanning functionality
2. Build user role-based interfaces
3. Add AI analytics and predictions
4. Integrate with UDM and TMS portals
5. Implement offline synchronization
6. Add push notifications for alerts
7. Build comprehensive reporting dashboard
