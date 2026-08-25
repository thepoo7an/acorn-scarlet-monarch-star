import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { MainScreen } from "@/components/compressor/main-screen";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell>
      <MainScreen />
    </AppShell>
  );
}
