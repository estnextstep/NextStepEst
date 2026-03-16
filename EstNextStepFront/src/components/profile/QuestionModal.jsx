import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, X } from "lucide-react";

export const QuestionModal = ({ question, onClose }) => (
  <AnimatePresence>
    {question && (
      <div className="fixed inset-0 z-120 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-serif font-bold text-[#2A3B5F] dark:text-white">
              Community Forum
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
              <Badge className="bg-[#C5A059]/10 text-[#C5A059] border-none mb-3">
                {question.category}
              </Badge>
              <h4 className="text-lg font-bold text-[#2A3B5F] dark:text-white mb-2">
                {question.text}
              </h4>
              <p className="text-xs text-slate-400">
                {question.date} 
              </p>
            </div>

            <div className="space-y-4">
              <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Answers
              </h5>
              {question.answers?.map((ans) => (
                <div key={ans.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-[#2A3B5F] border border-slate-200 dark:border-slate-700">
                      {ans.author.charAt(0)}
                    </div>
                    <div className="flex-1 w-px bg-slate-100 dark:bg-slate-800 my-1" />
                  </div>
                  <div className="flex-1 space-y-1 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#2A3B5F] dark:text-slate-200">
                        {ans.author}
                      </span>
                      <span className="text-[10px] text-slate-400">• {ans.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm group-hover:border-[#C5A059]/30 transition-colors">
                      {ans.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
