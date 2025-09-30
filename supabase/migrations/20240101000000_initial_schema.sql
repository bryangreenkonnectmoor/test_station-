-- Create audiences table
CREATE TABLE IF NOT EXISTS audiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age_range TEXT NOT NULL,
  gender TEXT NOT NULL,
  location TEXT NOT NULL,
  interests TEXT[] NOT NULL,
  income_level TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create concepts table
CREATE TABLE IF NOT EXISTS concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audience_id UUID REFERENCES audiences(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  parent_concept_id UUID REFERENCES concepts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;

-- Create policies for audiences (allow all operations for now - in production, you'd restrict by user)
CREATE POLICY "Enable read access for all users" ON audiences
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON audiences
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON audiences
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON audiences
  FOR DELETE USING (true);

-- Create policies for concepts (allow all operations for now)
CREATE POLICY "Enable read access for all users" ON concepts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON concepts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON concepts
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON concepts
  FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_concepts_audience_id ON concepts(audience_id);
CREATE INDEX IF NOT EXISTS idx_concepts_parent_concept_id ON concepts(parent_concept_id);
CREATE INDEX IF NOT EXISTS idx_audiences_created_at ON audiences(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_concepts_created_at ON concepts(created_at DESC);
