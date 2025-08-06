import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Trash2, FilePenLine } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/state/Project/projectSlice";
import { availableIcons } from "@/utils/availableIcons";
import { EditProjectForm } from "./EditProjectForm";

export const AllProjectsDialog = ({ isOpen, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const dispatch = useDispatch();
  const projects = useSelector((store) => store.project.projects);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Tem certeza que deseja deletar este projeto?")) {
      dispatch(deleteProject(projectId));
    }
  };

  const handleOpenForm = (project = null) => {
    setCurrentProjectId(project ? project.id : null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setCurrentProjectId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Todos os Projetos</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Lista de todos os projetos disponíveis
          </p>
        </DialogHeader>

        <Separator />

        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Pesquisar projetos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/2"
          />
          <div>
            <Button onClick={() => handleOpenForm()} className="mr-2">
              Criar Projeto
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredProjects.map((project) => {
            const IconComponent =
              availableIcons.find((icon) => icon.name === project.icon)?.icon ||
              null;
            return (
              <div
                key={project.id}
                className="border p-4 rounded-lg flex items-center justify-between hover:bg-black/5 transition-all delay-50 ease-in-out"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-black p-1.5 rounded-lg text-white">
                    {IconComponent && <IconComponent />}
                  </div>
                  <div className="flex flex-col">
                    <span>{project.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {project.issues ? project.issues.length : 0} tasks
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleOpenForm(project)}
                    size="icon"
                    className="text-black bg-black/10 hover:bg-black/20 cursor-pointer"
                  >
                    <FilePenLine />
                  </Button>

                  <Button
                    onClick={() => handleDeleteProject(project.id)}
                    size="icon"
                    className="text-red-700 bg-red-500/10 hover:bg-red-500/20 cursor-pointer"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {projects.length} Projetos
          </div>
        </div>
      </DialogContent>

      {isFormOpen && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <EditProjectForm
              projectId={currentProjectId}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};
