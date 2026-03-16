import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ThumbsUp, ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect,useRef } from "react";
import { AnswersList } from "../pages/AnswersList";
const questions = [
  {
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
    id: 2,
    title: "Is it worth taking a gap year before starting a master's degree?",
    author: "Final Year Student",
    answersCount: 28,
    likes: 89,
    tags: ["Career Path", "Post-grad"],
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

export function QASection() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Student Q&A</h2>

        <div className="relative px-2">
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-4">
              {questions.map((q) => (
                <CarouselItem key={q.id} className="pl-4 md:basis-1/3">
                  <Card className="cursor-pointer hover:shadow-md transition" onClick={() => setLocation(`/question/${q.id}`)}>
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex gap-2 mb-4">
                        {q.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>

                      <h3 className="text-lg font-semibold mb-3">{q.title}</h3>
                      <span className="mt-auto text-sm text-muted-foreground">{q.answers.length} Answers</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
