import { PostsManager } from "@/components/admin/posts-manager";

export default function AdminPostsPage() {
  return (
    <>
      <h1 className="mb-6 text-3xl">Blogs</h1>
      <PostsManager />
    </>
  );
}
