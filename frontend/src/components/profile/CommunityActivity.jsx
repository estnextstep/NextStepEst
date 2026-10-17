import { MessageSquare, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/api";
import {useToast} from "@/hooks/use-toast";
export const CommunityActivity = ({ questions, onSelectQuestion }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (e, questionId) => {
    e.stopPropagation(); 
    if (!user) return;

    try {
      await api.delete(`/question/${questionId}`);
      toast({
        title: "Question deleted",
        description: "The question has been removed successfully",
      });
      queryClient.invalidateQueries(["questions"]);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-serif font-bold text-[#2A3B5F] dark:text-slate-200">
        Community Activity
      </h2>
      <div className="space-y-3">
        {questions.map((q) => (
          <div
            key={q.id}
            onClick={() => onSelectQuestion(q)}
            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 group cursor-pointer hover:border-[#C5A059] transition-colors"
          >
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-[#C5A059]/10 transition-colors">
              <MessageSquare className="w-5 h-5 text-[#2A3B5F] group-hover:text-[#C5A059]" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[#2A3B5F] dark:text-slate-200 leading-tight mb-1">
                {q.content}
              </h4>
              <p className="text-xs text-slate-500">
                {q.created_at} • {q.replies} replies
              </p>
            </div>
            <Trash2
              className="w-4 h-4 text-red-800"
              onClick={(e) => handleDelete(e, q.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};