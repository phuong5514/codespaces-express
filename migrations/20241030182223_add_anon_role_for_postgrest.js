require('dotenv').config();

exports.up = async function(knex) {
    await knex.raw(`
        CREATE role authenticator NOINHERIT LOGIN PASSWORD '${process.env.API_AMIN_PASS}';
        GRANT anon TO authenticator;
    `);
};

exports.down = async function(knex) {
    await knex.raw(`
        DROP role authenticator;
    `);
};