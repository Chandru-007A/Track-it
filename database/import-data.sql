
INSERT INTO vendors (vendor_code, vendor_name, location, quality_rating, total_supplies, defect_rate)
VALUES ('VND98765', 'LMN Foundries', 'Raipur', 0.0, 0, 0.0)
ON CONFLICT (vendor_code) DO NOTHING;


INSERT INTO vendors (vendor_code, vendor_name, location, quality_rating, total_supplies, defect_rate)
VALUES ('VND67890', 'XYZ Polymers Ltd', 'Kapurthala', 0.0, 0, 0.0)
ON CONFLICT (vendor_code) DO NOTHING;


INSERT INTO vendors (vendor_code, vendor_name, location, quality_rating, total_supplies, defect_rate)
VALUES ('VND12345', 'ABC Steel Works Pvt Ltd', 'Bhilai', 0.0, 0, 0.0)
ON CONFLICT (vendor_code) DO NOTHING;


INSERT INTO vendors (vendor_code, vendor_name, location, quality_rating, total_supplies, defect_rate)
VALUES ('VND54321', 'DEF Rubber Industries', 'Howrah', 0.0, 0, 0.0)
ON CONFLICT (vendor_code) DO NOTHING;


INSERT INTO vendors (vendor_code, vendor_name, location, quality_rating, total_supplies, defect_rate)
VALUES ('VND33445', 'RST Engineering', 'Lucknow', 0.0, 0, 0.0)
ON CONFLICT (vendor_code) DO NOTHING;


INSERT INTO vendors (vendor_code, vendor_name, location, quality_rating, total_supplies, defect_rate)
VALUES ('VND11223', 'PQR Concrete Ltd', 'Nagpur', 0.0, 0, 0.0)
ON CONFLICT (vendor_code) DO NOTHING;


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'LIN-2025-001',
  'Liner',
  'Metal Liner',
  '{"vendor_name":"LMN Foundries","vendor_code":"VND98765","location":"Raipur","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-LIN-2025-001","laser_marked":false,"linked_portals":{"udm":"QR-LIN-2025-001","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2025}',
  '{"in_service_date":"RITES","last_inspection_date":"Approved","condition":"2025-03-04","remarks":"2026-02-12"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-LIN-2025-001',
  'LIN-2025-001',
  false,
  '{"udm":"QR-LIN-2025-001","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'LIN-2025-001',
  '2028-02-12',
  '3',
  'Factory Inspection',
  '2025-02-07',
  '2026-02-12',
  'Raipur',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'RAI-2025-002',
  'Rail Pad',
  'Composite Rubber Pad',
  '{"vendor_name":"LMN Foundries","vendor_code":"VND98765","location":"Raipur","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-RAI-2025-002","laser_marked":false,"linked_portals":{"udm":"QR-RAI-2025-002","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"Independent Auditor","last_inspection_date":"Approved","condition":"2025-01-18","remarks":"2025-06-04"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-RAI-2025-002',
  'RAI-2025-002',
  false,
  '{"udm":"QR-RAI-2025-002","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'RAI-2025-002',
  '2029-12-28',
  '5',
  'Factory Inspection',
  '2024-12-24',
  '2025-06-04',
  'Raipur',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-003',
  'Sleeper',
  'Steel Sleeper',
  '{"vendor_name":"XYZ Polymers Ltd","vendor_code":"VND67890","location":"Kapurthala","lot_number":"Punjab","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-003","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-003","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"Independent Auditor","last_inspection_date":"Approved","condition":"2023-12-04","remarks":"2024-06-13"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-003',
  'SLE-2025-003',
  false,
  '{"udm":"QR-SLE-2025-003","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-003',
  '2026-11-13',
  '3',
  'Factory Inspection',
  '2023-11-09',
  '2024-06-13',
  'Kapurthala',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-004',
  'Sleeper',
  'Steel Sleeper',
  '{"vendor_name":"LMN Foundries","vendor_code":"VND98765","location":"Raipur","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-004","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-004","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"RITES","last_inspection_date":"Approved","condition":"2024-08-22","remarks":"2024-11-09"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-004',
  'SLE-2025-004',
  false,
  '{"udm":"QR-SLE-2025-004","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-004',
  '2029-08-01',
  '5',
  'Factory Inspection',
  '2024-07-28',
  '2024-11-09',
  'Raipur',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-005',
  'Sleeper',
  'Steel Sleeper',
  '{"vendor_name":"ABC Steel Works Pvt Ltd","vendor_code":"VND12345","location":"Bhilai","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-005","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-005","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2025}',
  '{"in_service_date":"Independent Auditor","last_inspection_date":"Approved","condition":"2025-05-20","remarks":"2025-11-20"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-005',
  'SLE-2025-005',
  false,
  '{"udm":"QR-SLE-2025-005","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-005',
  '2030-04-29',
  '5',
  'Factory Inspection',
  '2025-04-25',
  '2025-11-20',
  'Bhilai',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'LIN-2025-006',
  'Liner',
  'HDPE Liner',
  '{"vendor_name":"ABC Steel Works Pvt Ltd","vendor_code":"VND12345","location":"Bhilai","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-LIN-2025-006","laser_marked":false,"linked_portals":{"udm":"QR-LIN-2025-006","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"RDSO","last_inspection_date":"Approved","condition":"2024-12-26","remarks":"2025-05-15"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-LIN-2025-006',
  'LIN-2025-006',
  false,
  '{"udm":"QR-LIN-2025-006","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'LIN-2025-006',
  '2026-12-06',
  '2',
  'Factory Inspection',
  '2024-12-01',
  '2025-05-15',
  'Bhilai',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'ELA-2025-007',
  'Elastic Rail Clip',
  'ERC Mk-III',
  '{"vendor_name":"DEF Rubber Industries","vendor_code":"VND54321","location":"Howrah","lot_number":"West Bengal","date_of_supply":"India"}',
  '{"qr_id":"LOT-ELA-2025-007","laser_marked":false,"linked_portals":{"udm":"QR-ELA-2025-007","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"Railway QA Team","last_inspection_date":"Approved","condition":"2024-12-27","remarks":"2025-08-12"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-ELA-2025-007',
  'ELA-2025-007',
  false,
  '{"udm":"QR-ELA-2025-007","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'ELA-2025-007',
  '2026-12-07',
  '2',
  'Factory Inspection',
  '2024-12-02',
  '2025-08-12',
  'Howrah',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'LIN-2025-008',
  'Liner',
  'HDPE Liner',
  '{"vendor_name":"ABC Steel Works Pvt Ltd","vendor_code":"VND12345","location":"Bhilai","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-LIN-2025-008","laser_marked":false,"linked_portals":{"udm":"QR-LIN-2025-008","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"Railway QA Team","last_inspection_date":"Approved","condition":"2023-05-20","remarks":"2024-05-17"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-LIN-2025-008',
  'LIN-2025-008',
  false,
  '{"udm":"QR-LIN-2025-008","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'LIN-2025-008',
  '2026-04-29',
  '3',
  'Factory Inspection',
  '2023-04-25',
  '2024-05-17',
  'Bhilai',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'ELA-2025-009',
  'Elastic Rail Clip',
  'ERC Mk-III',
  '{"vendor_name":"LMN Foundries","vendor_code":"VND98765","location":"Raipur","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-ELA-2025-009","laser_marked":false,"linked_portals":{"udm":"QR-ELA-2025-009","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"RDSO","last_inspection_date":"Approved","condition":"2023-07-26","remarks":"2024-05-04"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-ELA-2025-009',
  'ELA-2025-009',
  false,
  '{"udm":"QR-ELA-2025-009","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'ELA-2025-009',
  '2025-07-05',
  '2',
  'Factory Inspection',
  '2023-07-01',
  '2024-05-04',
  'Raipur',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'ELA-2025-010',
  'Elastic Rail Clip',
  'ERC Mk-III',
  '{"vendor_name":"DEF Rubber Industries","vendor_code":"VND54321","location":"Howrah","lot_number":"West Bengal","date_of_supply":"India"}',
  '{"qr_id":"LOT-ELA-2025-010","laser_marked":false,"linked_portals":{"udm":"QR-ELA-2025-010","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"RDSO","last_inspection_date":"Approved","condition":"2024-06-23","remarks":"2025-06-06"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-ELA-2025-010',
  'ELA-2025-010',
  false,
  '{"udm":"QR-ELA-2025-010","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'ELA-2025-010',
  '2027-06-03',
  '3',
  'Factory Inspection',
  '2024-05-29',
  '2025-06-06',
  'Howrah',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'RAI-2025-011',
  'Rail Pad',
  'Composite Rubber Pad',
  '{"vendor_name":"ABC Steel Works Pvt Ltd","vendor_code":"VND12345","location":"Bhilai","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-RAI-2025-011","laser_marked":false,"linked_portals":{"udm":"QR-RAI-2025-011","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"Railway QA Team","last_inspection_date":"Approved","condition":"2023-11-24","remarks":"2024-09-07"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-RAI-2025-011',
  'RAI-2025-011',
  false,
  '{"udm":"QR-RAI-2025-011","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'RAI-2025-011',
  '2028-11-02',
  '5',
  'Factory Inspection',
  '2023-10-30',
  '2024-09-07',
  'Bhilai',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'ELA-2025-012',
  'Elastic Rail Clip',
  'ERC Mk-III',
  '{"vendor_name":"RST Engineering","vendor_code":"VND33445","location":"Lucknow","lot_number":"Uttar Pradesh","date_of_supply":"India"}',
  '{"qr_id":"LOT-ELA-2025-012","laser_marked":false,"linked_portals":{"udm":"QR-ELA-2025-012","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"RITES","last_inspection_date":"Approved","condition":"2024-03-07","remarks":"2024-12-15"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-ELA-2025-012',
  'ELA-2025-012',
  false,
  '{"udm":"QR-ELA-2025-012","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'ELA-2025-012',
  '2026-02-15',
  '2',
  'Factory Inspection',
  '2024-02-11',
  '2024-12-15',
  'Lucknow',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-013',
  'Sleeper',
  'Steel Sleeper',
  '{"vendor_name":"ABC Steel Works Pvt Ltd","vendor_code":"VND12345","location":"Bhilai","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-013","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-013","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"Independent Auditor","last_inspection_date":"Approved","condition":"2024-04-22","remarks":"2025-04-18"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-013',
  'SLE-2025-013',
  false,
  '{"udm":"QR-SLE-2025-013","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-013',
  '2027-04-02',
  '3',
  'Factory Inspection',
  '2024-03-28',
  '2025-04-18',
  'Bhilai',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-014',
  'Sleeper',
  'Prestressed Concrete Sleeper',
  '{"vendor_name":"LMN Foundries","vendor_code":"VND98765","location":"Raipur","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-014","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-014","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"RITES","last_inspection_date":"Approved","condition":"2024-11-03","remarks":"2025-04-15"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-014',
  'SLE-2025-014',
  false,
  '{"udm":"QR-SLE-2025-014","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-014',
  '2027-10-14',
  '3',
  'Factory Inspection',
  '2024-10-09',
  '2025-04-15',
  'Raipur',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-015',
  'Sleeper',
  'Prestressed Concrete Sleeper',
  '{"vendor_name":"XYZ Polymers Ltd","vendor_code":"VND67890","location":"Kapurthala","lot_number":"Punjab","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-015","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-015","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2025}',
  '{"in_service_date":"RDSO","last_inspection_date":"Approved","condition":"2025-01-23","remarks":"2025-09-03"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-015',
  'SLE-2025-015',
  false,
  '{"udm":"QR-SLE-2025-015","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-015',
  '2028-01-03',
  '3',
  'Factory Inspection',
  '2024-12-29',
  '2025-09-03',
  'Kapurthala',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'RAI-2025-016',
  'Rail Pad',
  'Composite Rubber Pad',
  '{"vendor_name":"PQR Concrete Ltd","vendor_code":"VND11223","location":"Nagpur","lot_number":"Maharashtra","date_of_supply":"India"}',
  '{"qr_id":"LOT-RAI-2025-016","laser_marked":false,"linked_portals":{"udm":"QR-RAI-2025-016","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2025}',
  '{"in_service_date":"RITES","last_inspection_date":"Approved","condition":"2025-07-02","remarks":"2025-10-08"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-RAI-2025-016',
  'RAI-2025-016',
  false,
  '{"udm":"QR-RAI-2025-016","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'RAI-2025-016',
  '2030-06-11',
  '5',
  'Factory Inspection',
  '2025-06-07',
  '2025-10-08',
  'Nagpur',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'LIN-2025-017',
  'Liner',
  'Metal Liner',
  '{"vendor_name":"RST Engineering","vendor_code":"VND33445","location":"Lucknow","lot_number":"Uttar Pradesh","date_of_supply":"India"}',
  '{"qr_id":"LOT-LIN-2025-017","laser_marked":false,"linked_portals":{"udm":"QR-LIN-2025-017","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"Independent Auditor","last_inspection_date":"Approved","condition":"2023-03-21","remarks":"2024-01-12"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-LIN-2025-017',
  'LIN-2025-017',
  false,
  '{"udm":"QR-LIN-2025-017","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'LIN-2025-017',
  '2026-02-28',
  '3',
  'Factory Inspection',
  '2023-02-24',
  '2024-01-12',
  'Lucknow',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'LIN-2025-018',
  'Liner',
  'HDPE Liner',
  '{"vendor_name":"ABC Steel Works Pvt Ltd","vendor_code":"VND12345","location":"Bhilai","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-LIN-2025-018","laser_marked":false,"linked_portals":{"udm":"QR-LIN-2025-018","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2025}',
  '{"in_service_date":"RDSO","last_inspection_date":"Approved","condition":"2025-07-01","remarks":"2026-01-15"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-LIN-2025-018',
  'LIN-2025-018',
  false,
  '{"udm":"QR-LIN-2025-018","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'LIN-2025-018',
  '2028-06-10',
  '3',
  'Factory Inspection',
  '2025-06-06',
  '2026-01-15',
  'Bhilai',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-019',
  'Sleeper',
  'Prestressed Concrete Sleeper',
  '{"vendor_name":"RST Engineering","vendor_code":"VND33445","location":"Lucknow","lot_number":"Uttar Pradesh","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-019","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-019","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"RITES","last_inspection_date":"Approved","condition":"2025-01-05","remarks":"2025-06-17"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-019',
  'SLE-2025-019',
  false,
  '{"udm":"QR-SLE-2025-019","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-019',
  '2029-12-15',
  '5',
  'Factory Inspection',
  '2024-12-11',
  '2025-06-17',
  'Lucknow',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'RAI-2025-020',
  'Rail Pad',
  'Composite Rubber Pad',
  '{"vendor_name":"PQR Concrete Ltd","vendor_code":"VND11223","location":"Nagpur","lot_number":"Maharashtra","date_of_supply":"India"}',
  '{"qr_id":"LOT-RAI-2025-020","laser_marked":false,"linked_portals":{"udm":"QR-RAI-2025-020","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"RITES","last_inspection_date":"Approved","condition":"2023-05-05","remarks":"2024-01-03"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-RAI-2025-020',
  'RAI-2025-020',
  false,
  '{"udm":"QR-RAI-2025-020","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'RAI-2025-020',
  '2026-04-14',
  '3',
  'Factory Inspection',
  '2023-04-10',
  '2024-01-03',
  'Nagpur',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'RAI-2025-021',
  'Rail Pad',
  'Composite Rubber Pad',
  '{"vendor_name":"DEF Rubber Industries","vendor_code":"VND54321","location":"Howrah","lot_number":"West Bengal","date_of_supply":"India"}',
  '{"qr_id":"LOT-RAI-2025-021","laser_marked":false,"linked_portals":{"udm":"QR-RAI-2025-021","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"RITES","last_inspection_date":"Approved","condition":"2024-07-05","remarks":"2025-07-14"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-RAI-2025-021',
  'RAI-2025-021',
  false,
  '{"udm":"QR-RAI-2025-021","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'RAI-2025-021',
  '2027-06-15',
  '3',
  'Factory Inspection',
  '2024-06-10',
  '2025-07-14',
  'Howrah',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-022',
  'Sleeper',
  'Steel Sleeper',
  '{"vendor_name":"RST Engineering","vendor_code":"VND33445","location":"Lucknow","lot_number":"Uttar Pradesh","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-022","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-022","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"Independent Auditor","last_inspection_date":"Approved","condition":"2023-05-24","remarks":"2024-02-19"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-022',
  'SLE-2025-022',
  false,
  '{"udm":"QR-SLE-2025-022","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-022',
  '2025-05-03',
  '2',
  'Factory Inspection',
  '2023-04-29',
  '2024-02-19',
  'Lucknow',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'RAI-2025-023',
  'Rail Pad',
  'EVA Pad',
  '{"vendor_name":"PQR Concrete Ltd","vendor_code":"VND11223","location":"Nagpur","lot_number":"Maharashtra","date_of_supply":"India"}',
  '{"qr_id":"LOT-RAI-2025-023","laser_marked":false,"linked_portals":{"udm":"QR-RAI-2025-023","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"RDSO","last_inspection_date":"Approved","condition":"2024-12-27","remarks":"2025-07-07"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-RAI-2025-023',
  'RAI-2025-023',
  false,
  '{"udm":"QR-RAI-2025-023","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'RAI-2025-023',
  '2029-12-06',
  '5',
  'Factory Inspection',
  '2024-12-02',
  '2025-07-07',
  'Nagpur',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'RAI-2025-024',
  'Rail Pad',
  'EVA Pad',
  '{"vendor_name":"LMN Foundries","vendor_code":"VND98765","location":"Raipur","lot_number":"Chhattisgarh","date_of_supply":"India"}',
  '{"qr_id":"LOT-RAI-2025-024","laser_marked":false,"linked_portals":{"udm":"QR-RAI-2025-024","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"Independent Auditor","last_inspection_date":"Approved","condition":"2023-08-07","remarks":"2023-10-10"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-RAI-2025-024',
  'RAI-2025-024',
  false,
  '{"udm":"QR-RAI-2025-024","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'RAI-2025-024',
  '2025-07-17',
  '2',
  'Factory Inspection',
  '2023-07-13',
  '2023-10-10',
  'Raipur',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-025',
  'Sleeper',
  'Steel Sleeper',
  '{"vendor_name":"DEF Rubber Industries","vendor_code":"VND54321","location":"Howrah","lot_number":"West Bengal","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-025","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-025","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"Railway QA Team","last_inspection_date":"Approved","condition":"2024-01-04","remarks":"2025-01-06"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-025',
  'SLE-2025-025',
  false,
  '{"udm":"QR-SLE-2025-025","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-025',
  '2025-12-14',
  '2',
  'Factory Inspection',
  '2023-12-10',
  '2025-01-06',
  'Howrah',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-026',
  'Sleeper',
  'Prestressed Concrete Sleeper',
  '{"vendor_name":"RST Engineering","vendor_code":"VND33445","location":"Lucknow","lot_number":"Uttar Pradesh","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-026","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-026","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"RDSO","last_inspection_date":"Approved","condition":"2023-02-22","remarks":"2023-03-16"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-026',
  'SLE-2025-026',
  false,
  '{"udm":"QR-SLE-2025-026","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-026',
  '2028-02-01',
  '5',
  'Factory Inspection',
  '2023-01-28',
  '2023-03-16',
  'Lucknow',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-027',
  'Sleeper',
  'Steel Sleeper',
  '{"vendor_name":"XYZ Polymers Ltd","vendor_code":"VND67890","location":"Kapurthala","lot_number":"Punjab","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-027","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-027","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"RDSO","last_inspection_date":"Approved","condition":"2023-07-25","remarks":"2023-08-22"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-027',
  'SLE-2025-027',
  false,
  '{"udm":"QR-SLE-2025-027","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-027',
  '2028-07-03',
  '5',
  'Factory Inspection',
  '2023-06-30',
  '2023-08-22',
  'Kapurthala',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'RAI-2025-028',
  'Rail Pad',
  'EVA Pad',
  '{"vendor_name":"RST Engineering","vendor_code":"VND33445","location":"Lucknow","lot_number":"Uttar Pradesh","date_of_supply":"India"}',
  '{"qr_id":"LOT-RAI-2025-028","laser_marked":false,"linked_portals":{"udm":"QR-RAI-2025-028","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2023}',
  '{"in_service_date":"RITES","last_inspection_date":"Approved","condition":"2023-11-24","remarks":"2024-02-25"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-RAI-2025-028',
  'RAI-2025-028',
  false,
  '{"udm":"QR-RAI-2025-028","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'RAI-2025-028',
  '2025-11-03',
  '2',
  'Factory Inspection',
  '2023-10-30',
  '2024-02-25',
  'Lucknow',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'RAI-2025-029',
  'Rail Pad',
  'Composite Rubber Pad',
  '{"vendor_name":"XYZ Polymers Ltd","vendor_code":"VND67890","location":"Kapurthala","lot_number":"Punjab","date_of_supply":"India"}',
  '{"qr_id":"LOT-RAI-2025-029","laser_marked":false,"linked_portals":{"udm":"QR-RAI-2025-029","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"Railway QA Team","last_inspection_date":"Approved","condition":"2024-11-17","remarks":"2025-10-11"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-RAI-2025-029',
  'RAI-2025-029',
  false,
  '{"udm":"QR-RAI-2025-029","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'RAI-2025-029',
  '2027-10-28',
  '3',
  'Factory Inspection',
  '2024-10-23',
  '2025-10-11',
  'Kapurthala',
  'Factory Inspection'
);


INSERT INTO track_fittings (fitting_id, name, type, manufacturer, qr_code, warranty, performance)
VALUES (
  'SLE-2025-030',
  'Sleeper',
  'Steel Sleeper',
  '{"vendor_name":"XYZ Polymers Ltd","vendor_code":"VND67890","location":"Kapurthala","lot_number":"Punjab","date_of_supply":"India"}',
  '{"qr_id":"LOT-SLE-2025-030","laser_marked":false,"linked_portals":{"udm":"QR-SLE-2025-030","tms":"True"}}',
  '{"start_date":"UDM: www.ireps.gov.in","end_date":"TMS: www.irecept.gov.in","warranty_period_years":2024}',
  '{"in_service_date":"RITES","last_inspection_date":"Approved","condition":"2024-09-03","remarks":"2025-03-16"}'
);


INSERT INTO qr_codes (qr_id, fitting_id, laser_marked, linked_portals)
VALUES (
  'LOT-SLE-2025-030',
  'SLE-2025-030',
  false,
  '{"udm":"QR-SLE-2025-030","tms":"True"}'
);


INSERT INTO inspections (fitting_id, stage, date, inspected_by, status, remarks, location, inspector_credentials)
VALUES (
  'SLE-2025-030',
  '2029-08-13',
  '5',
  'Factory Inspection',
  '2024-08-09',
  '2025-03-16',
  'Kapurthala',
  'Factory Inspection'
);