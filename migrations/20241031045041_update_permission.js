/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        -- Grant usage on the public schema to the 'anon' role
        GRANT USAGE ON SCHEMA public TO anon;

        -- Grant select on all existing tables in the public schema to the 'anon' role
        GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

        -- Grant select on all future tables in the public schema to the 'anon' role
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`
        -- Optionally, revoke the permissions if needed during rollback
        REVOKE USAGE ON SCHEMA public FROM anon;
        REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon;

        -- Note: Revoking default privileges can be complex. Adjust based on your needs.
    `);
};