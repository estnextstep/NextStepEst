import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";

export default function CommentCard({ comment }) {
  const { name, avatar, date, text } = comment;

  return (
    <div className="bg-card dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-4">
      <div className="flex items-start gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground dark:text-white">{name}</h3>
            <span className="text-xs text-muted-foreground dark:text-gray-400">{date}</span>
          </div>
          <p className="text-sm text-foreground/90 dark:text-gray-200 mt-1">{text}</p>

          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground dark:text-gray-400">
            <button className="flex items-center gap-1 hover:text-primary transition">
              <ThumbsUp className="w-4 h-4" /> {likes}
            </button>
            <button className="flex items-center gap-1 hover:text-red-500 transition">
              <ThumbsDown className="w-4 h-4" /> {dislikes}
            </button>
            <button className="flex items-center gap-1 hover:text-primary transition">
              <MessageCircle className="w-4 h-4" /> Reply
            </button>
          </div>

          <button className="mt-1 text-xs text-primary hover:underline">
            See Replies
          </button>
        </div>
      </div>
    </div>
  );
}
