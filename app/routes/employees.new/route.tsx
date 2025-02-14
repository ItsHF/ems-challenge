import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB"; 

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const employee = {
        Name: formData.get("name"),
        Email: formData.get("email"),
        PhoneNumber: formData.get("phoneNumber"),
        DateOfBirth: formData.get("dateOfBirth"),
        JobTitle: formData.get("jobTitle"),
        Department: formData.get("department"),
        Salary: formData.get("salary"),
        StartDate: formData.get("startDate"),
        EndDate: formData.get("endDate") || null, 
      
    };

    const db = await getDB();
    await db.run(
        `INSERT INTO Employees (
            Name, Email, PhoneNumber, DateOfBirth, JobTitle,
            Department, Salary, StartDate, EndDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        Object.values(employee) 
    );

    return redirect("/employees");
};

export default function NewEmployeePage() {
    return (
        <div>
            <h1>Create New Employee</h1>
            <Form method="post">
                <div>
                    <label htmlFor="name">Name *</label>
                    <input type="text" name="name" id="name" required />
                </div>
                <div>
                    <label htmlFor="email">Email *</label>
                    <input type="email" name="email" id="email" required />
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number *</label>
                    <input type="tel" name="phoneNumber" id="phoneNumber" required />
                </div>
                <div>
                    <label htmlFor="dateOfBirth">Birth Date *</label>
                    <input type="date" name="dateOfBirth" id="dateOfBirth" required />
                </div>
                <div>
                    <label htmlFor="jobTitle">Job Title *</label>
                    <input type="text" name="jobTitle" id="jobTitle" required />
                </div>
                <div>
                    <label htmlFor="department">Department *</label>
                    <select name="department" id="department" required>
                        <option value="">Select Department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Finance">Finance</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="salary">Salary *</label>
                    <input type="number" name="salary" id="salary" min="1500" step="1" required />
                </div>
                <div>
                    <label htmlFor="startDate">Start Date *</label>
                    <input type="date" name="startDate" id="startDate" required />
                </div>
                <div>
                    <label htmlFor="endDate">End Date</label>
                    <input type="date" name="endDate" id="endDate" />
                </div>

                <button type="submit">Create Employee</button>
            </Form>
            <hr />
            <ul>
                <li><a href="/employees">Employees</a></li>
                <li><a href="/timesheets">Timesheets</a></li>
            </ul>
        </div>
    );
}