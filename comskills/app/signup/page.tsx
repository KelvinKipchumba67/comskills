import { redirect } from "next/navigation";

//Forward them to the sign up form.
export default function SignupRedirect() {
    redirect("/auth?mode=signup");
}