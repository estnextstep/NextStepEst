import { Navbar } from "@/components/Navbar";
import { ExperienceCard } from "@/components/ExperienceCard";
import { useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../api/api";

const PAGE_SIZE = 6;

export default function Experiences() {
  const { user } = useAuth();
  const experienceloader = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["experiences", user?.id],
    queryFn: async ({ pageParam = 0 }) => {
      const route = user ? "/experiences/recomandation" : "/experiences";
      const res = await api.get(`${route}?page=${pageParam}&size=${PAGE_SIZE}`);
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
  });

  const experiences =
    data?.pages.flatMap((p) =>
      p.content.map((exp) => ({
        id: exp.id,
        name: `${exp.firstName} ${exp.lastName}`,
        role: exp.title || "No role",
        username: exp.username || "unknown",
        image: `http://auth-service:8080${exp.imgUrl}`,
        quote: exp.description || "No description",
        tags: Array.isArray(exp.keywords)
          ? exp.keywords
          : typeof exp.keywords === "string"
          ? exp.keywords.split(",")
          : [],
        alumniId: exp.alumniId,
      }))
    ) || [];

  useEffect(() => {
    if (!experienceloader.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 0.5 }
    );
    observer.observe(experienceloader.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : isError ? (
        <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
          Something went wrong while loading experiences.
        </div>
      ) : (
        <>
          <div className="bg-card border-b border-border py-12 mt-4">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Alumni Experiences
              </h1>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Explore the diverse paths our graduates have taken.
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((exp, index) => (
                <ExperienceCard key={exp.id || index} {...exp} />
              ))}
            </div>

            {hasNextPage && (
              <div
                ref={experienceloader}
                className="h-16 flex items-center justify-center mt-10"
              >
                {isFetchingNextPage ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                ) : (
                  <span className="text-muted-foreground">Scroll to load more</span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}