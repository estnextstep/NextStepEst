import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, ArrowLeft, MessageSquare, Save, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AnswersList } from "./AnswersList";
import { useAuth } from "../context/AuthContext";
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import { AnswerCard } from "../components/ui/AnswerCard";

const PAGE_SIZE = 5;

export default function QA() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const loaderRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "", tags: "" });
  const [answerContent, setAnswerContent] = useState("");

  // ── Questions list ─────
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["questions", user?.id],
      queryFn: async ({ pageParam = 0 }) => {
        const route = user ? "/questions/recommendation" : "/question/all";
        const res = await api.get(`${route}?page=${pageParam}&size=${PAGE_SIZE}`);
        return res.data;
      },
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length;
        return nextPage < lastPage.totalPages ? nextPage : undefined;
      },
    });

  const questions = data?.pages.flatMap((p) => p.content) || [];

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 0.5 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, fetchNextPage, hasNextPage]);

  // ── Search with debounce ─────
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchText), 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (debouncedQuery.trim().length > 2) {
      performSearch(debouncedQuery);
    } else {
      setSearchResults(null);
    }
  }, [debouncedQuery]);

  const performSearch = async (value) => {
    setIsSearching(true);
    try {
      const res = await api.get("/questions/search", {
        params: { query: value, page: 0, size: 10 },
      });
      setSearchResults(res.data.content);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  //  Add question 
  const addQuestionMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/question", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
      toast({ title: "Question Posted", description: "Your question is now live in the community." });
      setIsAskModalOpen(false);
      setNewQuestion({ title: "", content: "", tags: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to post question",
        variant: "destructive",
      });
    },
  });

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.title || !newQuestion.content) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    addQuestionMutation.mutate({
      title: newQuestion.title,
      content: newQuestion.content,
      keywords: newQuestion.tags,
    });
  };

  // ── Question detail + answers 
  const {
    data: answersData,
    isLoading: isLoadingAnswers,
    fetchNextPage: fetchMoreAnswers,
    hasNextPage: hasMoreAnswers,
    isFetchingNextPage: isFetchingMoreAnswers,
  } = useInfiniteQuery({
    queryKey: ["question-answers", selectedQuestion?.id],
    queryFn: async ({ pageParam = 0, queryKey }) => {
      const res = await api.get("/questionInfo", {
        params: { id: queryKey[1], page: pageParam },
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    enabled: !!selectedQuestion,
  });

  const questionInfo = answersData?.pages[0]?.question;
  const allAnswers = answersData?.pages.flatMap((p) => p.answers) ?? [];
  const totalAnswers = answersData?.pages[0]?.totalElements ?? 0;

  // ── Add / delete answer 
  const addAnswerMutation = useMutation({
    mutationFn: async ({ content, questionId }) => {
      const res = await api.post(`/answer/${questionId}`, { content, authorId: user.id });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["question-answers", selectedQuestion.id]);
      setAnswerContent("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to post answer", variant: "destructive" });
    },
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: async (answerId) => {
      await api.delete(`/answer/${answerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["question-answers", selectedQuestion.id]);
      toast({ title: "Answer deleted", description: "Your answer was deleted successfully." });
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

  // ── Shared user click handler 
  const handleUserClick = (username, authorId) => {
    if (!user) {
      toast({ title: "Login required", description: "You must login to view user profiles", variant: "destructive" });
      return;
    }
    authorId === user.id ? setLocation("/profile") : setLocation(`/profile/${username}`);
  };

  // ── Displayed questions (search vs paginated) 
  const displayedQuestions = searchText.trim().length > 2 ? searchResults || [] : questions;
  const isSearchActive = searchText.trim().length > 2;

  // ── Render ────
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      <AnimatePresence mode="wait">

        {/* ── Questions list view ── */}
        {!selectedQuestion ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Page header */}
            <div className="bg-card border-b border-border py-12 mt-4">
              <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    Community Q&A
                  </h1>
                  <p className="text-muted-foreground">
                    Ask questions, share knowledge, help each other.
                  </p>
                </div>
                <Button
                  className="w-full md:w-auto bg-[#2A3B5F] text-white"
                  onClick={() => user ? setIsAskModalOpen(true) : setLocation("/login")}
                >
                  <Plus className="mr-2 h-4 w-4" /> Ask Question
                </Button>
              </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
              {/* Search bar */}
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* States */}
              {(isLoading || isSearching) ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : displayedQuestions.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  {isSearchActive ? "No questions match your search." : "No questions yet. Be the first to ask!"}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedQuestions.map((q) => (
                    <Card
                      key={q.id}
                      className="cursor-pointer hover:shadow-md transition-shadow border border-border"
                      onClick={() => setSelectedQuestion(q)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(q.keywords || []).map((kw) => (
                            <Badge key={kw} variant="secondary">{kw}</Badge>
                          ))}
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{q.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{q.content}</p>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Infinite scroll trigger */}
                  {hasNextPage && !isSearchActive && (
                    <div ref={loaderRef} className="h-16 flex items-center justify-center">
                      {isFetchingNextPage
                        ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                        : <span className="text-sm text-muted-foreground">Scroll to load more</span>
                      }
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

        ) : (

          /* ── Question detail view ── */
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-10 max-w-3xl"
          >
            <Button variant="ghost" onClick={() => { setSelectedQuestion(null); setAnswerContent(""); }} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="space-y-6">
              {/* Question card */}
              {isLoadingAnswers ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
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
                      toast({ title: "Question deleted", description: "The question has been removed successfully." });
                      queryClient.invalidateQueries(["questions"]);
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

              {/* Answers section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <MessageSquare className="w-5 h-5" /> {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
                </h3>

                {isLoadingAnswers ? null : (
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
                      <div className="flex items-center gap-2 mt-4 border-t pt-4">
                        <input
                          type="text"
                          placeholder="Write an answer..."
                          className="flex-1 rounded-full border px-4 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          value={answerContent}
                          onChange={(e) => setAnswerContent(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddAnswer()}
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
                      <p className="mt-4 text-sm text-muted-foreground">
                        You must{" "}
                        <span className="text-primary cursor-pointer hover:underline" onClick={() => setLocation("/login")}>
                          login
                        </span>{" "}
                        to write an answer.
                      </p>
                    )}

                    {hasMoreAnswers && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => fetchMoreAnswers()}
                        disabled={isFetchingMoreAnswers}
                      >
                        {isFetchingMoreAnswers ? "Loading..." : "Load more answers"}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ask Question Modal ── */}
      <AnimatePresence>
        {isAskModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center px-4 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAskModalOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-card rounded-2xl p-6 space-y-5 shadow-xl border border-border"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Ask a Question</h3>
                <button
                  onClick={() => setIsAskModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAskQuestion} className="space-y-4">
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input
                    placeholder="What's your question about?"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Details</Label>
                  <textarea
                    placeholder="Describe your question in detail..."
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Tags <span className="text-muted-foreground font-normal">(comma separated)</span></Label>
                  <Input
                    placeholder="e.g. internship, visa, housing"
                    value={newQuestion.tags}
                    onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={addQuestionMutation.isPending}>
                  {addQuestionMutation.isPending ? "Posting..." : (
                    <><Save className="w-4 h-4 mr-2" /> Post Question</>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}