import SetupSuccessClient from "./SetupSuccessClient";

export const dynamic = "force-dynamic";

type SetupSuccessPageProps = {
  searchParams?: Promise<{
    session_id?: string;
    purpose?: string;
  }>;
};

export default async function SetupSuccessPage({ searchParams }: SetupSuccessPageProps) {
  const params = await searchParams;
  const purpose = params?.purpose === "account" ? "account" : "setup";
  return <SetupSuccessClient sessionId={params?.session_id ?? ""} purpose={purpose} />;
}
