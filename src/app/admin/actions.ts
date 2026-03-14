"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth";
import { hasSupabasePublicEnv, hasSupabaseServiceRoleEnv } from "@/lib/supabase/env";

type ActionState = {
  error?: string;
};

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  if (!hasSupabasePublicEnv()) {
    return { error: "Supabase ayarlari eksik. Once ortam degiskenlerini tanimlayin." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-posta ve sifre zorunludur." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Giris basarisiz. Bilgileri kontrol edin." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  if (!hasSupabasePublicEnv()) {
    redirect("/admin/login");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function deleteProjectAction(formData: FormData) {
  if (!hasSupabaseServiceRoleEnv()) {
    throw new Error("Supabase service role ayarlari eksik.");
  }

  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  const projectId = String(formData.get("projectId") ?? "");

  if (!projectId) {
    return;
  }

  const admin = createSupabaseAdminClient();
  const { data: mediaRows, error: mediaError } = await admin
    .from("project_media")
    .select("storage_path, kind")
    .eq("project_id", projectId);

  if (mediaError) {
    throw new Error(`Failed to load project media: ${mediaError.message}`);
  }

  const imagePaths = (mediaRows ?? [])
    .filter((item) => item.kind === "image")
    .map((item) => item.storage_path);
  const videoPaths = (mediaRows ?? [])
    .filter((item) => item.kind === "video")
    .map((item) => item.storage_path);

  if (imagePaths.length > 0) {
    const { error } = await admin.storage.from("project-images").remove(imagePaths);

    if (error) {
      throw new Error(`Failed to remove project images: ${error.message}`);
    }
  }

  if (videoPaths.length > 0) {
    const { error } = await admin.storage.from("project-videos").remove(videoPaths);

    if (error) {
      throw new Error(`Failed to remove project videos: ${error.message}`);
    }
  }

  const { error: deleteError } = await admin.from("projects").delete().eq("id", projectId);

  if (deleteError) {
    throw new Error(`Failed to delete project: ${deleteError.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/projeler");
}
