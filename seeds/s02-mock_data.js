// for development only!

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("WeeklyTasks").del();
  await knex("MonthlyTasks").del();
  await knex("NonRepeatedTasks").del();
  await knex("RepeatedTasks").del();
  await knex("Tasks").del();

  // Insert sample data into Tasks table
  await knex("Tasks").insert([
      { TaskID: 1, Name: "Daily Meeting", Description: "Morning team meeting", StartTime: "09:00:00", EndTime: "09:30:00", TaskType: "Repeated" },
      { TaskID: 2, Name: "Weekly Project Sync", Description: "Project status update", StartTime: "14:00:00", EndTime: "15:00:00", TaskType: "Repeated" },
      { TaskID: 3, Name: "Monthly Report", Description: "Generate and review monthly report", StartTime: "10:00:00", EndTime: "12:00:00", TaskType: "Repeated" },
      { TaskID: 4, Name: "Doctor Appointment", Description: "Routine check-up", StartTime: "16:00:00", EndTime: "17:00:00", TaskType: "NonRepeated" }
  ]);

  // Insert sample data into RepeatedTasks table
  await knex("RepeatedTasks").insert([
      { TaskID: 1, Frequency: "Daily" },
      { TaskID: 2, Frequency: "Weekly" },
      { TaskID: 3, Frequency: "Monthly" }
  ]);

  // Insert sample data into WeeklyTasks table for weekly task
  await knex("WeeklyTasks").insert([
      { TaskID: 2, Weekdays: "0101010" } // Occurs on Tuesday, Thursday, Saturday
  ]);

  // Insert sample data into MonthlyTasks table for monthly task
  await knex("MonthlyTasks").insert([
      { TaskID: 3, RepeatedDay: 1 } // Occurs on the 1st of every month
  ]);

  // Insert sample data into NonRepeatedTasks table
  await knex("NonRepeatedTasks").insert([
      { TaskID: 4, PlannedDate: "2024-11-15" } // Single occurrence
  ]);
};

