import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { CommunityActivity } from "@/components/profile/CommunityActivity";
import { MemberSinceCard } from "@/components/profile/MemberSinceCard";
import {  getUserQuestion } from "../api/getUserInfo";
import { getUserProfile } from "../api/getUserInfo";

export default function UserProfile() {
  const { username } = useParams();
  const [userQa, setUserQa] = useState([]);

  // Fetch profile info by username
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => getUserProfile(username),
    enabled: !!username,
  });
  // fetch user questions
  
  // console.log("User profile data:", data);
  // Fetch questions for this user
  // const { data: questionsData } = useQuery({
  //   queryKey: ["userQuestions", data?.username],
  //   queryFn: () => getQuestionsByUsername(data?.username, 0),
  //   enabled: !!data?.username,
  //   onSuccess: (res) => setUserQa(res.content || []),
  // });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (isError || !data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        User not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-slate-950 font-sans">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        {/* Profile header */}
        <ProfileHeader data={data} isReadOnly={true} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Experience section */}
            {data.experienceRequest && (
              <ExperienceSection experienceRequest={data.experienceRequest}  isReadOnly={true} />
            )}

            {/* Community activity (questions by user) */}
            {/* <CommunityActivity
              questions={userQa}
              onSelectQuestion={() => {}}
              showActions={false}
            /> */}
          </div>

          <div className="space-y-6">
            <MemberSinceCard createdAt={data.createdAt} />
          </div>
        </div>
      </div>
    </div>
  );
}