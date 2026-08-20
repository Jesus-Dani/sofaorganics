import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { getAllPostsForAdmin } from "@/lib/admin/blog";
import { deleteBlogPost } from "@/lib/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata = { title: "Blog · Admin" };

export default async function AdminBlogPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-1.5 bg-primary px-4 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus size={15} aria-hidden />
          New post
        </Link>
      </div>

      <div className="border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-alt text-left text-xs uppercase text-text-muted">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border last:border-0 hover:bg-background-alt">
                <td className="px-4 py-3">
                  <Link href={`/admin/blog/${post.id}/edit`} className="font-medium text-text hover:text-primary">
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-muted capitalize">{post.status}</td>
                <td className="px-4 py-3 text-text-muted">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Not published"}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton
                    onDelete={deleteBlogPost.bind(null, post.id)}
                    confirmMessage={`Delete "${post.title}"? This can't be undone.`}
                  />
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
