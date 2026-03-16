import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function AnswerCard({ answer, question, isQuestion, onUserClick, onDelete, currentUserId }) {
  const username = isQuestion ? question.username : answer.username;
  const firstName = isQuestion ? question.name : answer.firstName;
  const lastName = isQuestion ? question.lastName : answer.lastName;
  const avatar = isQuestion ? question.profileUrl : answer.imgUrl;
  const authorId = isQuestion ? question.author_id : answer.authorId;
  const createdAt = answer?.created_at;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm space-y-4"
    >
      <div className="flex items-start gap-3">
        <img
          src={`http://localhost:8080${avatar}`}
          className="w-8 h-8 rounded-full object-cover cursor-pointer"
          onClick={() => onUserClick?.(username,authorId)}
        />

        <div className="flex-1 min-w-0">
          <p
            className="font-bold text-sm cursor-pointer hover:underline truncate"
            onClick={() => onUserClick?.(username,authorId)}
          >
            {firstName} {lastName}
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">@{username}</p>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-slate-400 hidden sm:block">{createdAt}</span>

          {currentUserId && authorId === currentUserId && onDelete && (
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm leading-relaxed wrap-break-word">{answer.content}</p>
    </motion.div>
  );
}