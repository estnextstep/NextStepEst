import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export const MemberSinceCard = ({ createdAt }) => (
  <Card className="border-slate-200 dark:border-slate-800 bg-[#2A3B5F] text-white">
    <CardContent className="p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center">
        <Calendar className="w-8 h-8 text-[#C5A059]" />
      </div>
      <div className="space-y-1">
        <p className="text-slate-300 text-xs uppercase tracking-wider">Member since</p>
        <div className="pt-2 border-t border-white/10 mt-2">
          <p className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" /> Account created: {createdAt}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
