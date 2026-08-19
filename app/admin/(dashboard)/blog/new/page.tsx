import { redirect } from "next/navigation";
import { createDraftBlogPost } from "@/lib/admin/actions";

export default async function NewBlogPostPage() {
  const id = await createDraftBlogPost();
  redirect(`/admin/blog/${id}/edit`);
}
