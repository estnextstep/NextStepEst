import { Button } from "@/components/ui/button";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";

export const ExperienceTab = ({ experienceRequest, onEdit, onDelete }) => (
  <div className="space-y-6">
    <h4 className="text-xl font-serif font-bold text-[#2A3B5F] dark:text-white">
      Featured Experience
    </h4>

    {experienceRequest ? (
      <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 space-y-4">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[#2A3B5F] dark:text-white break-all">
              {experienceRequest.title}
            </p>
            <p className="text-sm text-slate-500">{experienceRequest.date}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit} className="text-[#C5A059] shrink-0">
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 break-all">
          {experienceRequest.description}
        </p>
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button onClick={onDelete} variant="destructive" size="sm" className="w-full gap-2">
            <Trash2 className="w-4 h-4" /> Remove Experience
          </Button>
        </div>
      </div>
    ) : (
      <div className="p-8 border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-4">
        <p className="text-slate-500 text-sm">No featured experience found.</p>
        <Button onClick={onEdit} variant="outline" className="gap-2">
          <PlusCircle className="w-4 h-4" /> Add One Now
        </Button>
      </div>
    )}
  </div>
);