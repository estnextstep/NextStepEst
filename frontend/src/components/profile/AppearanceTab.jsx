import { Bell, Palette } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { CustomToggle } from "./CustomToggle";

export const AppearanceTab = ({ emailNotifications, onToggleNotifications }) => (
  <div className="space-y-8">
    {/* Dark Mode */}
    <div>
      <h4 className="text-xl font-serif font-bold text-[#2A3B5F] dark:text-white mb-6">
        Appearance
      </h4>
      <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <Palette className="w-6 h-6 text-[#2A3B5F] dark:text-[#C5A059]" />
          </div>
          <div>
            <p className="font-bold text-[#2A3B5F] dark:text-white">Dark Mode</p>
            <p className="text-sm text-slate-500">Enable a darker interface for comfort</p>
          </div>
        </div>
        <ModeToggle />
      </div>
    </div>

    {/* Notifications */}
    <div className="space-y-4">
      <h4 className="text-xl font-serif font-bold text-[#2A3B5F] dark:text-white">
        Notifications
      </h4>
      <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <Bell className="w-6 h-6 text-[#2A3B5F] dark:text-[#C5A059]" />
          </div>
          <div>
            <p className="font-bold text-[#2A3B5F] dark:text-white">Email Notifications</p>
            <p className="text-sm text-slate-500">Receive alerts about forum activity via email</p>
          </div>
        </div>
        <CustomToggle checked={emailNotifications} onChange={onToggleNotifications} />
      </div>
    </div>
  </div>
);
