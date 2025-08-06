import { ClockArrowDown, ClockArrowUp, CircleEqual, Flag } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { TasksDropdown } from "./TasksDropdown";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SingleTask = React.memo(({ task, boardId, isDragging }) => {
  const priorityIcons = {
    BAIXA: <ClockArrowDown className="h-4 w-4" />,
    MEDIA: <CircleEqual className="h-4 w-4" />,
    ALTA: <ClockArrowUp className="h-4 w-4" />,
  };

  const priorityStyles = {
    BAIXA: "bg-green-100 text-green-800 border-green-300",
    MEDIA: "bg-yellow-100 text-yellow-800 border-yellow-300",
    ALTA: "bg-red-100 text-red-800 border-red-300",
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return "Sem data de vencimento";
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) return "Data inválida";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    data: { task, boardId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.4 : 1,
    zIndex: isDragging || isSortableDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab touch-none"
    >
      <Card className={isDragging ? "opacity-50" : ""}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div
              className={`p-1 py-1 rounded-3xl px-2 pr-4 font-medium flex items-center justify-center gap-2 border ${
                priorityStyles[task.priority] ||
                "bg-gray-100 text-gray-800 border-gray-300"
              }`}
            >
              {priorityIcons[task.priority] || (
                <CircleEqual className="h-4 w-4" />
              )}
              <span className="text-xs">{task.priority}</span>
            </div>
            <TasksDropdown issueId={task.id} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 mt-1">
          <span className="font-semibold text-lg">{task.title}</span>
          <span className="text-sm text-muted-foreground">
            {task.description}
          </span>
          <span className="text-sm text-muted-foreground">
            Tipo: {getTypeDisplay(task.type)}
          </span>
          <span className="text-sm text-muted-foreground">
            Data de Vencimento: {formatDueDate(task.dueDate)}
          </span>
          {task.milestone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flag className="h-4 w-4" />
              <span>Milestone: {task.milestone.name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
