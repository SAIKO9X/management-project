import { SingleTask } from "./SingleTask";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const SingleBoard = ({ board }) => {
  const { name: boardName, tasks, id } = board;

  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-full h-full border border-black/10 rounded-2xl p-4 ${
        isOver ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex justify-between p-4 rounded-lg items-center bg-black/5">
        <span className="font-medium text-md">{boardName}</span>
        <div className="size-6 rounded-full bg-primary text-white flex items-center justify-center">
          <span className="text-sm">{tasks.length}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-7 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Todas as tarefas concluídas por aqui!
          </div>
        ) : (
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <SingleTask key={task.id} task={task} boardId={id} />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};
