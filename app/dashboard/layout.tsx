import { auth } from "@clerk/nextjs/server";
import type { ReactNode } from "react";
import { DashboardShell } from "../../components/dashboard/dashboard-shell";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  await auth.protect();

  return <DashboardShell>{children}</DashboardShell>;
}
