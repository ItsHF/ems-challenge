-- Drop tables if they exist
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Timesheets;

-- Create Employees Table
CREATE TABLE Employees (
    Id INTEGER PRIMARY KEY,  -- Auto-increment primary key
    Name TEXT NOT NULL,
    Email TEXT NOT NULL,
    PhoneNumber TEXT NOT NULL,
    DateOfBirth TEXT NOT NULL,  -- Use TEXT to store ISO 8601 date format (YYYY-MM-DD)
    JobTitle TEXT NOT NULL,
    Department TEXT NOT NULL,
    Salary REAL NOT NULL,  -- SQLite uses REAL for floating-point numbers
    StartDate TEXT NOT NULL,  -- Store date as ISO 8601 string (YYYY-MM-DD)
    EndDate TEXT NULL  -- Nullable EndDate
);

-- Create Timesheets Table
CREATE TABLE Timesheets (
    Id INTEGER PRIMARY KEY ,  -- Auto-increment primary key
    EmployeeId INTEGER NOT NULL,  -- Foreign key reference to Employees
    StartTime TEXT NOT NULL,  -- Store as ISO 8601 string (YYYY-MM-DD HH:MM:SS)
    EndTime TEXT NOT NULL,  -- Store as ISO 8601 string (YYYY-MM-DD HH:MM:SS)
    Summary TEXT NOT NULL,
    FOREIGN KEY (EmployeeId) REFERENCES Employees(Id) ON DELETE CASCADE
);


