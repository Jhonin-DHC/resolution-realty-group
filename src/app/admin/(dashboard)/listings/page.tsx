import { ListingsManager } from "@/components/admin/listings-manager";

export default function AdminListingsPage() {
  return (
    <>
      <h1 className="mb-6 text-3xl">Listings</h1>
      <ListingsManager />
    </>
  );
}
