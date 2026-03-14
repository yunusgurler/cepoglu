"use client";

import { useFormStatus } from "react-dom";

export default function AdminLogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="admin-button admin-button-ghost" disabled={pending}>
      {pending ? "Cikis yapiliyor..." : "Cikis Yap"}
    </button>
  );
}
