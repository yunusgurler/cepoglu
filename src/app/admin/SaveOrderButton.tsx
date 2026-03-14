"use client";

import { useFormStatus } from "react-dom";

export default function SaveOrderButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="admin-button" disabled={pending}>
      {pending ? "Guncelleniyor..." : "Sirayi Guncelle"}
    </button>
  );
}
