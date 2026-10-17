import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SecurityTab = ({ passwordForm, setPasswordForm, onSubmit, isLoading }) => (
  <div className="space-y-6">
    <h4 className="text-xl font-serif font-bold text-[#2A3B5F] dark:text-white">
      Security Settings
    </h4>
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Current Password</Label>
        <Input
          type="password"
          value={passwordForm.password}
          onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <Label>New Password</Label>
          <Input
            type="password"
            value={passwordForm.newpassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newpassword: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={passwordForm.confirmnewpassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, confirmnewpassword: e.target.value })
            }
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-[#2A3B5F] text-white w-full mt-4 shadow-lg shadow-[#2A3B5F]/20"
      >
        {isLoading ? "Updating..." : "Update Security Credentials"}
      </Button>
    </form>
  </div>
);
