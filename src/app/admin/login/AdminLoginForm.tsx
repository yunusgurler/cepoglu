"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import LoginSubmitButton from "./LoginSubmitButton";

const initialState = {
  error: "",
};

export default function AdminLoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="admin-form">
      <label className="admin-field">
        <span>E-posta</span>
        <input type="email" name="email" autoComplete="email" required />
      </label>
      <label className="admin-field">
        <span>Sifre</span>
        <input type="password" name="password" autoComplete="current-password" required />
      </label>
      {state.error ? <p className="admin-error">{state.error}</p> : null}
      <LoginSubmitButton />
    </form>
  );
}
