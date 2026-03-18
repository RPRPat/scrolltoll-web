import SetupSuccessClient from "./SetupSuccessClient";

export const dynamic = "force-dynamic";

type SetupSuccessPageProps = {
  searchParams?: {
    session_id?: string;
    uid?: string;
  };
};

export default function SetupSuccessPage({ searchParams }: SetupSuccessPageProps) {
  return (
    <SetupSuccessClient
      sessionId={searchParams?.session_id ?? ""}
      uid={searchParams?.uid ?? ""}
    />
  );
}
