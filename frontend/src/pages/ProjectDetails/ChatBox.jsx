import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user/UserAvatar";
import {
  fetchChatByProject,
  fetchChatMessages,
  sendMessage,
  deleteMessage,
  updateMessage,
} from "@/state/Chat/chatSlice";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ChatBox = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const { auth, chat } = useSelector((store) => store);
  const selectedProject = useSelector((store) => store.project.selectedProject);

  const handleEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditedContent(message.content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent("");
  };

  const handleSaveMessage = (messageId) => {
    dispatch(updateMessage({ messageId, content: editedContent })).then(() => {
      setEditingMessageId(null);
      setEditedContent("");
    });
  };

  const handleDeleteMessage = (messageId) => {
    dispatch(deleteMessage(messageId));
  };

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
    if (e.key === "Enter" && !e.shiftKey) {
      // Permite que Shift+Enter crie uma nova linha
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="sticky">
      <div className="border rounded-lg">
        <h1 className="border-b p-5">Bate Papo</h1>
        <ScrollArea className="h-[32rem] w-full p-5 flex gap-3 flex-col">
          {chat.messages?.map((item) => {
            const isMyMessage = item.sender.id === auth.user.id;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-2 mb-2 group ${
                  isMyMessage ? "justify-end" : "justify-start"
                }`}
              >
                {!isMyMessage && <UserAvatar user={item.sender} />}

                {isMyMessage && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <EllipsisVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleEditMessage(item)}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteMessage(item.id)}
                          className="text-red-600"
                        >
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                <div
                  className={`space-y-2 py-2 px-5 border rounded-lg max-w-xs ${
                    isMyMessage ? "bg-primary/10" : ""
                  }`}
                >
                  <p className="font-semibold">{item.sender.fullName}</p>
                  {editingMessageId === item.id ? (
                    <div>
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="bg-white"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveMessage(item.id)}
                        >
                          Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-600 break-words">{item.content}</p>
                  )}
                </div>

                {isMyMessage && <UserAvatar user={item.sender} />}
              </div>
            );
          })}
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
