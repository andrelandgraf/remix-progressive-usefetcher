import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { subscribeToNewsletter } from "~/db";
import type { FormState, SessionData } from "~/session.server";
import { getSessionData, setSessionData } from "~/session.server";

function buildSessionData(formState: FormState): SessionData {
    return { formState };
}

export async function action({ request }: ActionArgs) {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    if(!name || !email || typeof name !== "string" || typeof email !== "string") {
        const data = buildSessionData({ success: false, error: 'Some data is missing. Please fill out all fields.' });
        const headers = await setSessionData(request, data);
        return redirect('/without-javascript', { headers });
    }
    const succ = await subscribeToNewsletter(name, email);
    if(!succ) {
        const data = buildSessionData({ success: false, error: 'Something went wrong. There was an error saving your data. Please try again.' });
        const headers = await setSessionData(request, data);
        return redirect('/without-javascript', { headers });
    }
    const data = buildSessionData({ success: true, error: '' });
    const headers = await setSessionData(request, data);
    return redirect('/without-javascript', { headers });
}

export async function loader({ request }: ActionArgs) {
    const { formState } = await getSessionData(request);
    const headers = await setSessionData(request, buildSessionData({ success: false, error: '' }));
    return json({ formState }, { headers });
}

export default function WithoutJavaScriptPage() {
    const data = useLoaderData<typeof loader>();
    return (
        <main>
            <h1>Step 1: Without JavaScript</h1>
            <p>
                This version of the form uses no client-side JavaScript.
                It uses the a session cookie on the server to show an error message if the form is submitted with invalid data.
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
                    data.formState.error && (
                        <p style={{ color: "red" }}>
                            {data.formState.error}
                        </p>
                    )
                }
                {
                    data.formState.success && (
                        <p style={{ color: "green" }}>
                            You have been subscribed to the newsletter!
                        </p>
                    )
                }
                <button type="submit">Submit</button>
            </form>
        </main>
    )
}
