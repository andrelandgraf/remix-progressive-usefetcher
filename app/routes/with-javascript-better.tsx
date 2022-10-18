import type { ActionArgs  } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { subscribeToNewsletter } from "~/db";

type SetSearchParams =  (searchParams: URLSearchParams, { replace }: { replace: boolean } ) => void

function clearSearchParams(searchParams: URLSearchParams, setSearchParams: SetSearchParams) {
    const search = new URLSearchParams(searchParams);
    search.delete("success");
    search.delete("error");
    setSearchParams(search, { replace: true });
} 

export async function action({ request }: ActionArgs) {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    if(!name || !email || typeof name !== "string" || typeof email !== "string") {
        return redirect("/with-javascript-better?error=missing-data");
    }
    const succ = await subscribeToNewsletter(name, email);
    if(!succ) {
        return redirect("/with-javascript-better?error=internal-error");
    }
    return redirect("/with-javascript-better?success=true");
}

export default function WithJavaScriptBetterPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const fetcher = useFetcher();
    const formRef = useRef<HTMLFormElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const isSubmitting = fetcher.state === "submitting";
    // The success and error messages are now shown even if JavaScript is not available.
    const [showSuccessMsg, setShowSuccessMsg] = useState(searchParams.get("success") === "true");
    const error = searchParams.get("error");
    const hasInternalError = error === "internal-error";
    const hasMissingData = error === "missing-data";

    useEffect(() => {
        if(fetcher.state === 'submitting') {
            // JavaScript to clean messages when submitting
            setShowSuccessMsg(false);
            clearSearchParams(searchParams, setSearchParams);
        }
    }, [fetcher.state, searchParams, setSearchParams]);

    useEffect(() => {
        let timeout: number;
        if(searchParams.get("success") === "true") {
            // JavaScript to reset form and focus
            formRef.current?.reset();
            nameRef.current?.focus();
            setShowSuccessMsg(true);
            timeout = window.setTimeout(() => {
                // JavaScript to hide success message after timeout
                setShowSuccessMsg(false);
                clearSearchParams(searchParams, setSearchParams);
            }, 5000);
        }
        return () => {
            if(timeout) window.clearTimeout(timeout);
        };
    }, [searchParams, setSearchParams])

    return (
        <main>
            <h1>Step 2: With JavaScript (Better)</h1>
            <p>
                This version of the form uses `useFetcher` and action redirects to create an enhanced user experience.
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
