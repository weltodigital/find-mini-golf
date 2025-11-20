-- Create the venues table
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  website TEXT,
  phone TEXT,
  region TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  rating DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the regions table
CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_venues_region ON venues(region);
CREATE INDEX IF NOT EXISTS idx_venues_latitude ON venues(latitude);
CREATE INDEX IF NOT EXISTS idx_venues_longitude ON venues(longitude);
CREATE INDEX IF NOT EXISTS idx_venues_name ON venues(name);
CREATE INDEX IF NOT EXISTS idx_regions_slug ON regions(slug);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
-- CREATE POLICY "Venues are viewable by everyone" ON venues
--   FOR SELECT USING (true);

-- CREATE POLICY "Regions are viewable by everyone" ON regions
--   FOR SELECT USING (true);