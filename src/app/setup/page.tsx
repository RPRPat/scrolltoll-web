import SetupPageClient from "./SetupPageClient";

export const dynamic = "force-dynamic";

type SetupPageProps = {
  searchParams?: {
    uid?: string;
    charity?: string;
    amount?: string;
  };
};

export default function SetupPage({ searchParams }: SetupPageProps) {
  return (
    <SetupPageClient
      uid={searchParams?.uid ?? ""}
      charity={searchParams?.charity ?? ""}
      amount={searchParams?.amount ?? ""}
    />
  );
}
