"use client";

import { useFormStatus } from "react-dom";

export default function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="admin-button" disabled={pending}>
      {pending ? "Giris yapiliyor..." : "Giris Yap"}
    </button>
  );
}
