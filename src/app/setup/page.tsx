import SetupPageClient from "./SetupPageClient";

export const dynamic = "force-dynamic";

type SetupPageProps = {
  searchParams?: Promise<{
    charity?: string;
    amount?: string;
    cancelled?: string;
  }>;
};

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const params = await searchParams;
  return (
    <SetupPageClient
      charity={params?.charity ?? ""}
      amount={params?.amount ?? ""}
      cancelled={params?.cancelled === "1"}
    />
  );
}
