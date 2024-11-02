/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries in case you want to reset data on each run
    await knex("WeeklyTasks").del();
    await knex("MonthlyTasks").del();
    await knex("NonRepeatedTasks").del();
    await knex("Tasks").del();
  
    // Insert data into the main Tasks table
    await knex("Tasks").insert([
      { TaskID: 1, Name: 'Daily Standup', Description: 'Daily team sync meeting', StartTime: '09:00', EndTime: '09:30', TaskType: 'Daily' },
      { TaskID: 2, Name: 'Weekly Sync', Description: 'Weekly planning session', StartTime: '10:00', EndTime: '11:00', TaskType: 'Weekly' },
      { TaskID: 3, Name: 'Monthly Report', Description: 'Monthly financial report preparation', StartTime: '14:00', EndTime: '15:00', TaskType: 'Monthly' },
      { TaskID: 4, Name: 'Project Deadline', Description: 'Deadline for current project milestone', StartTime: '12:00', EndTime: '13:00', TaskType: 'NonRepeated' }
    ]);
  
    // Insert data into WeeklyTasks table
    await knex("WeeklyTasks").insert([
      { TaskID: 2, Weekday: 'Monday' } // References Weekly Sync task
    ]);
  
    // Insert data into MonthlyTasks table
    await knex("MonthlyTasks").insert([
      { TaskID: 3, RepeatedDay: 15 } // References Monthly Report task
    ]);
  
    // Insert data into NonRepeatedTasks table
    await knex("NonRepeatedTasks").insert([
      { TaskID: 4, PlannedDate: knex.fn.now() } // References Project Deadline task, set for today's date
    ]);
  };
  