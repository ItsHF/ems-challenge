import { redirect, type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { json as remixJson } from "@remix-run/node";
import { getDB } from "~/db/getDB";

type Employee = {
    id: string;
    name: string;
    jobTitle: string;
    department: string;
    email: string;
    phoneNumber: string;
};

export const loader: LoaderFunction = async ({ params }) => {
    console.log("Loader received params:", params);

    if (!params.employeeId) {
        throw new Response("Employee ID missing", { status: 400 });
    }

    const id = parseInt(params.employeeId, 10);
    if (isNaN(id)) {
        throw new Response("Invalid Employee ID", { status: 400 });
    }

    const db = await getDB();
    const row = await db.get("SELECT * FROM Employees WHERE Id = ?", [id]);

    if (!row) {
        throw new Response("Employee not found", { status: 404 });
    }

    console.log("Returning employee:", row);
    return remixJson({
        id: row.Id,
        name: row.Name,
        jobTitle: row.JobTitle,
        department: row.Department,
        email: row.Email,
        phoneNumber: row.PhoneNumber,
    });
};

// Action function to handle updates
export const action: ActionFunction = async ({ request, params }) => {
    const formData = new URLSearchParams(await request.text());
    const employeeId = params.employeeId as string;

    // Create the updated employee data
    const updatedEmployee: Employee = {
        id: employeeId,
        name: formData.get("name") as string,
        jobTitle: formData.get("jobTitle") as string,
        department: formData.get("department") as string,
        email: formData.get("email") as string,
        phoneNumber: formData.get("phoneNumber") as string,
    };

    const db = await getDB();

    // Update the employee record in the database
    await db.run(
        "UPDATE Employees SET Name = ?, JobTitle = ?, Department = ?, Email = ?, PhoneNumber = ? WHERE Id = ?",
        [
            updatedEmployee.name,
            updatedEmployee.jobTitle,
            updatedEmployee.department,
            updatedEmployee.email,
            updatedEmployee.phoneNumber,
            employeeId,
        ]
    );

    // Redirect after successful update
    return redirect("/employees");
};
