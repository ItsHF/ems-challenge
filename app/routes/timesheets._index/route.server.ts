// timesheet.server.ts
import { getDB } from "~/db/getDB";

// Define Timesheet type
export type Timesheet = {
    id: number;
    employeeId: number;
    date: string;
    hoursWorked: number;
    notes?: string;
};

// Fetch all timesheets
export async function getTimesheets(): Promise<Timesheet[]> {
    const db = await getDB();
    const rows = await db.all("SELECT Timesheets.*, Employees.Name AS employeeName FROM Timesheets JOIN Employees ON Timesheets.employeeId = Employees.id");

    return rows.map(row => ({
        id: row.id,
        employeeId: row.employeeId,
        employeeName: row.employeeName, // Joining with Employees table
        date: row.date,
        hoursWorked: row.hoursWorked,
        notes: row.notes
    }));
}

// Fetch a single timesheet by ID
export async function getTimesheetById(timesheetId: number): Promise<Timesheet | null> {
    const db = await getDB();
    const row = await db.get("SELECT * FROM Timesheets WHERE id = ?", [timesheetId]);

    if (!row) return null;

    return {
        id: row.id,
        employeeId: row.employeeId,
        date: row.date,
        hoursWorked: row.hoursWorked,
        notes: row.notes,
    };
}

// Create a new timesheet entry
export async function createTimesheet(employeeId: number, date: string, hoursWorked: number, notes?: string): Promise<Timesheet> {
    const db = await getDB();
    const result = await db.run(
        "INSERT INTO Timesheets (employeeId, date, hoursWorked, notes) VALUES (?, ?, ?, ?)",
        [employeeId, date, hoursWorked, notes || ""]
    );

    return {
        id: result.lastID,
        employeeId,
        date,
        hoursWorked,
        notes,
    };
}

// Update an existing timesheet
export async function updateTimesheet(timesheetId: number, date: string, hoursWorked: number, notes?: string): Promise<void> {
    const db = await getDB();
    await db.run(
        "UPDATE Timesheets SET date = ?, hoursWorked = ?, notes = ? WHERE id = ?",
        [date, hoursWorked, notes || "", timesheetId]
    );
}

// Delete a timesheet
export async function deleteTimesheet(timesheetId: number): Promise<void> {
    const db = await getDB();
    await db.run("DELETE FROM Timesheets WHERE id = ?", [timesheetId]);
}
