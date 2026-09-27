/* ============================================================
   Shared shape for the signup form state.

   This lives OUTSIDE the "use server" module on purpose.

   A "use server" file may export only async functions — every export in one
   becomes a callable server endpoint, so a plain object or a constant is a
   hard error. It is not caught by `next build`; the module is validated when
   it is evaluated in the server-action graph, which means the first symptom
   is a 500 on submit in production:

     Error: A "use server" file can only export async functions, found object.

   So the action file exports the action and nothing else. Everything the
   client needs to describe the result of that action lives here.
   ============================================================ */

export type SignupState = {
  status: "idle" | "ok" | "error";
  message?: string;
};

export const SIGNUP_INITIAL: SignupState = { status: "idle" };
