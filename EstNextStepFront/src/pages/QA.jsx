import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X,
  Plus,
  ArrowLeft,
  MessageCircle,
  MessageSquare,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AnswersList } from "./AnswersList";
import { useAuth } from "../context/AuthContext";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../api/api";
import { AnswerCard } from "../components/ui/answerCard";

const PAGE_SIZE = 5;
const ANSWERS_PAGE_SIZE = 2;

export default function QA() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const loaderRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [answerContent, setAnswerContent] = useState("");

  // Fetch questions with pagination
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["questions", user?.id],
      queryFn: async ({ pageParam = 0 }) => {
        const route = user ? "/questions/recommendation" : "/question/all";
        const res = await api.get(
          `${route}?page=${pageParam}&size=${PAGE_SIZE}`,
        );
        return res.data;
      },
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length;
        return nextPage < lastPage.totalPages ? nextPage : undefined;
      },
    });

  const questions = data?.pages.flatMap((p) => p.content) || [];

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 0.5 },
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, fetchNextPage, hasNextPage]);

  // Add question mutation
  const addQuestionMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/question", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
      toast({
        title: "Question Posted",
        description: "Your question is now live in the community.",
      });
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
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    addQuestionMutation.mutate({
      title: newQuestion.title,
      content: newQuestion.content,
      keywords: newQuestion.tags,
    });
  };

  // Fetch answers for selected question
  const {
    data: answersData,
    isLoading: isLoadingAnswers,
    fetchNextPage: fetchMoreAnswers,
    hasNextPage: hasMoreAnswers,
    isFetchingNextPage: isFetchingMoreAnswers,
  } = useInfiniteQuery({
    queryKey: ["question-answers", selectedQuestion?.id],
    queryFn: async ({ pageParam = 0, queryKey }) => {
      const questionId = queryKey[1];
      const res = await api.get("/questionInfo", {
        params: { id: questionId, page: pageParam },
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

  // Add answer mutation
  const addAnswerMutation = useMutation({
    mutationFn: async ({ content, questionId }) => {
      const res = await api.post(`/answer/${questionId}`, {
        content,
        authorId: user.id,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["question-answers", selectedQuestion.id]);
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
  // delete answer mutation
  const deleteAnswerMutation = useMutation({
    mutationFn: async (answerId) => {
      await api.delete(`/answer/${answerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["question-answers", selectedQuestion.id]);
      toast({
        title: "Answer deleted",
        description: "Your answer was deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete answer",
        variant: "destructive",
      });
    },
  });

  const handleAddAnswer = () => {
    if (!user) return setLocation("/login");
    if (!answerContent.trim())
      return toast({
        title: "Error",
        description: "Answer cannot be empty",
        variant: "destructive",
      });

    addAnswerMutation.mutate({
      content: answerContent,
      questionId: selectedQuestion.id,
    });
  };
  
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Update debounced query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchText);
    }, 500); // 500ms d-delay

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
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <AnimatePresence mode="wait">
        {!selectedQuestion ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="container mx-auto px-4 py-12 grid lg:grid-cols-4 gap-8">
              <div className="space-y-4 lg:space-y-0 lg:flex lg:justify-between ">
                <Button
                  className="w-full lg:w-auto bg-[#2A3B5F] text-white flex items-center justify-center"
                  onClick={() =>
                    user ? setIsAskModalOpen(true) : setLocation("/login")
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Ask Question
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search questions..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="lg:col-span-3 space-y-6">
                {isSearching && (
                  <p className="text-center animate-pulse">Searching...</p>
                )}

                {isLoading && !isSearching ? (
                  <p>Loading...</p>
                ) : (
                  (searchText.trim().length > 2
                    ? searchResults || []
                    : questions
                  ).map((q) => (
                    <Card
                      key={q.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedQuestion(q)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(q.keywords || []).map((kw) => (
                            <Badge key={kw} variant="secondary">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{q.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {q.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}

                {searchText.trim().length > 2 &&
                  !isSearching &&
                  searchResults?.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                      No questions match your search.
                    </div>
                  )}

                {hasNextPage && !searchText.trim() && (
                  <div
                    ref={loaderRef}
                    className="h-16 flex items-center justify-center"
                  >
                    {isFetchingNextPage
                      ? "Loading more..."
                      : "Scroll to load more"}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-12 max-w-4xl"
          >
            <Button
              variant="ghost"
              onClick={() => setSelectedQuestion(null)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="space-y-6">
              {/* Question Card */}
              {questionInfo && (
                <AnswerCard
                  answer={{ content: questionInfo.content }}
                  question={questionInfo}
                  isQuestion={true}
                 onUserClick={(username, authorId) => {
    if (!user) {
    toast({
      title: "Login required",
      description: "You must login to view user profiles",
      variant: "destructive",
    });
    return; // ma tdikch user
  }

    if (authorId && authorId === user.id) {
      setLocation("/profile");
    } else {
      setLocation(`/profile/${username}`);
    }
  }}
                  onDelete={async () => {
                    if (!user) return;
                    try {
                      await api.delete(`/question/${questionInfo.id}`);
                      toast({
                        title: "Question deleted",
                        description:
                          "The question has been removed successfully",
                      });
                      queryClient.invalidateQueries(["questions"]);
                      setSelectedQuestion(null);
                    } catch (err) {
                      toast({
                        title: "Error",
                        description:
                          err.response?.data?.message ||
                          "Failed to delete question",
                        variant: "destructive",
                      });
                    }
                  }}
                  currentUserId={user?.id}
                />
              )}

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
                      onDelete={(answerId) =>
                        deleteAnswerMutation.mutate(answerId)
                      }
                      onUserClick={(username, authorId) => {
  if (!user) {
    toast({
      title: "Login required",
      description: "You must login to view user profiles",
      variant: "destructive",
    });
    return; 
  }

  if (authorId && authorId === user.id) {
    setLocation("/profile");
  } else {
    setLocation(`/profile/${username}`);
  }
}}
                    />
                    {/* answer input */}
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
                          disabled={
                            !answerContent.trim() || addAnswerMutation.isPending
                          }
                          size="sm"
                        >
                          {addAnswerMutation.isPending ? "Posting..." : "Post"}
                        </Button>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-500">
                        You must{" "}
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={() => setLocation("/login")}
                        >
                          login
                        </span>{" "}
                        to write an answer.
                      </p>
                    )}
                  </>
                )}

                {hasMoreAnswers && (
                  <Button
                    onClick={() => fetchMoreAnswers()}
                    disabled={isFetchingMoreAnswers}
                  >
                    {isFetchingMoreAnswers ? "Loading..." : "Load more answers"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {isAskModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center px-4 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAskModalOpen(false)}
              className="absolute inset-0 bg-black/40"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-xl p-6 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Ask a Question</h3>
                <X
                  className="cursor-pointer"
                  onClick={() => setIsAskModalOpen(false)}
                />
              </div>
              <form onSubmit={handleAskQuestion} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={newQuestion.title}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Content</Label>
                  <textarea
                    value={newQuestion.content}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        content: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg border"
                  />
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input
                    value={newQuestion.tags}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, tags: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" disabled={addQuestionMutation.isPending}>
                  {addQuestionMutation.isPending ? (
                    "Posting..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Post Question
                    </>
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
