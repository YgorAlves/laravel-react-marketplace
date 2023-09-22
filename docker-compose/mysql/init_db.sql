--create databases
CREATE DATABASE marketplace

--create root user and grant rights
CREATE USER 'root' WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE 'marketplace' TO 'root';
GRANT ALL PRIVILEGES ON DATABASE 'marketplace_testing' TO 'root';
