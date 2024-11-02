/**
 * Views and Functions for Task Queries
 */
exports.up = async function(knex) {
    await knex.raw(`
        -- View for today's tasks (only the basic information, the extra details require additional calls)
        CREATE OR REPLACE VIEW public."TodayTasks" AS
        SELECT t.* 
        FROM public."Tasks" t
        WHERE t."TaskType" = 'Daily'
        OR t."TaskID" IN (
            -- Weekly tasks that occur on today's weekday
            SELECT w."TaskID"
            FROM public."WeeklyTasks" w
            WHERE w."Weekday" = TO_CHAR(CURRENT_DATE, 'Day')
            
            UNION

            -- Monthly tasks that are scheduled for today's day of the month
            SELECT m."TaskID"
            FROM public."MonthlyTasks" m
            WHERE m."RepeatedDay" = EXTRACT(DAY FROM CURRENT_DATE)
            
            UNION

            -- Non-repeated tasks scheduled for today's date
            SELECT nr."TaskID"
            FROM public."NonRepeatedTasks" nr
            WHERE nr."PlannedDate" = CURRENT_DATE
        );

        -- Function to get monthly and non-repeating tasks before a specific day
        CREATE OR REPLACE FUNCTION public."TasksUpToDate"(input_date DATE)
        RETURNS TABLE (
            "TaskID" INT,
            "Name" VARCHAR,
            "Description" VARCHAR,
            "StartTime" TIME,
            "EndTime" TIME,
            "TaskType" VARCHAR
        ) AS $$
        BEGIN
            RETURN QUERY 
            SELECT 
                t."TaskID", t."Name", t."Description", t."StartTime", t."EndTime", t."TaskType"
            FROM 
                public."Tasks" t
            LEFT JOIN 
                public."MonthlyTasks" m ON t."TaskID" = m."TaskID" AND t."TaskType" = 'Monthly'
            LEFT JOIN 
                public."NonRepeatedTasks" nr ON t."TaskID" = nr."TaskID" AND t."TaskType" = 'NonRepeated'
            WHERE 
                (t."TaskType" = 'Monthly' AND m."RepeatedDay" BETWEEN DATE_PART('day', CURRENT_DATE) AND DATE_PART('day', input_date))
                OR (t."TaskType" = 'NonRepeated' AND nr."PlannedDate" BETWEEN CURRENT_DATE AND input_date);
        END;
        $$ LANGUAGE plpgsql;

        -- Function to get paginated non-repeated tasks
        CREATE OR REPLACE FUNCTION public."GetNonRepeatedTasks"(
            page INT, 
            items_per_page INT, 
            past_tasks BOOLEAN DEFAULT FALSE, 
            order_direction TEXT DEFAULT 'ASC',
            query TEXT DEFAULT ''
        ) 
        RETURNS SETOF public."Tasks" AS $$
        DECLARE
            offset_value INT;
            sql_query TEXT;
        BEGIN
            offset_value := (page - 1) * items_per_page;

            -- Construct the SQL query with dynamic order direction and search functionality
            sql_query := format(
                'SELECT t.* 
                FROM public."Tasks" t
                JOIN public."NonRepeatedTasks" nrt ON t."TaskID" = nrt."TaskID"
                WHERE t."TaskType" = ''NonRepeated''
                AND (%L OR nrt."PlannedDate" >= CURRENT_DATE)
                AND (%L = '' OR t."Name" ILIKE %L OR t."Description" ILIKE %L)
                ORDER BY nrt."PlannedDate" %s
                LIMIT %s OFFSET %s',
                past_tasks,
                query,
                '%' || query || '%',
                '%' || query || '%',
                order_direction,
                items_per_page,
                offset_value
            );

            -- Execute the dynamically built query and return results
            RETURN QUERY EXECUTE sql_query;
        END; 
        $$ LANGUAGE plpgsql;


    `);
};

/**
 * Drop Views and Functions on Rollback
 */
exports.down = async function(knex) {
    await knex.raw(`
        DROP VIEW IF EXISTS public.today_tasks;
        DROP VIEW IF EXISTS public.this_week_tasks;
        DROP FUNCTION IF EXISTS public.get_non_repeated_tasks;
        DROP FUNCTION IF EXISTS public.get_query_task;
    `);
};
