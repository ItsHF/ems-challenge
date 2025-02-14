import { redirect } from "react-router"

export async function loader() {
  
    console.log("Redirecting to /employees")
  return redirect("/employees")
}

export default function RootPage() {
  return <></>
}
