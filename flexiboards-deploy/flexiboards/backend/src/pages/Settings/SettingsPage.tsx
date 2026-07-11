import AppLayout from "../../layouts/AppLayout";
import ContactDetailsForm from "./ContactDetailsForm";

export default function SettingsPage() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <ContactDetailsForm />
    </AppLayout>
  );
}
