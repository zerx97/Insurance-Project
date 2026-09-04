#!/bin/bash
# Runs automatically on first Postgres container start (mounted into docker-entrypoint-initdb.d).
# Creates one database per service — the "database per service" pattern is the whole point:
# no service can accidentally join across another service's tables.
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE insurenext_auth;
    CREATE DATABASE insurenext_policy;
    CREATE DATABASE insurenext_billing;
    CREATE DATABASE insurenext_claims;
EOSQL
