-- Create sequence for statetypes id
CREATE SEQUENCE IF NOT EXISTS statetypes_statetype_id_seq;

-- Create statetypes table
CREATE TABLE IF NOT EXISTS statetypes (
  id int8 PRIMARY KEY DEFAULT nextval('statetypes_statetype_id_seq'),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  icon text NOT NULL,
  is_default boolean NOT NULL,
  description text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE statetypes ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow upserts for authorized users
CREATE POLICY "Upsert allowed for authorized users" ON statetypes
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Seed data
INSERT INTO statetypes (name, icon, is_default, description) VALUES
('new', 'fluent:star-20-regular', true, 'The initial state for a project. This deliverable needs you to add a summary of what you are supposed to produce.'),
('outline review', 'fluent:comment-badge-20-regular', true, 'The outline is in review.'),
('outline', 'fluent:document-bullet-list-20-regular', true, 'The deliverable is in the outline phase of writing.'),
('writing', 'hugeicons:quill-write-01', true, 'The deliverable is being written.'),
('draft review', 'fluent:comment-badge-20-regular', true, 'The draft is in review.'),
('approved', 'fluent:checkmark-circle-20-regular', true, 'The deliverable was approved by the stakeholder.'),
('research', 'fluent:lightbulb-filament-20-regular', true, 'The deliverable is in the information gathering phase.'),
('holding', 'fluent:pause-circle-20-regular', true, 'The deliverable is on hold, and work has been halted.');