import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProjectById, selectProject } from "@/state/Project/projectSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import { InviteUserForm } from "./InviteUserForm";
import { ChatBox } from "./ChatBox";
import { AllProjectsDialog } from "@/components/edit-projects/AllProjectsDialog";
import { UserAvatar } from "@/components/user/UserAvatar";

export const ProjectDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const selectedProject = useSelector((store) => store.project.selectedProject);
  const projects = useSelector((store) => store.project.projects);
  const [isAllProjectsOpen, setIsAllProjectsOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id)).then((action) => {
        if (action.type === "projects/fetchById/fulfilled") {
          dispatch(selectProject(action.payload));
        }
      });
    }
  }, [id, dispatch]);

  if (!selectedProject) return <div>Carregando...</div>;

  return (
    <div className="mt-5">
      <div className="lg:flex gap-5 justify-between pb-4">
        <ScrollArea className="h-screen lg:w-[69%] pr-2">
          <div className="pb-10 w-full">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold pb-2">
                {selectedProject.name}
              </h1>
              <Button
                variant="outline"
                onClick={() => setIsAllProjectsOpen(true)}
                className="ml-4"
              >
                Gerenciar Projetos
              </Button>
            </div>

            <div className="space-y-5 pb-10 text-sm">
              <p className="w-full md:max-w-lg lg:max-w-xl text-zinc-400">
                {selectedProject.description}
              </p>
              <div className="flex">
                <p className="w-36">Lider do Projeto:</p>
                <p>{selectedProject.owner.fullName}</p>
              </div>

              <div className="flex items-center">
                <p className="w-36">Membros:</p>
                <div className="flex items-center gap-2">
                  {selectedProject.team.map((item) => (
                    <UserAvatar
                      key={item}
                      user={item}
                      size="sm"
                      className="cursor-pointer"
                    />
                  ))}
                  {/* Controla o estado do diálogo de convite */}
                  <Dialog
                    open={isInviteDialogOpen}
                    onOpenChange={setIsInviteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-2 flex items-center justify-center gap-1"
                      >
                        <span>Convidar</span>
                        <PlusIcon />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>Convidar Usuário</DialogHeader>
                      {/* Passa a função para fechar o diálogo */}
                      <InviteUserForm
                        onClose={() => setIsInviteDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="flex">
                <p className="w-36">Categoria:</p>
                <p>{selectedProject.category?.name || "Sem categoria"}</p>
              </div>

              <div className="flex">
                <p className="w-36">Status:</p>
                <Badge className="rounded-full">em progresso</Badge>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="lg:w-[30%] rounded-md sticky right-5 top-10">
          <ChatBox />
        </div>
      </div>

      <AllProjectsDialog
        projects={projects}
        setProjects={() => {}}
        isOpen={isAllProjectsOpen}
        onOpenChange={setIsAllProjectsOpen}
      />
    </div>
  );
};
