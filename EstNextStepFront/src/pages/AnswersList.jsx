import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnswerCard } from "../components/ui/answerCard";

const ANSWERS_PAGE_SIZE = 2;

export function AnswersList({ answers, question, onUserClick, currentUserId, onDelete }) {
  const [visibleCount, setVisibleCount] = useState(ANSWERS_PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(ANSWERS_PAGE_SIZE);
  }, [answers]);

  const visibleAnswers = answers.slice(0, visibleCount);

  return (
    <div className="space-y-4">
     {visibleAnswers.map((ans) => (
  <AnswerCard
    key={ans.id}
    answer={ans}
    isQuestion={false}
    onUserClick={onUserClick}
    currentUserId={currentUserId}
    onDelete={() => onDelete(ans.id)}
  />
))}

      {visibleCount < answers.length && (
        <div className="flex justify-center">
          <Button
            onClick={() =>
              setVisibleCount((prev) => Math.min(prev + ANSWERS_PAGE_SIZE, answers.length))
            }
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}