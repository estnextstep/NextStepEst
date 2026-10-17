import CommentCard from "../components/CommentsCard";
import { useState } from "react";
import avatar1 from "@assets/generated_images/professional_headshot_of_young_female_software_engineer.png";
import avatar2 from "@assets/generated_images/professional_headshot_of_male_marketing_manager.png";
export default function CommentsSection({ onClose }) {
  const [comments, setComments] = useState([
  ]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-24 px-4 bg-black/50 overflow-auto">
      <div className="bg-background dark:bg-gray-900 w-full max-w-3xl rounded-2xl shadow-xl relative">
        {/* Top bar with textarea stays fixed inside modal */}
        <div className="sticky top-0 bg-background dark:bg-gray-900 z-10 p-6 border-b border-border rounded-t-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground dark:text-gray-300 hover:text-red-500 transition"
          >
            ✕
          </button>

          <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-white">
            Comments ({comments.length})
          </h2>

          <div className="mb-4">
            <textarea
              placeholder="Write your comment..."
              className="w-full p-3 rounded-xl border border-border bg-card dark:bg-gray-800 focus:outline-none focus:ring focus:ring-primary"
            />
            <button className="mt-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition">
              Post
            </button>
          </div>
        </div>

        {/* Scrollable comments area */}
        <div className="space-y-4 p-6 pt-0 max-h-[70vh] overflow-y-auto">
          {comments.map((c, idx) => (
            <CommentCard key={idx} comment={c} />
          ))}
        </div>
      </div>
    </div>
  );
}