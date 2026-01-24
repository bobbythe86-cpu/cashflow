-- Create updates table
CREATE TABLE IF NOT EXISTS changelog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    version TEXT,
    type TEXT CHECK (type IN ('feature', 'improvement', 'fix')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE changelog ENABLE ROW LEVEL SECURITY;

-- Everyone can view updates
CREATE POLICY "Changelog is public" ON changelog FOR SELECT USING (true);

-- Only admins can manage (using our is_admin function if exists, or simple auth check)
CREATE POLICY "Admins can manage changelog" ON changelog FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert current updates
INSERT INTO changelog (title, description, version, type) VALUES 
('Pénztárcák Kezelése', 'Mostantól több pénztárcát (Bank, Készpénz, stb.) is kezelhetsz és láthatod az egyenlegüket.', '1.1.0', 'feature'),
('Költségvetés Tervező', 'Állíts be havi kereteket kategóriánként és kövesd a haladásodat az Irányítópulton.', '1.2.0', 'feature'),
('Vizuális Frissítések', 'Új, letisztultabb kártyák és animációk az Irányítópulton.', '1.2.1', 'improvement');
