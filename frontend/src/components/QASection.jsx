import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import { AnswersList } from "../pages/AnswersList";
import { AnswerCard } from "./ui/AnswerCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PAGE_SIZE = 10;

export function QASection() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerContent, setAnswerContent] = useState("");

  // ── Carousel questions ──────────────────────────────────────────────────────
  const { data, isLoading, error } = useQuery({
    queryKey: ["questions-home"],
    queryFn: async () => {
      const res = await api.get(`/question/all?page=0&size=${PAGE_SIZE}`);
      return res.data;
    },
  });

  const questions = data?.content ?? [];

  // ── Question detail + answers (paginated) ───────────────────────────────────
  const {
    data: answersData,
    isLoading: isLoadingAnswers,
    fetchNextPage: fetchMoreAnswers,
    hasNextPage: hasMoreAnswers,
    isFetchingNextPage: isFetchingMoreAnswers,
  } = useInfiniteQuery({
    queryKey: ["question-answers", selectedQuestion?.id],
    initialPageParam: 0,
    queryFn: async ({ pageParam, queryKey }) => {
      const questionId = queryKey[1];
      const res = await api.get("/questionInfo", {
        params: { id: questionId, page: pageParam },
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage < (lastPage?.totalPages ?? 0) ? nextPage : undefined;
    },
    enabled: !!selectedQuestion,
  });

  const questionInfo = answersData?.pages?.[0]?.question;
  const allAnswers = answersData?.pages?.flatMap((p) => p?.answers ?? []) ?? [];
  const totalAnswers = answersData?.pages?.[0]?.totalElements ?? 0;

  // ── Add answer ──────────────────────────────────────────────────────────────
  const addAnswerMutation = useMutation({
    mutationFn: async ({ content, questionId }) => {
      const res = await api.post(`/answer/${questionId}`, {
        content,
        authorId: user.id,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["question-answers", variables.questionId],
      });
      setAnswerContent("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post answer",
        variant: "destructive",
      });
    },
  });

  // ── Delete answer ───────────────────────────────────────────────────────────
  const deleteAnswerMutation = useMutation({
    mutationFn: async (answerId) => {
      await api.delete(`/answer/${answerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question-answers"] });
      toast({ title: "Answer deleted", description: "Your answer was deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete answer", variant: "destructive" });
    },
  });

  const handleAddAnswer = () => {
    if (!user) return setLocation("/login");
    if (!answerContent.trim())
      return toast({ title: "Error", description: "Answer cannot be empty", variant: "destructive" });
    addAnswerMutation.mutate({ content: answerContent, questionId: selectedQuestion.id });
  };

  const handleUserClick = (username, authorId) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You must login to view user profiles",
        variant: "destructive",
      });
      return;
    }
    authorId && authorId === user.id
      ? setLocation("/profile")
      : setLocation(`/profile/${username}`);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">

          {/* ── Carousel view ── */}
          {!selectedQuestion ? (
            <motion.div
              key="carousel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-3xl font-bold mb-8">Student Q&A</h2>

              {isLoading ? (
                <p>Loading questions...</p>
              ) : error ? (
                <p>Error loading questions</p>
              ) : (
                <div className="relative px-2">
                  <Carousel opts={{ align: "start", loop: true }}>
                    <CarouselContent className="-ml-4">
                      {questions.map((q) => (
                        <CarouselItem key={q.id} className="pl-4 md:basis-1/3">
                          <Card
                            className="cursor-pointer hover:shadow-md transition"
                            onClick={() => setSelectedQuestion(q)}
                          >
                            <CardContent className="p-6 flex flex-col h-full">
                              <div className="flex gap-2 flex-wrap mb-4">
                                {(q.keywords || []).map((tag) => (
                                  <Badge key={tag} variant="outline">{tag}</Badge>
                                ))}
                              </div>
                              <h3 className="text-lg font-semibold mb-3">{q.title}</h3>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              )}
            </motion.div>

          ) : (

            /* ── Detail view ── */
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Button
                variant="ghost"
                onClick={() => { setSelectedQuestion(null); setAnswerContent(""); }}
                className="mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>

              <div className="space-y-6">
                {/* Question card */}
                {isLoadingAnswers ? (
                  <p>Loading...</p>
                ) : questionInfo && (
                  <AnswerCard
                    answer={{ content: questionInfo.content }}
                    question={questionInfo}
                    isQuestion={true}
                    onUserClick={handleUserClick}
                    onDelete={async () => {
                      if (!user) return;
                      try {
                        await api.delete(`/question/${questionInfo.id}`);
                        toast({ title: "Question deleted", description: "The question has been removed successfully" });
                        queryClient.invalidateQueries({ queryKey: ["questions-home"] });
                        setSelectedQuestion(null);
                      } catch (err) {
                        toast({
                          title: "Error",
                          description: err.response?.data?.message || "Failed to delete question",
                          variant: "destructive",
                        });
                      }
                    }}
                    currentUserId={user?.id}
                  />
                )}

                {/* Answers */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" /> {totalAnswers} Answers
                  </h3>

                  {isLoadingAnswers ? (
                    <p>Loading answers...</p>
                  ) : (
                    <>
                      <AnswersList
                        currentUserId={user?.id}
                        answers={allAnswers}
                        question={questionInfo}
                        onDelete={(answerId) => deleteAnswerMutation.mutate(answerId)}
                        onUserClick={handleUserClick}
                      />

                      {/* Answer input */}
                      {user ? (
                        <div className="flex items-center gap-2 mt-4 border-t pt-2">
                          <input
                            type="text"
                            placeholder="Write an answer..."
                            className="flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={answerContent}
                            onChange={(e) => setAnswerContent(e.target.value)}
                          />
                          <Button
                            onClick={handleAddAnswer}
                            disabled={!answerContent.trim() || addAnswerMutation.isPending}
                            size="sm"
                          >
                            {addAnswerMutation.isPending ? "Posting..." : "Post"}
                          </Button>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-slate-500">
                          You must{" "}
                          <span className="text-blue-500 cursor-pointer" onClick={() => setLocation("/login")}>
                            login
                          </span>{" "}
                          to write an answer.
                        </p>
                      )}
                    </>
                  )}

                  {hasMoreAnswers && (
                    <Button onClick={() => fetchMoreAnswers()} disabled={isFetchingMoreAnswers}>
                      {isFetchingMoreAnswers ? "Loading..." : "Load more answers"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}