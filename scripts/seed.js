import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, "../database.yaml");
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, "utf8"));

const { sqlite_path: sqlitePath } = dbConfig;

const db = new sqlite3.Database(sqlitePath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Employees Seed Data
const employees = [
    {
        Name: "John Doe",
        Email: "johndoe@example.com",
        PhoneNumber: "123-456-7890",
        DateOfBirth: "1985-05-10",
        JobTitle: "Software Engineer",
        Department: "Engineering",
        Salary: 70000.0,
        StartDate: "2022-01-15",
        EndDate: null, // End date is optional
        
    },
    {
        Name: "Jane Smith",
        Email: "janesmith@example.com",
        PhoneNumber: "987-654-3210",
        DateOfBirth: "1990-08-20",
        JobTitle: "HR Manager",
        Department: "Human Resources",
        Salary: 65000.0,
        StartDate: "2021-04-01",
        EndDate: null,
        
    },
    {
        Name: "Alice Johnson",
        Email: "alicejohnson@example.com",
        PhoneNumber: "555-123-4567",
        DateOfBirth: "1995-09-15",
        JobTitle: "Marketing Specialist",
        Department: "Marketing",
        Salary: 50000.0,
        StartDate: "2023-03-10",
        EndDate: null,
        
    },
];

// Timesheets Seed Data
const timesheets = [
    {
        EmployeeId: 1,
        StartTime: "2025-02-10 08:00:00",
        EndTime: "2025-02-10 17:00:00",
        Summary: "Worked on project Alpha development",
    },
    {
        EmployeeId: 2,
        StartTime: "2025-02-11 12:00:00",
        EndTime: "2025-02-11 17:00:00",
        Summary: "Conducted HR interviews for new candidates",
    },
    {
        EmployeeId: 3,
        StartTime: "2025-02-12 07:00:00",
        EndTime: "2025-02-12 16:00:00",
        Summary: "Worked on marketing campaign Beta",
    },
];

// Function to insert data into tables
const insertData = (table, data) => {
    return new Promise((resolve, reject) => {
        const columns = Object.keys(data[0]).join(", ");
        const placeholders = Object.keys(data[0]).map(() => "?").join(", ");
        const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

        data.forEach((row) => {
            insertStmt.run(Object.values(row), (err) => {
                if (err) {
                    console.error(`Error inserting into ${table}:`, err.message);
                    reject(err);
                }
            });
        });

        insertStmt.finalize(() => {
            console.log(`Inserted data into ${table}.`);
            resolve();
        });
    });
};

// Seed data into Employees and Timesheets tables
db.serialize(async () => {
    try {
        await insertData("Employees", employees);
        await insertData("Timesheets", timesheets);
    } catch (err) {
        console.error("Seeding failed:", err.message);
    } finally {
        db.close((err) => {
            if (err) {
                console.error("Error closing database:", err.message);
            } else {
                console.log("Database seeded successfully and connection closed.");
            }
        });
    }
});
