import { ProjectsAreaBoard } from "./ProjectsAreaBoard";
import { ProjectsAreaHeader } from "./ProjectsAreaHeader";

export const ProjectsArea = ({
  projects,
  setProjects,
  boards,
  setBoards,
  selectedProject,
}) => {
  return (
    <div>
      <ProjectsAreaHeader projects={projects} setProjects={setProjects} />
      <ProjectsAreaBoard
        boards={boards}
        setBoards={setBoards}
        selectedProject={selectedProject}
      />
    </div>
  );
};
