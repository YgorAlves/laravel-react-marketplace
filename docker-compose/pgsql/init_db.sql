# create databases
SELECT 'CREATE DATABASE marketplace'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '<db_name>')\gexec
SELECT 'CREATE DATABASE marketplace'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '<db_name>')\gexec

# create root user and grant rights
CREATE USER 'root' WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE 'marketplace' TO 'root';
GRANT ALL PRIVILEGES ON DATABASE 'marketplace_testing' TO 'root';
