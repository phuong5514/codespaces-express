/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        DROP TABLE IF EXISTS WeeklyTasks;
        DROP TABLE IF EXISTS MonthlyTasks;
        DROP TABLE IF EXISTS NonRepeatedTasks;
        DROP TABLE IF EXISTS RepeatedTasks;
        DROP TABLE IF EXISTS Tasks;

        DROP TABLE IF EXISTS "WeeklyTasks";
        DROP TABLE IF EXISTS "MonthlyTasks";
        DROP TABLE IF EXISTS "NonRepeatedTasks";
        DROP TABLE IF EXISTS "RepeatedTasks";
        DROP TABLE IF EXISTS "Tasks";


        -- Main Tasks table
        CREATE TABLE "Tasks" (
            "TaskID" SERIAL PRIMARY KEY,
            "Name" VARCHAR(100) NOT NULL,
            "Description" VARCHAR(255),
            "StartTime" TIME,
            "EndTime" TIME,
            "TaskType" VARCHAR(20) CHECK ("TaskType" IN ('Daily', 'Weekly', 'Monthly', 'NonRepeated'))
        );

        -- Table for weekly tasks with a specified day
        CREATE TABLE "WeeklyTasks" (
            "TaskID" INT PRIMARY KEY REFERENCES "Tasks"("TaskID") ON DELETE CASCADE,
            "Weekday" VARCHAR(10) CHECK ("Weekday" IN ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'))
        );

        -- Table for monthly tasks with a specific day of the month
        CREATE TABLE "MonthlyTasks" (
            "TaskID" INT PRIMARY KEY REFERENCES "Tasks"("TaskID") ON DELETE CASCADE,
            "RepeatedDay" INT CHECK ("RepeatedDay" BETWEEN 1 AND 31)
        );

        -- Table for non-repeated tasks with a specific planned date
        CREATE TABLE "NonRepeatedTasks" (
            "TaskID" INT PRIMARY KEY REFERENCES "Tasks"("TaskID") ON DELETE CASCADE,
            "PlannedDate" DATE NOT NULL
        );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`
        DROP TABLE IF EXISTS "WeeklyTasks";
        DROP TABLE IF EXISTS "MonthlyTasks";
        DROP TABLE IF EXISTS "NonRepeatedTasks";
        DROP TABLE IF EXISTS "RepeatedTasks";
        DROP TABLE IF EXISTS "Tasks";
    `);
};


