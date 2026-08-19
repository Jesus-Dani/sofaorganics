import { notFound } from "next/navigation";
import { getPostForEdit } from "@/lib/admin/blog";
import { getAllProductsForAdmin } from "@/lib/admin/products";
import { BlogForm } from "@/components/admin/blog-form";

export const metadata = { title: "Edit Post · Admin" };

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const [post, products] = await Promise.all([
    getPostForEdit(params.id),
    getAllProductsForAdmin({ status: "published" }),
  ]);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl">{post.title}</h1>
      <BlogForm post={post} products={products.map((p) => ({ id: p.id, name: p.name }))} />
    </div>
  );
}
