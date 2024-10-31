exports.up = async function(knex) {
    await knex.raw(`
        create role anon nologin;

        grant usage on schema public to anon;
        grant select on public.category to anon;
    `);
};

exports.down = async function(knex) {
    await knex.raw(`
        drop role anon;
    `);
};