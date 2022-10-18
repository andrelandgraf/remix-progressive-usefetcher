import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { subscribeToNewsletter } from "~/db";

export async function action({ request }: ActionArgs) {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    if(!name || !email || typeof name !== "string" || typeof email !== "string") {
        return redirect("/without-javascript?error=missing-data");
    }
    const succ = await subscribeToNewsletter(name, email);
    if(!succ) {
        return redirect("/without-javascript?error=internal-error");
    }
    return redirect("/success");
}

export default function WithoutJavaScriptPage() {
    const [searchParams] = useSearchParams();
    const error = searchParams.get("error");
    const hasInternalError = error === "internal-error";
    const hasMissingData = error === "missing-data";
    return (
        <main>
            <h1>Step 1: Without JavaScript</h1>
            <p>
                This version of the form uses no client-side JavaScript.
                It uses the query string on the server to show an error message if the form is submitted with invalid data.
                The page reloads when the form is submitted.
            </p>
            <form method="post" action="/without-javascript">
                <h2>Subscribe to newsletter</h2>
                <div>
                    <label htmlFor="name-input">Name</label>
                    <input
                        id="name-input"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email-input">Email</label>
                    <input
                        id="email-input"
                        name="email"
                        type="email"
                        placeholder="johndoe@email.com"
                        required
                        />
                </div>
                {
                    hasInternalError && (
                        <p style={{ color: "red" }}>
                            There was an error saving your data. Please try again.
                        </p>
                    )
                }
                {
                    hasMissingData && (
                        <p style={{ color: "red" }}>
                            Please fill out all fields.
                        </p>
                    )
                }
                <button type="submit">Submit</button>
            </form>
        </main>
    )
}
