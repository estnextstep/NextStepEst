import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  User,
  LogOut,
  UserCircle,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "../logo.png";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const links = [
    { name: "Home", href: "/" },
    { name: "Experiences", href: "/experiences" },
    { name: "Q&A", href: "/qa" },
    { name: "Orientation Test", href: "/orientation" },
  ];

  const handleNavigate = (path) => {
    setLocation(path);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    setLocation("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto h-16 px-4 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => handleNavigate("/")}
          className="flex items-center cursor-pointer"
        >
          <img src={logo} alt="Logo" className="h-14 w-auto" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <span
              key={link.href}
              onClick={() => handleNavigate(link.href)}
              className={cn(
                "relative text-sm cursor-pointer transition-all",
                location === link.href
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.name}
              {location === link.href && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary rounded-full" />
              )}
            </span>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          <ModeToggle />

          {/* Desktop Auth */}
          {user ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate("/profile")}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-full px-5">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 pt-4 space-y-4 bg-background border-t">

          {/* Links */}
          {links.map((link) => (
            <div
              key={link.href}
              onClick={() => handleNavigate(link.href)}
              className={cn(
                "py-2 text-sm cursor-pointer",
                location === link.href
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {link.name}
            </div>
          ))}

          <div className="pt-4 border-t space-y-2">

            {user ? (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleNavigate("/profile")}
                >
                  Profile
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}
