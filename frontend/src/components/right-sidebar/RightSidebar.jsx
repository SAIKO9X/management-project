import React from "react";
import { Card } from "../ui/card";
import { ProjectSelectionDropdown } from "./ProjectSelectionDropdown";
import { CircularProgress } from "./CircularProgress";
import { TasksStats } from "./TasksStats";
import { useSelector } from "react-redux";

const calculateStats = (issues) => {
  const totalTasks = issues.length;
  const completedTasks = issues.filter(
    (issue) => issue.status === "CONCLUIDO"
  ).length;
  const inProgressTasks = issues.filter(
    (issue) => issue.status === "EM_PROGRESSO"
  ).length;
  const toDoTasks = issues.filter((issue) => issue.status === "A_FAZER").length;
  const pausedTasks = 0;

  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    totalTasks,
    inProgressTasks,
    pausedTasks,
    completedTasks,
    toDoTasks,
    completionPercentage,
  };
};

export const RightSidebar = ({ projects }) => {
  const selectedProject = useSelector((store) => store.project.selectedProject);
  const { issues } = useSelector((store) => store.issue);
  const projectIssues = issues.filter(
    (issue) => issue.projectID === selectedProject?.id
  );
  const stats = calculateStats(projectIssues);

  if (!selectedProject) return <div>Selecione um projeto</div>;

  return (
    <Card className="shadow-none p-4 rounded-3xl max-h-[640px]">
      <div className="flex flex-col gap-0">
        <ProjectSelectionDropdown projects={projects} />
        <CircularProgress percentage={stats.completionPercentage} />
        <TasksStats stats={stats} />
      </div>
    </Card>
  );
};
