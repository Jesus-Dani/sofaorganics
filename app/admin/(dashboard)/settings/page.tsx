import { getStoreSettings } from "@/lib/admin/settings";
import { SettingsForm } from "@/components/admin/settings-form";
import { PasswordChangeForm } from "@/components/admin/password-change-form";

export const metadata = { title: "Settings · Admin" };

export default async function SettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="mb-6 text-2xl">Settings</h1>
        <SettingsForm settings={settings} />
      </div>
      <div className="max-w-lg border-t border-border pt-8">
        <PasswordChangeForm />
      </div>
    </div>
  );
}
