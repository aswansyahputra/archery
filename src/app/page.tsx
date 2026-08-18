"use client";
import dynamic from "next/dynamic";
import { SkeletonShell } from "@/app-shell/SkeletonShell";

const App = dynamic(() => import("@/app-shell/App").then((m) => m.App), {
  ssr: false,
  loading: () => <SkeletonShell />,
});

export default function Page() {
  return <App />;
}
