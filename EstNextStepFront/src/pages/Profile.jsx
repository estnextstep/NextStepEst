import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import { getProfil } from "../api/getUserInfo";
import { api } from "../api/api";
import { Navbar } from "@/components/Navbar";

// Profile sub-components
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { CommunityActivity } from "@/components/profile/CommunityActivity";
import { MemberSinceCard } from "@/components/profile/MemberSinceCard";
import { QuestionModal } from "@/components/profile/QuestionModal";
import { SettingsModal } from "@/components/profile/SettingsModal";
import { EditExperienceModal } from "@/components/profile/EditExperienceModal";
import { getUserQuestion } from "../api/getUserInfo";

export default function Profile() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // UI state
  const [activeTab, setActiveTab] = useState("profile");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Form state
  const [editForm, setEditForm] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    newpassword: "",
    confirmnewpassword: "",
  });
  const [experienceForm, setExperienceForm] = useState({
    title: "",
    description: "",
    keywords: [],
    domain: "",
  });

  // Data fetching
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profil"],
    queryFn: getProfil,
  });

  // get user question
  const {
    data: userQa,
    isLoading: isLoadingQuestions,
    isError: isErrorQuestions,
  } = useQuery({
    queryKey: ["userQuestions", user?.id],
    queryFn: () => getUserQuestion(user?.id, 0),
    enabled: !!user?.id,
  });
  // Sync editForm when profile data loads
  useEffect(() => {
    if (data) {
      setEditForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        username: data.username || "",
        major: data.major || "",
        role: data.role || "",
        email: data.email || "",
        bio: data.bio || "",
        linkedIn: data.linkedIn || "",
        emailNotifications: true,
        ImageURL: data.imgUrl || null,
      });
    }
  }, [data]);

  // Sync experienceForm when experience data loads
  useEffect(() => {
    if (data?.experienceRequest) {
      setExperienceForm({
        title: data.experienceRequest.title || "",
        description: data.experienceRequest.description || "",
        keywords: data.experienceRequest.keywords
          ? data.experienceRequest.keywords.split(",").map((t) => t.trim())
          : [],
        domain: data.experienceRequest.domain || "",
      });
    }
  }, [data]);

  //  Mutations

  const passwordMutation = useMutation({
    mutationFn: (passwords) => api.put("/me/edit/change-password", passwords),
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Security credentials changed.",
      });
      setPasswordForm({
        password: "",
        newpassword: "",
        confirmnewpassword: "",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.response?.data || "Failed to update password.",
        variant: "destructive",
      });
    },
  });

  const experienceMutation = useMutation({
    mutationFn: (exp) => {
      if (!data?.experienceRequest) return api.post("/experience/add", exp);
      return api.put("/experience/update", {
        ...exp,
        alumniId: data.experienceRequest.alumniId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Experience Saved",
        description: "Experience saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["profil"] });
      setIsEditingExperience(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save experience.",
        variant: "destructive",
      });
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: () =>
      api.delete(`/experience/${data.experienceRequest.alumniId}`),
    onSuccess: () => {
      toast({
        title: "Experience Deleted",
        description: "Removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["profil"] });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => api.delete("/user/delete"),
    onSuccess: () => {
      toast({ title: "Account Deleted" });
      localStorage.clear();
      window.location.href = "/";
    },
  });

  //  Handlers

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("firstname", editForm.firstName);
      formData.append("lastname", editForm.lastName);
      formData.append("username", editForm.username);
      formData.append("major", editForm.major);
      formData.append("bio", editForm.bio);
      formData.append("linkedIn", editForm.linkedIn);
      formData.append("role", editForm.role);
      if (editForm.imageFile) formData.append("image", editForm.imageFile);

      await api.patch("/me/edit", formData);
      toast({
        title: "Profile Updated",
        description: "Personal information saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["profil"] });
      setIsSettingsOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditForm({
        ...editForm,
        imageFile: file,
        ImageURL: URL.createObjectURL(file),
      });
      toast({
        title: "Image Updated",
        description: "Profile picture changed successfully.",
      });
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newpassword !== passwordForm.confirmnewpassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    passwordMutation.mutate(passwordForm);
  };

  const handleSaveExperience = () => {
    if (
      !experienceForm.title ||
      !experienceForm.description ||
      !experienceForm.domain ||
      experienceForm.keywords.length === 0
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    experienceMutation.mutate({
      ...experienceForm,
      keywords: experienceForm.keywords.join(","),
    });
  };

  const toggleEmailNotifications = (checked) => {
    setEditForm({ ...editForm, emailNotifications: checked });
    toast({
      title: checked ? "Notifications Enabled" : "Notifications Disabled",
    });
  };

  //  Render

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-slate-950 font-sans">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        <ProfileHeader
          data={data}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <ExperienceSection
              experienceRequest={data.experienceRequest}
              onEdit={() => setIsEditingExperience(true)}
            />
            <CommunityActivity
              questions={userQa?.content || []}
              onSelectQuestion={setSelectedQuestion}
            />
          </div>

          <div className="space-y-6">
            <MemberSinceCard createdAt={data.createdAt} />
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        // profile
        editForm={editForm}
        setEditForm={setEditForm}
        onSaveProfile={handleSaveProfile}
        onImageUpload={handleImageUpload}
        // experience
        experienceRequest={data.experienceRequest}
        onEditExperience={() => {
          setIsSettingsOpen(false);
          setIsEditingExperience(true);
        }}
        onDeleteExperience={() => deleteExperienceMutation.mutate()}
        isDeletingExperience={deleteExperienceMutation.isPending}
        // appearance
        emailNotifications={editForm?.emailNotifications ?? true}
        onToggleNotifications={toggleEmailNotifications}
        // security
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        onPasswordChange={handlePasswordChange}
        isUpdatingPassword={passwordMutation.isPending}
        // danger
        onDeleteAccount={() => deleteAccountMutation.mutate()}
        isDeletingAccount={deleteAccountMutation.isPending}
      />

      <EditExperienceModal
        isOpen={isEditingExperience}
        onClose={() => setIsEditingExperience(false)}
        isEditing={!!data.experienceRequest}
        experienceForm={experienceForm}
        setExperienceForm={setExperienceForm}
        tagInput={tagInput}
        setTagInput={setTagInput}
        onSave={handleSaveExperience}
        isSaving={experienceMutation.isPending}
      />
    </div>
  );
}
