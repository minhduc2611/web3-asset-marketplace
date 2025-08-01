"use client";

import { AuthUser } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useAppState from "@/store/useAppState";

interface UserAvatarProps {
  user: AuthUser | null;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const { signOut } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const initials = user?.email?.slice(0, 2).toUpperCase() || "??";
  const avatarUrl = null; // TODO: Add avatar URL support to AuthUser type

  const handleSignOut = async () => {
    router.push("/login");
    signOut();
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={user?.email || "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader className="space-y-4">
            <SheetTitle className="text-left">Account</SheetTitle>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarUrl} alt={user?.email || "User"} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "User"}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/profile");
                setIsOpen(false);
              }}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/settings");
                setIsOpen(false);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserAvatar; 