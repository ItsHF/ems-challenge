// server/employees.ts
import { json } from "@remix-run/node";
import { getDB } from "~/db/getDB";

export const getEmployees = async () => {
    try {
        console.log("Fetching employees from database...");
        const db = await getDB();
        const rows = await db.all("SELECT * FROM Employees");

        const employees = rows.map((emp: any) => ({
            id: emp.Id,
            name: emp.Name,
            jobTitle: emp.JobTitle,
            department: emp.Department,
            email: emp.Email,
            phoneNumber: emp.PhoneNumber,
        }));

        console.log("Employees fetched:", employees);
        return json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        return json([]); // Return empty array in case of error
    }
};
