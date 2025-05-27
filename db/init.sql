-- db/init.sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  upload_time TIMESTAMP NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL  
);

CREATE TABLE processed_data (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES documents(id),
  data JSONB
);

