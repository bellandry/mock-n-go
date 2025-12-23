import { Metadata } from "next";
import MockClientPage from "./client-page";

export const metadata: Metadata = {
  title: "My Mocks",
  description: "View and manage all your mock API endpoints",
};

export default function MockPage() {
  return <MockClientPage />
}