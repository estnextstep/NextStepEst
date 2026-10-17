import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Lock, Palette, Trash2, User, X } from "lucide-react";
import { EditProfileTab } from "./EditProfileTab";
import { ExperienceTab } from "./ExperienceTab";
import { AppearanceTab } from "./AppearanceTab";
import { SecurityTab } from "./SecurityTab";
import { DangerTab } from "./DangerTab";

const NAV_ITEMS = [
  { id: "profile", label: "Edit Profile", icon: User },
  { id: "experience", label: "My Experience", icon: BookOpen },
  { id: "theme", label: "Appearance", icon: Palette },
  { id: "security", label: "Password", icon: Lock },
];

export const SettingsModal = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  // profile tab
  editForm,
  setEditForm,
  onSaveProfile,
  onImageUpload,
  // experience tab
  experienceRequest,
  onEditExperience,
  onDeleteExperience,
  isDeletingExperience,
  // appearance tab
  emailNotifications,
  onToggleNotifications,
  // security tab
  passwordForm,
  setPasswordForm,
  onPasswordChange,
  isUpdatingPassword,
  // danger tab
  onDeleteAccount,
  isDeletingAccount,
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-162.5"
        >
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800 p-6 space-y-2 shrink-0">
            <h3 className="text-lg font-serif font-bold text-[#2A3B5F] dark:text-white mb-6">
              Settings
            </h3>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? "bg-[#2A3B5F] text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab("danger")}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "danger"
                    ? "bg-red-600 text-white"
                    : "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                }`}
              >
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </div>

          {/* Content Panel */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {activeTab === "profile" && (
              <EditProfileTab
                editForm={editForm}
                setEditForm={setEditForm}
                onSave={onSaveProfile}
                onImageUpload={onImageUpload}
              />
            )}

            {activeTab === "experience" && (
              <ExperienceTab
                experienceRequest={experienceRequest}
                onEdit={onEditExperience}
                onDelete={onDeleteExperience}
                isDeleting={isDeletingExperience}
              />
            )}

            {activeTab === "theme" && (
              <AppearanceTab
                emailNotifications={emailNotifications}
                onToggleNotifications={onToggleNotifications}
              />
            )}

            {activeTab === "security" && (
              <SecurityTab
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                onSubmit={onPasswordChange}
                isLoading={isUpdatingPassword}
              />
            )}

            {activeTab === "danger" && (
              <DangerTab onDelete={onDeleteAccount} isLoading={isDeletingAccount} />
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
