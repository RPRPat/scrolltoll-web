import AccountPageClient from "./AccountPageClient";

export const dynamic = "force-dynamic";

export default function AccountPage() {
  // Identity is carried by the Firebase ID token in the URL fragment (read
  // client-side), not by a query param — so this page takes no searchParams.
  return <AccountPageClient />;
}
