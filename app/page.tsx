import { Hero } from "@/components/home/hero";
import { CategoryTiles } from "@/components/home/category-tiles";
import { Bestsellers } from "@/components/home/bestsellers";
import { BlogTeaser } from "@/components/home/blog-teaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryTiles />
      <Bestsellers />
      <BlogTeaser />
    </>
  );
}
