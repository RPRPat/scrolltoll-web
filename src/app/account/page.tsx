import AccountPageClient from "./AccountPageClient";

export const dynamic = "force-dynamic";

type AccountPageProps = {
  searchParams?: {
    uid?: string;
  };
};

export default function AccountPage({ searchParams }: AccountPageProps) {
  return <AccountPageClient uid={searchParams?.uid ?? ""} />;
}
