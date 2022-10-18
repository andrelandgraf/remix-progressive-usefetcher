import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { subscribeToNewsletter } from "~/db";

export async function action({ request }: ActionArgs) {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    if(!name || !email || typeof name !== "string" || typeof email !== "string") {
        return json({ error: "missing-data" });
    }
    const succ = await subscribeToNewsletter(name, email);
    if(!succ) {
        return json({ error: "internal-error" });
    }
    return json({ success: true });
}

export default function WithJavaScriptPage() {
    const fetcher = useFetcher();
    const formRef = useRef<HTMLFormElement>(null);
    const isSubmitting = fetcher.state === "submitting";
    const succeeded = fetcher.data?.success;
    const error = fetcher.data?.error;
    const hasInternalError = error === "internal-error";
    const hasMissingData = error === "missing-data";
    const [showSuccessMsg, setShowSuccessMsg] = useState(succeeded);

    useEffect(() => {
        let timeout: number;
        if(succeeded && formRef.current) {
            setShowSuccessMsg(true);
            formRef.current.reset();
            timeout = window.setTimeout(() => setShowSuccessMsg(false), 5000);
        } else {
            setShowSuccessMsg(false);
        }
        return () => {
            if(timeout) window.clearTimeout(timeout);
        };
    }, [succeeded])

    return (
        <main>
            <h1>Step 2: With JavaScript</h1>
            <p>
                This version of the form uses useFetcher and action data to create an enhanced user experience.
                For instance, the submit button is disabled and shows a loading indicator while the form is submitting.
                Also, the page does not reload when the form is submitted.
            </p>
            <p>
                But how does the experience look like if we remove the client-side JavaScript?
                The form will again perform a full page reload when the form is submitted.
                However, the error and success messages are not shown anymore.
                That is because `useFetcher.data` is only ever populated on the client-side.
                The server will always render a clean/reset action data state.
                The experience is worth than in our without JavaScript example if Scripts are removed
                or JavaScript not loaded otherwise.
            </p>
            <fetcher.Form ref={formRef} method="post" action="/with-javascript">
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
                {
                    showSuccessMsg && (
                        <p style={{ color: "green" }}>
                            You have been subscribed to the newsletter!
                        </p>
                    )
                }
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </fetcher.Form>
        </main>
    )
}
