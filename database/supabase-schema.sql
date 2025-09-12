-- Supabase Database Schema for Track Fittings AI-Based Laser QR Code Marking & Tracking System

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('Vendor', 'Depot Manager', 'Inspector', 'Engineer', 'Admin');
CREATE TYPE inspection_stage AS ENUM ('Factory Inspection', 'Post-Supply Inspection', 'In-Service Inspection', 'Pre-Installation Inspection', 'Post-Installation Inspection');
CREATE TYPE inspection_status AS ENUM ('Approved', 'Approved with Remarks', 'Rejected', 'Pending');
CREATE TYPE risk_level AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- Vendors table
CREATE TABLE vendors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vendor_code VARCHAR(50) UNIQUE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    quality_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (quality_rating >= 0 AND quality_rating <= 5),
    total_supplies INTEGER DEFAULT 0,
    defect_rate DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    department VARCHAR(255),
    location VARCHAR(255),
    permissions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track fittings table
CREATE TABLE track_fittings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    fitting_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    manufacturer JSONB NOT NULL, -- Contains vendor_name, vendor_code, location, lot_number, date_of_supply
    qr_code JSONB NOT NULL, -- Contains qr_id, laser_marked, linked_portals
    warranty JSONB NOT NULL, -- Contains start_date, end_date, warranty_period_years
    inspection JSONB DEFAULT '[]'::jsonb, -- Array of inspection records
    performance JSONB, -- Contains in_service_date, last_inspection_date, condition, remarks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR codes table
CREATE TABLE qr_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    qr_id VARCHAR(100) UNIQUE NOT NULL,
    fitting_id VARCHAR(100) REFERENCES track_fittings(fitting_id) ON DELETE CASCADE,
    laser_marked BOOLEAN DEFAULT FALSE,
    marked_date TIMESTAMP WITH TIME ZONE,
    marked_by VARCHAR(255),
    verification_status VARCHAR(20) DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'Verified', 'Failed')),
    linked_portals JSONB NOT NULL, -- Contains udm, tms URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inspections table
CREATE TABLE inspections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    fitting_id VARCHAR(100) REFERENCES track_fittings(fitting_id) ON DELETE CASCADE,
    stage inspection_stage NOT NULL,
    date DATE NOT NULL,
    inspected_by VARCHAR(255) NOT NULL,
    status inspection_status NOT NULL,
    remarks TEXT,
    location VARCHAR(255),
    inspector_credentials VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance analytics table
CREATE TABLE performance_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    fitting_id VARCHAR(100) REFERENCES track_fittings(fitting_id) ON DELETE CASCADE,
    vendor_code VARCHAR(50) REFERENCES vendors(vendor_code) ON DELETE CASCADE,
    failure_probability DECIMAL(5,4) DEFAULT 0.0 CHECK (failure_probability >= 0 AND failure_probability <= 1),
    predicted_lifespan INTEGER, -- in days
    maintenance_recommendation TEXT,
    quality_score DECIMAL(3,2) DEFAULT 0.0 CHECK (quality_score >= 0 AND quality_score <= 5),
    risk_level risk_level DEFAULT 'Low',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_track_fittings_fitting_id ON track_fittings(fitting_id);
CREATE INDEX idx_track_fittings_type ON track_fittings(type);
CREATE INDEX idx_track_fittings_manufacturer_code ON track_fittings((manufacturer->>'vendor_code'));
CREATE INDEX idx_qr_codes_qr_id ON qr_codes(qr_id);
CREATE INDEX idx_qr_codes_fitting_id ON qr_codes(fitting_id);
CREATE INDEX idx_inspections_fitting_id ON inspections(fitting_id);
CREATE INDEX idx_inspections_date ON inspections(date);
CREATE INDEX idx_inspections_stage ON inspections(stage);
CREATE INDEX idx_performance_analytics_vendor_code ON performance_analytics(vendor_code);
CREATE INDEX idx_performance_analytics_risk_level ON performance_analytics(risk_level);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_track_fittings_updated_at BEFORE UPDATE ON track_fittings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON qr_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create functions for analytics
CREATE OR REPLACE FUNCTION get_vendor_quality_metrics()
RETURNS TABLE (
    vendor_code VARCHAR(50),
    vendor_name VARCHAR(255),
    total_supplies BIGINT,
    defect_rate DECIMAL(5,2),
    quality_rating DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.vendor_code,
        v.vendor_name,
        COUNT(tf.id) as total_supplies,
        v.defect_rate,
        v.quality_rating
    FROM vendors v
    LEFT JOIN track_fittings tf ON tf.manufacturer->>'vendor_code' = v.vendor_code
    GROUP BY v.vendor_code, v.vendor_name, v.defect_rate, v.quality_rating
    ORDER BY v.quality_rating DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_fitting_performance_summary()
RETURNS TABLE (
    total_fittings BIGINT,
    in_service BIGINT,
    needs_attention BIGINT,
    replacement_scheduled BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_fittings,
        COUNT(*) FILTER (WHERE performance->>'condition' IN ('Good', 'Satisfactory')) as in_service,
        COUNT(*) FILTER (WHERE performance->>'condition' = 'Needs Attention') as needs_attention,
        COUNT(*) FILTER (WHERE performance->>'condition' LIKE '%Replacement scheduled%') as replacement_scheduled
    FROM track_fittings;
END;
$$ LANGUAGE plpgsql;

-- Create views for easier querying
CREATE VIEW track_fittings_with_vendor AS
SELECT 
    tf.*,
    v.vendor_name,
    v.location as vendor_location,
    v.quality_rating
FROM track_fittings tf
LEFT JOIN vendors v ON tf.manufacturer->>'vendor_code' = v.vendor_code;

CREATE VIEW inspection_summary AS
SELECT 
    i.fitting_id,
    tf.name as fitting_name,
    tf.type as fitting_type,
    i.stage,
    i.date,
    i.inspected_by,
    i.status,
    i.remarks
FROM inspections i
JOIN track_fittings tf ON i.fitting_id = tf.fitting_id
ORDER BY i.date DESC;

-- Insert sample data (optional)
INSERT INTO vendors (vendor_code, vendor_name, location, contact_person, email, phone, quality_rating, total_supplies, defect_rate) VALUES
('VND12345', 'ABC Steel Works Pvt Ltd', 'Bhilai, Chhattisgarh, India', 'Rajesh Kumar', 'rajesh@abcsteel.com', '+91-9876543210', 4.2, 150, 2.5),
('VND54321', 'DEF Rubber Industries', 'Howrah, West Bengal, India', 'Priya Sharma', 'priya@defrubber.com', '+91-9876543211', 3.8, 120, 3.2),
('VND67890', 'XYZ Polymers Ltd', 'Kapurthala, Punjab, India', 'Amit Singh', 'amit@xyzpolymers.com', '+91-9876543212', 4.0, 200, 2.8),
('VND98765', 'LMN Foundries', 'Raipur, Chhattisgarh, India', 'Suresh Patel', 'suresh@lmnfoundries.com', '+91-9876543213', 3.5, 180, 4.1),
('VND33445', 'RST Engineering', 'Lucknow, Uttar Pradesh, India', 'Neha Gupta', 'neha@rstengg.com', '+91-9876543214', 4.3, 100, 1.8),
('VND11223', 'PQR Concrete Ltd', 'Nagpur, Maharashtra, India', 'Vikram Joshi', 'vikram@pqrconcrete.com', '+91-9876543215', 3.9, 160, 3.5);

-- Create RLS (Row Level Security) policies
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_fittings ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_analytics ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your authentication requirements)
CREATE POLICY "Enable read access for all users" ON vendors FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON track_fittings FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON qr_codes FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON inspections FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON performance_analytics FOR SELECT USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
