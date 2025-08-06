import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user/UserAvatar";
import {
  fetchChatByProject,
  fetchChatMessages,
  sendMessage,
} from "@/state/Chat/chatSlice";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ChatBox = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const selectedProject = useSelector((store) => store.project.selectedProject);
  const { auth, chat } = useSelector((store) => store);

  useEffect(() => {
    if (selectedProject) {
      dispatch(fetchChatByProject(selectedProject.id));
    }
  }, [dispatch, selectedProject]);

  useEffect(() => {
    if (chat.chat?.id) {
      dispatch(fetchChatMessages(chat.chat.id));
    }
  }, [dispatch, chat.chat?.id]);

  const handleSendMessage = () => {
    if (message.trim() && selectedProject) {
      dispatch(
        sendMessage({
          senderId: auth.user?.id,
          projectId: selectedProject.id,
          content: message,
        })
      );
      setMessage("");
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="sticky">
      <div className="border rounded-lg">
        <h1 className="border-b p-5">Bate Papo</h1>
        <ScrollArea className="h-[32rem] w-full p-5 flex gap-3 flex-col">
          {chat.messages?.map((item) => (
            <div className="flex gap-2 mb-2 justify-start" key={item.id}>
              <UserAvatar user={item.sender} />
              <div className="space-y-2 py-2 px-5 border rounded-ss-2xl rounded-e-xl">
                <p>{item.sender.fullName}</p>
                <p className="text-zinc-600">{item.content}</p>
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="relative p-0">
          <Input
            placeholder="Escreva uma mensagem..."
            className="py-7 border-t outline-none focus:outline-none focus:ring-0 rounded-none border-b-0 border-x-0"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
          />

          <Button
            onClick={handleSendMessage}
            className="absolute right-2 top-3 rounded-full"
            size="icon"
            variant="ghost"
          >
            <PaperPlaneIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
