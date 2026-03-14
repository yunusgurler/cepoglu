"use client";

import { useFormStatus } from "react-dom";

export default function GallerySaveOrderButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="admin-button" disabled={pending}>
      {pending ? "Kaydediliyor..." : "Galeri Siralamasini Kaydet"}
    </button>
  );
}
