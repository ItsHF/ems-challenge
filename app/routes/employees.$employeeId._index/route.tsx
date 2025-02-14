import { Form, useLoaderData, useNavigate } from "react-router-dom";

type Employee = {
    id: string;
    name: string;
    jobTitle: string;
    department: string;
    email: string;
    phoneNumber: string;
};

export default function EmployeeEdit() {
    const employee = useLoaderData<Employee>(); // Corrected loader data type
    const navigate = useNavigate();

    console.log("Client received employee data:", employee); // Debug log

    if (!employee) {
        return <div>Error: Employee not found.</div>;
    }

    return (
        <div>
            <h2>Edit Employee</h2>
            <Form method="post">
                <div>
                    <label>Name</label>
                    <input type="text" name="name" defaultValue={employee.name} />
                </div>
                <div>
                    <label>Job Title</label>
                    <input type="text" name="jobTitle" defaultValue={employee.jobTitle} />
                </div>
                <div>
                    <label>Department</label>
                    <input type="text" name="department" defaultValue={employee.department} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" defaultValue={employee.email} />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input type="tel" name="phoneNumber" defaultValue={employee.phoneNumber} />
                </div>
                <div>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => navigate("/employees")}>
                        Cancel
                    </button>
                </div>
            </Form>
        </div>
    );
}
