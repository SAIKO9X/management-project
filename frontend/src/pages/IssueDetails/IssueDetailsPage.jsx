import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ClockArrowDown,
  ClockArrowUp,
  CircleEqual,
  Check,
  UserCircle,
  MessageSquare,
  Paperclip,
  Flag,
  Trash2,
  Edit2, // Adicionado para o ícone de edição
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchIssueById,
  updateIssueStatus,
  assignUserToIssue,
  updateIssue,
} from "@/state/Issue/issueSlice";
import {
  fetchComments,
  createComment,
  deleteComment,
  updateComment, // <-- CORREÇÃO AQUI
} from "@/state/Comment/commentsSlice";
import { fetchAttachments } from "@/state/Attachment/attachmentSlice";
import { AttachmentDisplay } from "@/components/create-task/AttachmentDisplay";
import { ArrowLeft } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { getDueMessage } from "@/utils/dateUtils";
import { UserAvatar } from "@/components/user/UserAvatar";

export const IssueDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId, issueId } = useParams();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const issueDetails = useSelector((state) => state.issue.issueDetails);
  const comments = useSelector((state) => state.comment.comments);
  const attachments = useSelector((state) => state.attachment.attachments);
  const { user } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState("");
  const [editDescription, setEditDescription] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState("");

  const isValidDate = (date) => {
    if (!date) return false;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const handleSaveComment = (commentId) => {
    dispatch(updateComment({ commentId, content: editedContent })).then(() => {
      setEditingCommentId(null);
      setEditedContent("");
    });
  };

  useEffect(() => {
    if (issueId) {
      dispatch(fetchIssueById(issueId));
      dispatch(fetchComments(issueId));
      dispatch(fetchAttachments(issueId));
    }
  }, [dispatch, issueId]);

  useEffect(() => {
    if (issueDetails) {
      setUpdatedDescription(issueDetails.description || "");
    }
  }, [issueDetails]);

  if (!issueDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando detalhes da issue...
      </div>
    );
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "BAIXA":
        return <ClockArrowDown className="h-4 w-4 text-green-600" />;
      case "MEDIA":
        return <CircleEqual className="h-4 w-4 text-yellow-600" />;
      case "ALTA":
        return <ClockArrowUp className="h-4 w-4 text-red-600" />;
      default:
        return <CircleEqual className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "BAIXA":
        return "bg-green-100 text-green-800 border-green-300";
      case "MEDIA":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "ALTA":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "A_FAZER":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "EM_PROGRESSO":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "CONCLUIDO":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "A_FAZER":
        return "A Fazer";
      case "EM_PROGRESSO":
        return "Em Andamento";
      case "CONCLUIDO":
        return "Concluído";
      default:
        return status;
    }
  };

  const getTypeDisplay = (type) => {
    switch (type) {
      case "BUG":
        return "Bug";
      case "FEATURE":
        return "Feature";
      case "TASK":
        return "Tarefa";
      case "IMPROVEMENT":
        return "Melhoria";
      case "RESEARCH":
        return "Pesquisa";
      case "SPIKE":
        return "Spike";
      default:
        return type;
    }
  };

  const handleStatusChange = (newStatus) => {
    dispatch(updateIssueStatus({ issueId, status: newStatus }));
  };

  const handleSaveDescription = () => {
    dispatch(
      updateIssue({
        issueId,
        issueData: { description: updatedDescription },
      })
    ).then(() => {
      dispatch(fetchIssueById(issueId));
    });
    setEditDescription(false);
  };

  const handleCancelEditDescription = () => {
    setUpdatedDescription(issueDetails.description || "");
    setEditDescription(false);
  };

  const handleAssignToMe = () => {
    dispatch(assignUserToIssue({ issueId, userId: user.id }));
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;

    dispatch(
      createComment({
        content: commentText,
        issueId: Number(issueId),
        userId: user.id,
      })
    );

    setCommentText("");
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div>
          <Button
            className="mb-8 flex items-center"
            onClick={() => navigate(`/project/${projectId}`)}
          >
            <ArrowLeft className="w-12 h-12" />
            <span className="pb-0.5">VOLTAR</span>
          </Button>
          <h1 className="text-2xl font-bold">{issueDetails.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{getTypeDisplay(issueDetails.type)}</Badge>
            <Badge
              variant="outline"
              className={getPriorityColor(issueDetails.priority)}
            >
              {getPriorityIcon(issueDetails.priority)} {issueDetails.priority}
            </Badge>
            <Badge
              variant="outline"
              className={getStatusColor(issueDetails.status)}
            >
              {getStatusDisplay(issueDetails.status)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status: {getStatusDisplay(issueDetails.status)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusChange("A_FAZER")}>
                A Fazer{" "}
                {issueDetails.status === "A_FAZER" && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("EM_PROGRESSO")}
              >
                Em Andamento{" "}
                {issueDetails.status === "EM_PROGRESSO" && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("CONCLUIDO")}>
                Concluído{" "}
                {issueDetails.status === "CONCLUIDO" && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleAssignToMe} variant="outline">
            {issueDetails.assignee
              ? issueDetails.assignee.id === user.id
                ? "Atribuído a mim"
                : `Reatribuir para mim`
              : "Atribuir a mim"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="comments">
                Comentários ({comments?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="attachments">Anexos</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                  {editDescription ? (
                    <div>
                      <Textarea
                        className="min-h-[150px]"
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="outline"
                          onClick={handleCancelEditDescription}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveDescription}>Salvar</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <p className="whitespace-pre-line">
                        {issueDetails.description || "Sem descrição."}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0"
                        onClick={() => setEditDescription(true)}
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {comments?.length > 0 ? (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex gap-4 py-4 border-b last:border-b-0"
                        >
                          <UserAvatar user={comment.user} size="sm" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">
                                  {comment.user?.fullName || "Utilizador"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {comment.createdAt
                                    ? new Date(
                                        comment.createdAt
                                      ).toLocaleString("pt-BR")
                                    : "Data não disponível"}
                                </p>
                              </div>
                              {comment.user.id === user.id && (
                                <div className="flex items-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditComment(comment)}
                                  >
                                    <Edit2 className="h-4 w-4 text-gray-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            {editingCommentId === comment.id ? (
                              <div className="mt-2">
                                <Textarea
                                  value={editedContent}
                                  onChange={(e) =>
                                    setEditedContent(e.target.value)
                                  }
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
                                    onClick={() =>
                                      handleSaveComment(comment.id)
                                    }
                                  >
                                    Guardar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="mt-2">{comment.content}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">
                        Nenhum comentário ainda.
                      </p>
                    )}

                    <div className="mt-4">
                      <Textarea
                        placeholder="Adicione um comentário..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          onClick={handlePostComment}
                          disabled={!commentText.trim()}
                        >
                          Comentar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="mt-4">
              <AttachmentDisplay issueId={issueId} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Atribuído a
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {issueDetails.assignee ? (
                    <>
                      <UserAvatar user={issueDetails.assignee} size="sm" />
                      <span>{issueDetails.assignee.fullName || "Usuário"}</span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UserCircle className="h-5 w-5" />
                      <span>Não atribuído</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Data de Vencimento
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarIcon
                    className={`h-5 w-5 ${
                      getDueMessage(issueDetails.dueDate, issueDetails.title)
                        .color
                    }`}
                  />
                  <span
                    className={
                      getDueMessage(issueDetails.dueDate, issueDetails.title)
                        .color
                    }
                  >
                    {
                      getDueMessage(issueDetails.dueDate, issueDetails.title)
                        .message
                    }
                  </span>
                </div>
              </div>

              <Separator />

              {issueDetails.milestone && (
                <div className="space-y-1">
                  <p className="font-semibold">Sprint</p>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Flag className="h-5 w-5" />
                      <span>{issueDetails.milestone.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Descrição:{" "}
                      {issueDetails.milestone.description || "Sem descrição"}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">
                        Início:{" "}
                        {format(
                          new Date(issueDetails.milestone.startDate),
                          "dd/MM/yyyy",
                          { locale: ptBR }
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">|</span>
                      <span className="text-sm text-muted-foreground">
                        Fim:{" "}
                        {format(
                          new Date(issueDetails.milestone.endDate),
                          "dd/MM/yyyy",
                          { locale: ptBR }
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Status: {issueDetails.milestone.status}
                    </span>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Criado por
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <UserAvatar user={issueDetails.creator} size="sm" />
                  <span>{issueDetails.creator?.fullName || "Usuário"}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Criado em
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {(() => {
                      return isValidDate(issueDetails.createdAt)
                        ? format(
                            new Date(issueDetails.createdAt),
                            "dd/MM/yyyy HH:mm"
                          )
                        : "Data indisponível";
                    })()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Última atualização
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {isValidDate(issueDetails.updatedAt)
                      ? format(
                          new Date(issueDetails.updatedAt),
                          "dd/MM/yyyy HH:mm"
                        )
                      : "Data indisponível"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span>{comments?.length || 0} comentários</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                <span>{attachments?.length || 0} anexos</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
