import { useNotification } from "@/components/ui/NotificationProvider";

export const useNotify = () => {
  const { notify } = useNotification();
  return notify;
};
