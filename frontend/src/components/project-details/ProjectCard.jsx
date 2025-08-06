import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProject } from "@/state/Project/projectSlice";
import { availableIcons } from "@/utils/availableIcons";
import { DotFilledIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EditProjectForm } from "../edit-projects/EditProjectForm";
import { useNotify } from "@/utils/notify";

export const ProjectCard = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notify = useNotify();

  if (!item || !item.id) {
    console.warn("Item inválido recebido no ProjectCard:", item);
    return null; // Não renderiza nada se item for inválido
  }

  const Icon =
    availableIcons.find((icon) => icon.name === item.icon)?.icon || null;

  const handleDelete = async () => {
    try {
      await dispatch(deleteProject({ projectId: item.id })).unwrap();
      notify({
        type: "error",
        message: "Projeto deletado com sucesso!",
        description: `O projeto "${item.name}" foi removido.`,
      });
    } catch (error) {
      notify({
        type: "error",
        message: "Erro ao deletar projeto",
        description: error || "Ocorreu um erro ao tentar deletar o projeto.",
      });
    }
  };

  return (
    <Card className="p-5 w-full lg:max-w-3xl">
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-5">
              {Icon && <Icon className="w-6 h-6" />}
              <h1
                onClick={() => navigate("/project/" + item.id)}
                className="cursor-pointer font-bold text-lg"
              >
                {item.name}
              </h1>
              <DotFilledIcon />
              <p className="text-sm text-gray-400">
                {item.category?.name || "Sem categoria"}
              </p>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon">
                    <DotsVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Atualizar
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Projeto</DialogTitle>
                      </DialogHeader>
                      <EditProjectForm
                        projectId={item.id.toString()}
                        onSuccess={() => {}}
                      />
                    </DialogContent>
                  </Dialog>
                  <DropdownMenuItem onClick={handleDelete}>
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="text-gray-500 text-sm">{item.description}</p>
          <p className="text-gray-500 text-sm">Status: {item.status}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {item.tags?.length ? (
            item.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">Sem tags</Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
