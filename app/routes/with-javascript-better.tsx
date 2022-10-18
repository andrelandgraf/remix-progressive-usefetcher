import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { subscribeToNewsletter } from "~/db";
import { flashFormState, getSessionFormState } from "~/session.server";

export async function action({ request }: ActionArgs) {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    if(!name || !email || typeof name !== "string" || typeof email !== "string") {
        const formState = { success: false, error: 'Some data is missing. Please fill out all fields.' };
        const headers = await flashFormState(request, formState);
        return redirect('/with-javascript-better', { headers });
    }
    const succ = await subscribeToNewsletter(name, email);
    if(!succ) {
        const formState = { success: false, error: 'Something went wrong. There was an error saving your data. Please try again.' };
        const headers = await flashFormState(request, formState);
        return redirect('/with-javascript-better', { headers });
    }
    const headers = await flashFormState(request, { success: true, error: '' });
    return redirect('/with-javascript-better', { headers });
}

export async function loader({ request }: ActionArgs) {
    const [formState, headers] = await getSessionFormState(request);
    return json({ formState }, { headers });
}

export default function WithJavaScriptBetterPage() {
    const data = useLoaderData<typeof loader>();
    const fetcher = useFetcher();
    const formRef = useRef<HTMLFormElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    // The success and error messages are now shown even if JavaScript is not available.
    const [error, setError] = useState(data.formState.error);
    const [showSuccessMsg, setShowSuccessMsg] = useState(data.formState.success);

    useEffect(() => {
        if(fetcher.state === 'submitting') {
            // JavaScript to clean messages when submitting
            setShowSuccessMsg(false);
            setError('');
        }
    }, [fetcher.state]);

    useEffect(() => {
        let timeout: number;
        if(data.formState.success) {
            // JavaScript to reset form and focus
            formRef.current?.reset();
            nameRef.current?.focus();
            setShowSuccessMsg(true);
            setError('');
            timeout = window.setTimeout(() => {
                // JavaScript to hide success message after timeout
                setShowSuccessMsg(false);
            }, 5000);
        } else if(data.formState.error) {
            setShowSuccessMsg(false);
            setError(data.formState.error);
        }
        return () => {
            if(timeout) window.clearTimeout(timeout);
        };
    }, [data]);

    return (
        <main>
            <h1>Step 2: With JavaScript (Better)</h1>
            <p>
                This version of the form uses `useFetcher`, cookies, and action redirects to create an enhanced user experience.
                We went back to the first version and enhanced it with JavaScript.
                We use `useFetcher.From` but for simple cases without multiple concurrent submissions, `Form` works as well.
            </p>
            <p>
                Now we can show success and error messages even if JavaScript is not available.
            </p>
            <fetcher.Form ref={formRef} method="post" action="/with-javascript-better" replace>
                <h2>Subscribe to newsletter</h2>
                <div>
                    <label htmlFor="name-input">Name</label>
                    <input
                        ref={nameRef}
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
                    error && (
                        <p style={{ color: "red" }}>
                            {error}
                        </p>
                    )
                }
                {
                    showSuccessMsg && (
                        <p style={{ color: "green" }}>
                            You have been subscribed to the newsletter!
                        </p>
                    )
                }
                <button type="submit" disabled={fetcher.state === 'submitting'}>
                    {fetcher.state === 'submitting' ? "Submitting..." : "Submit"}
                </button>
            </fetcher.Form>
        </main>
    )
}
