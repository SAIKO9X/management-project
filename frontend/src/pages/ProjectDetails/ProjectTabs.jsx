import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDetails } from "./ProjectDetails";
import { DetailsProject } from "@/components/project-details/DetailsProject";
import { RoleManagement } from "@/components/user/RoleManagement";

export const ProjectTabs = () => {
  const { id } = useParams();
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const user = useSelector((state) => state.auth.user);

  const isOwner =
    selectedProject && user && selectedProject.owner.id === user.id;

  return (
    <div className="mt-5 lg:px-10">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="flex gap-4">
          <TabsTrigger value="details">Detalhes do Projeto</TabsTrigger>
          <TabsTrigger value="boards">Tasks</TabsTrigger>
          {isOwner && <TabsTrigger value="roles">Gerenciar Cargos</TabsTrigger>}
        </TabsList>
        <TabsContent value="details">
          <ProjectDetails />
        </TabsContent>
        <TabsContent value="boards">
          <DetailsProject />
        </TabsContent>
        {isOwner && (
          <TabsContent value="roles">
            {selectedProject && selectedProject.id === parseInt(id) ? (
              <RoleManagement projectId={id} />
            ) : (
              <div>Carregando detalhes do projeto...</div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
