import { useParams, useLocation } from "wouter";
import { AnswersList } from "./AnswersList";
import { Button } from "@/components/ui/button";

const questions = [
  {
    author_id:1,
    id: 1,
    title:
      "What's the best way to approach professors for research opportunities?",
    author: "Alex Johnson",
    username: "alex_johnson",
    role: "CS Student",
    time: "2 hours ago",
    answersCount: 2,
    likes: 45,
    views: 120,
    tags: ["Research", "Academic Advice"],
    content:
      "I'm a sophomore interested in AI research, but I don't have much experience yet. Should I just email professors directly or go to office hours? I'm worried about sounding unprepared.",
    answers: [
      {
        id: 101,
        author: "Dr. Sarah Chen",
        username: "sarah_chen",
        role: "Professor of AI",
        time: "1 hour ago",
        content:
          "Office hours are definitely better! It shows initiative and allows for a more natural conversation. Bring a copy of your transcript and mention specific projects of theirs that interest you.",
        likes: 15,
      },
      {
        id: 102,
        author: "Mark Miller",
        username: "mark_miller",
        role: "Grad Student",
        time: "30 mins ago",
        content:
          "Start by reading their recent publications. If you can ask a question about their work, it shows you've done your homework.",
        likes: 8,
      },
    ],
  },
  {
    author_id:2,
    id: 2,
    title: "Should I take a gap year before grad school to gain work experience?",
    author: "Final Year Student",
    answersCount: 28,
    likes: 89,
    tags: ["Career Path", "Post-grad"],
    content:
      "I'm graduating soon and considering a master's in data science. Some of my friends are taking a gap year to work or intern first. Do you think that's a good idea, or should I just go straight into grad school?",
    answers: [
      {
        id: 201,
        author_id:1,
        author: "Dr. Michael Rodriguez",
        username: "michael_rodriguez",
        role: "Professor of Data Science",
        time: "1 day ago",
        content:
          "I'd recommend a gap year if you're not sure about your career path. It gives you time to gain real-world experience and clarify your goals.",
        likes: 25,
      },
      {
        id: 202,
        author: "Jessica Kim",
        username: "jessica_kim",
        role: "Graduate Student",
        time: "2 days ago",
        content:
          "I took a gap year and it was one of the best decisions I made. I worked at a startup and realized I wanted to go back to school for more specialized training.",
        likes: 18,
      },
    ],
  },
  {
    id: 3,
    title: "Tips for balancing part-time work with engineering coursework?",
    author: "Engineering Freshman",
    answersCount: 8,
    likes: 32,
    tags: ["Time Management", "Student Life"],
    content:
      "I'm graduating soon and considering a master's in data science. Some of my friends are taking a gap year to work or intern first. Do you think that's a good idea, or should I just go straight into grad school?",
    answers: [
      {
        id: 201,
        author: "Dr. Michael Rodriguez",
        username: "michael_rodriguez",
        role: "Professor of Data Science",
        time: "1 day ago",
        content:
          "I'd recommend a gap year if you're not sure about your career path. It gives you time to gain real-world experience and clarify your goals.",
        likes: 25,
      },
      {
        id: 202,
        author: "Jessica Kim",
        username: "jessica_kim",
        role: "Graduate Student",
        time: "2 days ago",
        content:
          "I took a gap year and it was one of the best decisions I made. I worked at a startup and realized I wanted to go back to school for more specialized training.",
        likes: 18,
      },
    ],
  },
  {
    id: 4,
    title: "How to prepare for coding interviews at FAANG companies?",
    author: "Software Intern",
    answersCount: 45,
    likes: 120,
    tags: ["Interviews", "Coding"],
    content:
      "I'm graduating soon and considering a master's in data science. Some of my friends are taking a gap year to work or intern first. Do you think that's a good idea, or should I just go straight into grad school?",
    answers: [
      {
        id: 201,
        author: "Dr. Michael Rodriguez",
        username: "michael_rodriguez",
        role: "Professor of Data Science",
        time: "1 day ago",
        content:
          "I'd recommend a gap year if you're not sure about your career path. It gives you time to gain real-world experience and clarify your goals.",
        likes: 25,
      },
      {
        id: 202,
        author: "Jessica Kim",
        username: "jessica_kim",
        role: "Graduate Student",
        time: "2 days ago",
        content:
          "I took a gap year and it was one of the best decisions I made. I worked at a startup and realized I wanted to go back to school for more specialized training.",
        likes: 18,
      },
    ],
  },
  {
    id: 5,
    title: "How to build a strong portfolio for software engineering roles?",
    author: "Software Intern",
    answersCount: 45,
    likes: 120,
    tags: ["Portfolio", "Career Advice"],
    content:
      "I'm graduating soon and considering a master's in data science. Some of my friends are taking a gap year to work or intern first. Do you think that's a good idea, or should I just go straight into grad school?",
    answers: [
      {
        author_id:1,
        id: 201,
        author: "Dr. Michael Rodriguez",
        username: "michael_rodriguez",
        role: "Professor of Data Science",
        time: "1 day ago",
        content:
          "I'd recommend a gap year if you're not sure about your career path. It gives you time to gain real-world experience and clarify your goals.",
        likes: 25,
      },
      {
        id: 202,
        author: "Jessica Kim",
        username: "jessica_kim",
        role: "Graduate Student",
        time: "2 days ago",
        content:
          "I took a gap year and it was one of the best decisions I made. I worked at a startup and realized I wanted to go back to school for more specialized training.",
        likes: 18,
      },
    ],
  },
];
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
