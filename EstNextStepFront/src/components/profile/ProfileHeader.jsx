import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Settings, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

export const ProfileHeader = ({ data, onOpenSettings ,isReadOnly=false}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm relative"
  >
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
      <div className="relative group">
        <div className="w-28 h-28 rounded-2xl bg-[#2A3B5F] flex items-center justify-center text-white text-4xl font-serif shadow-inner overflow-hidden border-4 border-white dark:border-slate-800">
          {data.ImageURL ? (
            <img src={`http://localhost:8080${data.ImageURL}`} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            data.firstName.charAt(0)
          )}
        </div>
      </div>

      <div className="flex-1 space-y-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#2A3B5F] dark:text-slate-100 tracking-tight">
              {data.firstName} {data.lastName}
            </h1>
            <p className="text-sm text-slate-500 font-medium mb-1">@{data.username}</p>
            <p className="text-[#C5A059] font-medium flex items-center gap-2 justify-center md:justify-start">
              <Badge variant="outline" className="border-[#C5A059] text-[#C5A059] uppercase text-[10px] tracking-wider">
                {data.role}
              </Badge>
              <span>{data.major}</span>
            </p>
          </div>
          {!isReadOnly && (
            <Button
            onClick={onOpenSettings}
            variant="outline"
            className="rounded-lg border-[#2A3B5F] text-[#2A3B5F] hover:bg-[#2A3B5F] hover:text-white transition-all font-semibold"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>)}
        </div>

        <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{data.bio}</p>

        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          {data.email && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-none font-medium">
              <Mail className="w-3.5 h-3.5 mr-2" /> {data.email}
            </Badge>
          )}
          {data.linkedIn && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-none font-medium">
              <Linkedin className="w-3.5 h-3.5 mr-2" /> {data.linkedIn}
            </Badge>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);
