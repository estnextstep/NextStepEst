import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Camera, Save } from "lucide-react";

export const EditProfileTab = ({
  editForm,
  setEditForm,
  onSave,
  onImageUpload,
}) => (
  <div className="space-y-6">
    <h4 className="text-xl font-serif font-bold text-[#2A3B5F] dark:text-white">
      Profile Information
    </h4>

    {/* Avatar Upload */}
    <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
      <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700">
        {editForm?.ImageURL ? (
          <img
            src={`http://localhost:8080${editForm.ImageURL}`}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <Camera className="w-8 h-8 text-slate-400" />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image-upload" className="cursor-pointer">
          <div className="px-4 py-2 bg-[#2A3B5F] text-white rounded-lg text-sm font-semibold hover:bg-[#2A3B5F]/90 transition-colors">
            Change Image
          </div>
        </Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageUpload}
        />
        <p className="text-[10px] text-slate-500 italic">
          Recommended: Square JPG or PNG, max 2MB
        </p>
      </div>
    </div>

    {/* Username (read-only) */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Username</Label>
        <Input
          value={editForm?.username || ""}
          disabled
          className="bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed border-dashed opacity-60"
        />
        <p className="text-[10px] text-slate-400 italic">
          Username cannot be changed
        </p>
      </div>
      <div className="invisible space-y-2">
        <Label>Hidden</Label>
        <Input />
      </div>
    </div>

    {/* Name */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>First Name</Label>
        <Input
          value={editForm?.firstName || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, firstName: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Last Name</Label>
        <Input
          value={editForm?.lastName || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, lastName: e.target.value })
          }
        />
      </div>
    </div>

    {/* Role + Major */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Role</Label>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {["ETUDIANT", "ALUMNI"].map((r) => (
            <button
              key={r}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                editForm?.role === r
                  ? "bg-white dark:bg-slate-700 text-[#2A3B5F] shadow-sm"
                  : "text-slate-500"
              }`}
              onClick={() => setEditForm({ ...editForm, role: r })}
            >
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Major</Label>
        <Input
          value={editForm?.major || ""}
          onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
        />
      </div>
    </div>

    {/* Email (read-only) */}
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-slate-400">
        Email{" "}
        <Badge variant="outline" className="text-[10px] font-normal py-0">
          Verified
        </Badge>
      </Label>
      <Input
        value={editForm?.email || ""}
        disabled
        className="bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed border-dashed opacity-60"
      />
    </div>

    {/* Bio */}
    <div className="space-y-2">
      <Label>Bio</Label>
      <textarea
        className="w-full min-h-20 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
        value={editForm?.bio || ""}
        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
      />
    </div>

    {/* LinkedIn */}
    <div className="space-y-2">
      <Label>LinkedIn</Label>
      <Input
        value={editForm?.linkedIn || ""}
        onChange={(e) => setEditForm({ ...editForm, linkedIn: e.target.value })}
        placeholder="https://linkedin.com/in/yourprofile"
      />
    </div>

    <Button
      onClick={onSave}
      className="bg-[#2A3B5F] text-white w-full shadow-lg shadow-[#2A3B5F]/20"
    >
      <Save className="w-4 h-4 mr-2" /> Save Profile
    </Button>
  </div>
);
