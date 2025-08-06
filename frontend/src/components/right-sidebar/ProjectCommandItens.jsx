import { useDispatch, useSelector } from "react-redux";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "../ui/command";
import { SingleProjectCommandItem } from "./SingleProjectCommandItem";
import { selectProject } from "@/state/Project/projectSlice";
import { useNavigate } from "react-router-dom";

export const ProjectCommandItens = ({ projects }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedProject = useSelector((store) => store.project.selectedProject);

  function handleSelectProject(project) {
    dispatch(selectProject(project));
    navigate(`/project/${project.id}`);
  }

  return (
    <Command>
      <CommandInput placeholder="Pesquisar projeto..." />
      <CommandList className="my-3">
        <CommandEmpty>Nenhum projeto encontrado.</CommandEmpty>
      </CommandList>

      <div className="flex flex-col gap-3 w-full">
        {projects.map((project) => (
          <SingleProjectCommandItem
            key={project.id}
            project={project}
            onSelectedItem={handleSelectProject}
            isSelected={selectedProject?.id === project.id}
          />
        ))}
      </div>
    </Command>
  );
};
