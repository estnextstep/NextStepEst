import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Experiences from "@/pages/Experiences";
import QA from "@/pages/QA";
import Orientation from "@/pages/Orientation";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ResetPassword from "@/pages/ResetPassword";
import ChangePassword from "@/pages/Changepassword";
import Createexperience from "@/pages/Createexperience";
import Profile from "@/pages/Profile";
import QuestionPage from "@/pages/QuestionPage";
import UserProfile from "./pages/UserProfile";
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/experiences" component={Experiences} />
      <Route path="/qa" component={QA} />
      <Route path="/orientation" component={Orientation} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/change-password" component={ChangePassword} />
      <Route path="/create-experience" component={Createexperience} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile/:username" component={UserProfile} />
      <Route path="/question/:id" component={QuestionPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="uniconnect-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
