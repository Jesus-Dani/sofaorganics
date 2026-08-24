-- One-off data reset for client handoff — NOT a schema migration, do not
-- number/apply this alongside supabase/migrations/*. Run manually, once,
-- in the Supabase SQL Editor when you're ready to clear demo/seed content.
--
-- Deletes, in FK-safe order: orders (+ order_items via cascade), per-order
-- address snapshots, customer accounts (+ their saved addresses/wishlist
-- items via cascade), blog posts, and products (+ variants/images/facet
-- links via cascade).
--
-- Deliberately NOT touched:
--   - auth.users / admin_users — wiping auth.users would cascade-delete
--     admin_users too (admin_users.id references auth.users on delete
--     cascade) and lock you out of /admin. If you also want to remove test
--     customer sign-ups' actual login accounts, do that afterward from the
--     Supabase Dashboard's Authentication tab, where you can see exactly
--     which account is your own admin login before deleting anything.
--   - store_settings, shipping_rules, tax_rules — your real store config.
--   - site_content — the legal/policy page bodies (Disclaimer, Returns,
--     Privacy, Terms) are live content the client needs, not sample data.
--   - facets — Type/Origin/Use-Case taxonomy, not product data.
--
-- After running this, the product-images and blog-images Storage buckets
-- will still hold the now-unreferenced uploaded files (deleting these rows
-- doesn't delete the files). Clear those separately from Storage in the
-- Supabase Dashboard if you want a fully clean slate there too.

begin;

delete from orders;
delete from addresses;
delete from customer_profiles;
delete from blog_posts;
delete from products;

commit;
