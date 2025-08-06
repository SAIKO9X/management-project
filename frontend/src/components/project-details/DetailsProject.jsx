import { useState, useEffect } from "react";
import { ProjectsArea } from "./ProjectsArea";
import { RightSidebar } from "../right-sidebar/RightSidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchIssues } from "@/state/Issue/issueSlice";

export const DetailsProject = () => {
  const dispatch = useDispatch();
  const selectedProject = useSelector((store) => store.project.selectedProject);
  const { issues } = useSelector((store) => store.issue);

  const [boards, setBoards] = useState([
    { id: "board-1", name: "A Fazer", tasks: [] },
    { id: "board-2", name: "Em Progresso", tasks: [] },
    { id: "board-3", name: "Concluído", tasks: [] },
  ]);

  const statusMap = {
    A_FAZER: "A Fazer",
    EM_PROGRESSO: "Em Progresso",
    CONCLUIDO: "Concluído",
  };

  useEffect(() => {
    if (selectedProject) {
      dispatch(fetchIssues(selectedProject.id));
    }
  }, [dispatch, selectedProject]);

  useEffect(() => {
    console.log("Redux issues atualizadas:", issues);
    if (issues.length > 0 && selectedProject) {
      const projectIssues = issues.filter(
        (issue) => issue.projectID === selectedProject.id
      );
      const updatedBoards = boards.map((board) => ({
        ...board,
        tasks: projectIssues.filter(
          (issue) => statusMap[issue.status] === board.name
        ),
      }));
      console.log("Chamando setBoards com:", updatedBoards);
      setBoards(updatedBoards);
    } else if (issues.length === 0 && selectedProject) {
      console.log("Nenhuma issue encontrada, limpando boards.");
      setBoards([
        { id: "board-1", name: "A Fazer", tasks: [] },
        { id: "board-2", name: "Em Progresso", tasks: [] },
        { id: "board-3", name: "Concluído", tasks: [] },
      ]);
    }
  }, [issues, selectedProject]);

  if (!selectedProject) return <div>Selecione um projeto</div>;

  return (
    <div className="grid grid-cols-[3fr_1fr] px-6 mt-8 gap-4">
      <ProjectsArea
        projects={[selectedProject]}
        boards={boards}
        setBoards={setBoards}
        selectedProject={selectedProject}
      />
      <RightSidebar projects={[selectedProject]} />
    </div>
  );
};
