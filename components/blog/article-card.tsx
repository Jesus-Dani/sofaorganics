import Image from "next/image";
import Link from "next/link";
import { PlaceholderPhoto } from "@/components/ui/placeholder-photo";
import type { BlogPostRow } from "@/types/database.types";

export function ArticleCard({ post }: { post: BlogPostRow }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block border border-border bg-background transition-colors hover:border-primary">
      <div className="relative aspect-square overflow-hidden bg-background-alt">
        {post.cover_image_path ? (
          <Image
            src={post.cover_image_path}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 600px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <PlaceholderPhoto label={post.title} />
        )}
      </div>
      <div className="space-y-1.5 p-4">
        <h3 className="font-serif text-base text-text">{post.title}</h3>
        {post.published_at && (
          <p className="text-xs text-text-muted">
            {new Date(post.published_at).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
      </div>
    </Link>
  );
}
