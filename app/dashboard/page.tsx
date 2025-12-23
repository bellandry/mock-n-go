import { Metadata } from "next";
import DashboardClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your mock APIs and view statistics",
};

export default function DashboardPage() {
  return <DashboardClientPage />
}