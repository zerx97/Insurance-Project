#!/bin/bash
# Runs automatically on first Postgres container start (mounted into docker-entrypoint-initdb.d).
# Creates one database per service — the "database per service" pattern is the whole point:
# no service can accidentally join across another service's tables.
#
# NOTE: insurenext_auth is NOT created here - Postgres already creates it automatically from
# the POSTGRES_DB env var before any init script runs. We connect to the built-in "postgres"
# maintenance database (always guaranteed to exist) to issue the CREATE DATABASE commands for
# the remaining three.
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
    CREATE DATABASE insurenext_policy;
    CREATE DATABASE insurenext_billing;
    CREATE DATABASE insurenext_claims;
EOSQL
