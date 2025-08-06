import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/config/api";

export const UserAvatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const getBackgroundColor = (name) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Avatar className={sizeClasses[size]}>
      {user.profilePicture ? (
        <AvatarImage
          src={`${API_BASE_URL}${user.profilePicture}`}
          alt={user.fullName}
        />
      ) : (
        <AvatarFallback
          style={{ backgroundColor: getBackgroundColor(user.fullName) }}
        >
          {user.fullName.charAt(0).toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>
  );
};
