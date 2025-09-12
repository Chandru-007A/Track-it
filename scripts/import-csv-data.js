const fs = require('fs');
const path = require('path');

// This script converts your CSV data to SQL INSERT statements
// Run this with: node scripts/import-csv-data.js

const csvFilePath = path.join(__dirname, '../Dataset/track_fittings_dataset.csv');

function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.replace(/"/g, '').trim());
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    return row;
  }).filter(row => row.fitting_id);
}

function generateSQL(csvData) {
  const sqlStatements = [];
  
  // Group data by fitting_id to handle multiple inspection records
  const fittingGroups = new Map();
  csvData.forEach(row => {
    if (row.fitting_id) {
      if (!fittingGroups.has(row.fitting_id)) {
        fittingGroups.set(row.fitting_id, []);
      }
      fittingGroups.get(row.fitting_id).push(row);
    }
  });

  // Generate vendor INSERT statements
  const vendors = new Set();
  csvData.forEach(row => {
    if (row.manufacturer__vendor_code) {
      vendors.add(JSON.stringify({
        vendor_code: row.manufacturer__vendor_code,
        vendor_name: row.manufacturer__vendor_name,
        location: row.manufacturer__location
      }));
    }
  });

  vendors.forEach(vendorStr => {
    const vendor = JSON.parse(vendorStr);
    sqlStatements.push(`
INSERT INTO vendors (vendor_code, vendor_name, location, quality_rating, total_supplies, defect_rate)
VALUES ('${vendor.vendor_code}', '${vendor.vendor_name}', '${vendor.location}', 0.0, 0, 0.0)
ON CONFLICT (vendor_code) DO NOTHING;`);
  });

  // Generate track_fittings INSERT statements
  for (const [fittingId, fittingRows] of fittingGroups) {
    const mainRow = fittingRows[0];
    
    const manufacturer = {
      vendor_name: mainRow.manufacturer__vendor_name,
      vendor_code: mainRow.manufacturer__vendor_code,
      location: mainRow.manufacturer__location,
      lot_number: mainRow.manufacturer__lot_number,
      date_of_supply: mainRow.manufacturer__date_of_supply
    };

    const qrCode = {
      qr_id: mainRow.qr_code__qr_id,
      laser_marked: mainRow.qr_code__laser_marked === 'True',
      linked_portals: {
        udm: mainRow.qr_code__linked_portals__001,
        tms: mainRow.qr_code__linked_portals__002
      }
    };

    const warranty = {
      start_date: mainRow.warranty__start_date,
      end_date: mainRow.warranty__end_date,
      warranty_period_years: parseInt(mainRow.warranty__warranty_period_years) || 0
    };

    const performance = {
      in_service_date: mainRow.performance__in_service_date || null,
      last_inspection_date: mainRow.performance__last_inspection_date || null,
      condition: mainRow.performance__condition || null,
      remarks: mainRow.performance__remarks || null
    };

    sqlStatements.push(`
INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  '${mainRow.fitting_id}',
  '${mainRow.name}',
  '${mainRow.type}',
  '${JSON.stringify(manufacturer).replace(/'/g, "''")}',
  '${JSON.stringify(qrCode).replace(/'/g, "''")}',
  '${JSON.stringify(warranty).replace(/'/g, "''")}',
  '${JSON.stringify(performance).replace(/'/g, "''")}'
);`);

    // Generate QR codes INSERT
    sqlStatements.push(`
INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  '${mainRow.qr_code__qr_id}',
  '${mainRow.fitting_id}',
  ${mainRow.qr_code__laser_marked === 'True'},
  '${JSON.stringify(qrCode.linked_portals).replace(/'/g, "''")}'
);`);

    // Generate inspections INSERT statements
    fittingRows.forEach(row => {
      if (row.inspection__stage && row.inspection__date) {
        sqlStatements.push(`
INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  '${mainRow.fitting_id}',
  '${row.inspection__stage}',
  '${row.inspection__date}',
  '${row.inspection__inspected_by}',
  '${row.inspection__status}',
  '${row.performance__remarks || ''}',
  '${mainRow.manufacturer__location}',
  '${row.inspection__inspected_by}'
);`);
      }
    });
  }

  return sqlStatements.join('\n\n');
}

function main() {
  try {
    console.log('Reading CSV file...');
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    
    console.log('Parsing CSV data...');
    const csvData = parseCSV(csvContent);
    console.log(`Found ${csvData.length} rows`);
    
    console.log('Generating SQL statements...');
    const sql = generateSQL(csvData);
    
    const outputPath = path.join(__dirname, '../database/import-data.sql');
    fs.writeFileSync(outputPath, sql);
    
    console.log(`SQL file generated: ${outputPath}`);
    console.log('You can now run this SQL in your Supabase SQL Editor');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
