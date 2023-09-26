CREATE DATABASE marketplace

CREATE USER 'root' WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE 'marketplace' TO 'root';
GRANT ALL PRIVILEGES ON DATABASE 'marketplace_testing' TO 'root';
