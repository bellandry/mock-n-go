import { Metadata } from 'next';
import NewMockClientPage from './client-page';

export const metadata: Metadata = {
  title: "Create New Mock",
  description: "Create a new mock API endpoint with custom configuration",
};

export default function NewMockPage() {
  return (
    <NewMockClientPage />
  )
}