import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";

export const EditExperienceModal = ({
  isOpen,
  onClose,
  isEditing,
  experienceForm,
  setExperienceForm,
  tagInput,
  setTagInput,
  onSave,
  isSaving,
}) => {
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!experienceForm.keywords.includes(tagInput.trim())) {
        setExperienceForm({
          ...experienceForm,
          keywords: [...experienceForm.keywords, tagInput.trim()],
        });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setExperienceForm({
      ...experienceForm,
      keywords: experienceForm.keywords.filter((t) => t !== tagToRemove),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center px-4">
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
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-[#C5A059]">
                {isEditing ? "Edit Experience" : "Add Experience"}
              </h3>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g. Full Stack Intern at Tech Corp"
                  value={experienceForm.title}
                  onChange={(e) =>
                    setExperienceForm({ ...experienceForm, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  className="w-full min-h-30 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                  placeholder="What did you achieve?"
                  value={experienceForm.description}
                  onChange={(e) =>
                    setExperienceForm({ ...experienceForm, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Domain</Label>
                <Input
                  placeholder="e.g. Web Development"
                  value={experienceForm.domain}
                  onChange={(e) =>
                    setExperienceForm({ ...experienceForm, domain: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Manage Tags (Press Enter to add)</Label>
                <div className="flex flex-wrap gap-2 mb-2 p-3 border border-slate-200 dark:border-slate-800 rounded-lg min-h-11">
                  {experienceForm.keywords.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-[#EAE4D3] text-[#2A3B5F] hover:bg-[#EAE4D3] gap-1 px-2"
                    >
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="flex-1 bg-transparent border-none outline-none text-sm min-w-25"
                    placeholder="Add tag..."
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={onSave}
              disabled={isSaving}
              className="w-full bg-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20 hover:bg-[#C5A059]/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Experience"}
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
