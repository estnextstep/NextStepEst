import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Edit2, PlusCircle } from "lucide-react";

export const ExperienceSection = ({ experienceRequest, onEdit, isReadOnly = false }) => (
  <section className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-serif font-bold text-[#2A3B5F] dark:text-slate-200">
        Featured Experience
      </h2>

      {!isReadOnly && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-[#2A3B5F] hover:text-[#C5A059] font-bold"
        >
          {experienceRequest ? (
            <>
              <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
            </>
          ) : (
            <>
              <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Experience
            </>
          )}
        </Button>
      )}
    </div>

    {experienceRequest ? (
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#2A3B5F] dark:text-slate-100">
                {experienceRequest.title}
              </h3>
              <p className="text-sm text-slate-500 font-medium">{experienceRequest.date}</p>
            </div>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none">
              {experienceRequest.domain}
            </Badge>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            {experienceRequest.description}
          </p>
          <div className="flex gap-2 flex-wrap">
            {experienceRequest.keywords?.split(",").map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold text-[#2A3B5F] bg-[#EAE4D3] px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    ) : (
      !isReadOnly && (
        <Card className="border-dashed border-2 bg-transparent border-slate-200 dark:border-slate-800">
          <CardContent className="p-10 text-center space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full w-fit mx-auto">
              <BookOpen className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <p className="font-bold text-[#2A3B5F] dark:text-white">No experience added yet</p>
              <p className="text-sm text-slate-500">Showcase your internships, projects or achievements.</p>
            </div>
            <Button onClick={onEdit} className="bg-[#2A3B5F] text-white">
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      )
    )}
  </section>
);