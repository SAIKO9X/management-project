import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ProjectCommandItens } from "./ProjectCommandItens";
import { fetchProjects } from "@/state/Project/projectSlice";
import { availableIcons } from "@/utils/availableIcons";

export const ProjectSelectionDropdown = () => {
  const dispatch = useDispatch();
  const projects = useSelector((store) => store.project.projects) || [];
  const selectedProjectFromStore = useSelector(
    (store) => store.project.selectedProject
  );
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Sincronizar o selectedProject local com o estado global do Redux
  useEffect(() => {
    if (selectedProjectFromStore) {
      setSelectedProject(selectedProjectFromStore);
    } else if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]); // Define o primeiro projeto como padrão se nada estiver selecionado
    }
  }, [projects, selectedProjectFromStore]);

  if (!selectedProject) {
    return <div>Carregando projetos...</div>;
  }

  const IconComponent =
    availableIcons.find((icon) => icon.name === selectedProject.icon)?.icon ||
    null;

  return (
    <Popover>
      <PopoverTrigger asChild className="cursor-pointer">
        <Button
          variant="ghost"
          className="w-full flex justify-between py-9 rounded-xl bg-black/5"
        >
          <div className="flex items-start flex-col gap-1">
            <p className="text-xs">PROJETO</p>
            <p className="font-semibold text-lg">{selectedProject.name}</p>
          </div>

          <div className="size-10 bg-primary rounded-full flex items-center justify-center text-2xl text-white">
            {IconComponent && <IconComponent />}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={4}
        align="start"
        className="p-2 rounded-xl w-[var(--radix-popover-trigger-width)]"
      >
        <ProjectCommandItens
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      </PopoverContent>
    </Popover>
  );
};
