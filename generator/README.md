# PostgreSQL Type OID Generator

Generates PostgreSQL builtin type OIDs for `node-pg-types`.

## Usage

```sh
npm install
npm run generate
```

This will:

- Start all specified Postgres versions in containers
- Run the generator in another container
- Query for builtin type OIDs
- Generate `../lib/builtins.js`
- Tear down the containers

## Adding PostgreSQL Versions

To query additional PostgreSQL versions, edit the files in this directory:

1. Update the version list in `generate.js`
2. Add the new PostgreSQL service to `docker-compose.yml`
3. Add the service dependency to the generator service instructing it to wait for the PostgreSQL service to be ready

Types from multiple PostgreSQL versions are automatically merged.
