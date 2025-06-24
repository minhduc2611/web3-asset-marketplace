"use client";
import useAppState from "@/store/useAppState";
import UserAvatar from "./user-avatar";

const User = () => {
    const { user } = useAppState();

    if (!user) return null;

    return <UserAvatar user={user} />;
};

export default User;