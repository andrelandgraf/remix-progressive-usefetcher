import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      secrets: ["r3m1xr0ck5"],
      sameSite: "lax",
    },
  });

type FormState = {
    success: boolean;
    error: string;
}

export async function getSessionFormState(request: Request, headers = new Headers()): Promise<[FormState, Headers]> {
    const session = await getSession(request.headers.get("Cookie"));
    const data = session.get('formState');
    headers.append('Set-Cookie', await commitSession(session));
    if(!data) {
        return [{ success: false, error: '' }, headers];
    }
    return [JSON.parse(data), headers];
}

export async function flashFormState(request: Request, data: FormState, headers = new Headers()): Promise<Headers> {
    const session = await getSession(request.headers.get("Cookie"));
    session.flash('formState', JSON.stringify(data));
    headers.append('Set-Cookie', await commitSession(session));
    return headers;
}