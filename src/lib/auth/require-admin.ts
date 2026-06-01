import { redirect } from "next/navigation";
import { getCurrentUser } from "./current-user";

/** Giriş yapmış üye gerekir. */
export async function requireMember() {
  const current = await getCurrentUser();
  if (!current) redirect("/sign-in");
  return current;
}

/** Admin sayfaları için. */
export async function requireAdmin() {
  const current = await getCurrentUser();
  if (!current) redirect("/sign-in?next=/admin");
  if (!current.isAdmin) redirect("/");
  return current;
}
