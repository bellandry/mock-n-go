import { Metadata } from "next";
import MockDetailClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Mock Details",
  description: "View and manage your mock API endpoint details",
};

export default function MockDetailPage() {
  return <MockDetailClientPage />;
}