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


        CREATE TABLE "Tasks" (
            "TaskID" INT PRIMARY KEY,
            "Name" VARCHAR(100) NOT NULL,
            "Description" VARCHAR(255),
            "StartTime" TIME,
            "EndTime" TIME,
            "TaskType" VARCHAR(20) CHECK ("TaskType" IN ('Repeated', 'NonRepeated'))
        );

        CREATE TABLE "RepeatedTasks" (
            "TaskID" INT PRIMARY KEY,
            "Frequency" VARCHAR(50) CHECK ("Frequency" IN ('Daily', 'Weekly', 'Monthly')), -- Frequency of repetition
            FOREIGN KEY ("TaskID") REFERENCES "Tasks"("TaskID")
        );

        CREATE TABLE "WeeklyTasks" (
            "TaskID" INT PRIMARY KEY,
            "Weekdays" CHAR(7),  -- Binary string representing days of the week (e.g., '1010101')
            FOREIGN KEY ("TaskID") REFERENCES "RepeatedTasks"("TaskID")
        );

        CREATE TABLE "MonthlyTasks" (
            "TaskID" INT PRIMARY KEY,
            "RepeatedDay" INT CHECK ("RepeatedDay" BETWEEN 1 AND 31), 
            FOREIGN KEY ("TaskID") REFERENCES "RepeatedTasks"("TaskID")
        );

        CREATE TABLE "NonRepeatedTasks" (
            "TaskID" INT PRIMARY KEY,
            "PlannedDate" DATE,
            FOREIGN KEY ("TaskID") REFERENCES "Tasks"("TaskID")
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
