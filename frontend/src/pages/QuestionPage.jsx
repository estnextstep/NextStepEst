import { useParams, useLocation } from "wouter";
import { AnswersList } from "./AnswersList";
import { Button } from "@/components/ui/button";


export default function QuestionPage() {

  const { id } = useParams();
  const [, setLocation] = useLocation();
  const question = questions.find((q) => q.id === Number(id));

  if (!question) return <div className="p-10">Question not found</div>;

  return (
    <div className="min-h-screen p-10 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => setLocation("/")} className="mb-6">
        ← Back
      </Button>

      <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
      <p className="mb-8 text-muted-foreground">{question.answers.length} answers</p>

      <AnswersList answers={question.answers} />
    </div>
  );
}
