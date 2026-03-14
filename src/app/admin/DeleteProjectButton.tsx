"use client";

import { useFormStatus } from "react-dom";

export default function DeleteProjectButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="admin-button admin-button-danger" disabled={pending}>
      {pending ? "Siliniyor..." : "Sil"}
    </button>
  );
}
