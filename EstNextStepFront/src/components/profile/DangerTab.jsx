import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export const DangerTab = ({ onDelete, isLoading }) => (
  <div className="space-y-6">
    <h4 className="text-xl font-serif font-bold text-red-600">Danger Zone</h4>
    <div className="p-6 border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-2xl">
      <p className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
        <Trash2 className="w-5 h-5" /> Permanent Deletion
      </p>
      <p className="text-sm text-red-600/80 mb-6 mt-2 leading-relaxed">
        By deleting your account, you will lose all access to your shared experiences and community
        forum contributions. This action cannot be undone.
      </p>
      <Button variant="destructive" onClick={onDelete} disabled={isLoading}>
        {isLoading ? "Deleting..." : "I understand, delete my account"}
      </Button>
    </div>
  </div>
);
