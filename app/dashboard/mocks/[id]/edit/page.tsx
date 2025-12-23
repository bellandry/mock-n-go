import { Metadata } from "next";
import EditMockClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Edit Mock",
  description: "Edit your mock API endpoint configuration",
};

export default function EditMockPage() {
  return <EditMockClientPage />
}