-- HMS PostgreSQL schema for County Hospital (Mombasa, Kenya)
-- Uses pgcrypto for UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES roles(id),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text,
  phone text,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nhif_number text,
  national_id text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  gender text,
  dob date,
  phone text,
  email text,
  address text,
  next_of_kin jsonb,
  created_at timestamptz DEFAULT now()
);

-- Visits
CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  visit_type text CHECK (visit_type IN ('outpatient','inpatient','emergency')),
  reason text,
  department text,
  doctor_id uuid REFERENCES users(id),
  status text DEFAULT 'open',
  start_time timestamptz DEFAULT now(),
  end_time timestamptz
);

-- Wards & beds
CREATE TABLE IF NOT EXISTS wards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  daily_rate numeric(12,2) DEFAULT 0
);
CREATE TABLE IF NOT EXISTS beds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ward_id uuid REFERENCES wards(id),
  bed_number text,
  is_available boolean DEFAULT true
);

-- Admissions
CREATE TABLE IF NOT EXISTS admissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid REFERENCES visits(id) ON DELETE CASCADE,
  bed_id uuid REFERENCES beds(id),
  admitted_by uuid REFERENCES users(id),
  admission_time timestamptz DEFAULT now(),
  discharge_time timestamptz,
  discharge_summary text
);

-- Drugs & Prescriptions
CREATE TABLE IF NOT EXISTS drugs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  generic_name text,
  unit text,
  price_kes numeric(12,2) NOT NULL,
  stock integer DEFAULT 0,
  expiry_date date,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid REFERENCES visits(id) ON DELETE CASCADE,
  prescribed_by uuid REFERENCES users(id),
  prescribed_at timestamptz DEFAULT now(),
  notes text
);
CREATE TABLE IF NOT EXISTS prescription_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE,
  drug_id uuid REFERENCES drugs(id),
  quantity integer,
  unit_price numeric(12,2),
  total numeric(12,2)
);

-- Lab tests
CREATE TABLE IF NOT EXISTS lab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  name text NOT NULL,
  description text,
  price_kes numeric(12,2)
);
CREATE TABLE IF NOT EXISTS lab_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid REFERENCES visits(id),
  requested_by uuid REFERENCES users(id),
  requested_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);
CREATE TABLE IF NOT EXISTS lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES lab_requests(id) ON DELETE CASCADE,
  test_id uuid REFERENCES lab_tests(id),
  result jsonb,
  entered_by uuid REFERENCES users(id),
  entered_at timestamptz DEFAULT now(),
  report_url text
);

-- Billing & Payments
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid REFERENCES visits(id),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  total_amount numeric(14,2) NOT NULL,
  nhif_covered_amount numeric(14,2) DEFAULT 0,
  patient_balance numeric(14,2) NOT NULL,
  status text CHECK (status IN ('pending','paid','nhif_claim','partial')) DEFAULT 'pending',
  invoice_pdf_url text
);
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  description text,
  qty integer DEFAULT 1,
  unit_price numeric(12,2),
  total numeric(14,2)
);
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id),
  amount numeric(14,2) NOT NULL,
  method text CHECK (method IN ('cash','mpesa','nhif')),
  transaction_ref text,
  metadata jsonb,
  paid_by uuid REFERENCES users(id),
  paid_at timestamptz DEFAULT now()
);

-- NHIF Claims
CREATE TABLE IF NOT EXISTS nhif_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id),
  claim_reference text,
  status text CHECK (status IN ('draft','submitted','approved','rejected')),
  submitted_at timestamptz,
  response jsonb
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  object_type text,
  object_id uuid,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patients_national_id ON patients(national_id);
CREATE INDEX IF NOT EXISTS idx_visits_patient_id ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
