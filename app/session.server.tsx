import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      secrets: ["r3m1xr0ck5"],
      sameSite: "lax",
    },
  });

export type FormState = {
    success: boolean;
    error: string;
}

export type SessionData = {
    formState: FormState;
}

export async function getSessionData(request: Request): Promise<SessionData> {
    const session = await getSession(request.headers.get("Cookie"));
    const data = session.get('data');
    if(!data) {
        return { formState: { success: false, error: '' } };
    }
    const parsed = JSON.parse(data);
    return parsed.formState ? parsed : { formState: { success: false, error: '' } };
}

export async function setSessionData(request: Request, data: SessionData, headers = new Headers()): Promise<Headers> {
    const session = await getSession(request.headers.get("Cookie"));
    session.set('data', JSON.stringify(data));
    headers.append('Set-Cookie', await commitSession(session));
    return headers;
}