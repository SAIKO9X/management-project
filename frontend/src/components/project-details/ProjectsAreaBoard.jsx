import { useState, useEffect } from "react";
import { SingleBoard } from "./SingleBoard";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SingleTask } from "./SingleTask";
import { useDispatch, useSelector } from "react-redux";
import { updateIssueStatus, fetchIssues } from "@/state/Issue/issueSlice";
import { useParams } from "react-router-dom";

export const ProjectsAreaBoard = ({ boards, setBoards }) => {
  const [activeTask, setActiveTask] = useState(null);
  const dispatch = useDispatch();
  const { id: projectId } = useParams();

  useEffect(() => {
    if (projectId) {
      dispatch(fetchIssues(projectId));
    }
  }, [dispatch, projectId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const getBackendStatus = (boardName) => {
    return removeAccents(boardName).replace(" ", "_").toUpperCase();
  };

  const findBoardByTaskId = (taskId) =>
    boards.find((board) => board.tasks.some((task) => task.id === taskId));
  const findTaskById = (taskId) =>
    boards.flatMap((board) => board.tasks).find((task) => task.id === taskId);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTask(findTaskById(active.id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTaskId = active.id;
    const overId = over.id;

    const activeBoard = findBoardByTaskId(activeTaskId);
    const overBoard =
      findBoardByTaskId(overId) || boards.find((board) => board.id === overId);

    if (!overBoard) {
      setActiveTask(null);
      return;
    }

    if (activeBoard.id === overBoard.id) {
      const activeIndex = activeBoard.tasks.findIndex(
        (t) => t.id === activeTaskId
      );
      const overIndex = activeBoard.tasks.findIndex((t) => t.id === overId);

      if (activeIndex !== overIndex) {
        const newTasks = [...activeBoard.tasks];
        const [movedTask] = newTasks.splice(activeIndex, 1);
        newTasks.splice(overIndex, 0, movedTask);

        setBoards((prevBoards) =>
          prevBoards.map((board) =>
            board.id === activeBoard.id ? { ...board, tasks: newTasks } : board
          )
        );
      }
    } else {
      const activeTask = findTaskById(activeTaskId);
      const statusWithoutAccents = getBackendStatus(overBoard.name);

      dispatch(
        updateIssueStatus({
          issueId: activeTaskId,
          status: statusWithoutAccents,
        })
      );

      setBoards((prevBoards) =>
        prevBoards.map((board) => {
          if (board.id === activeBoard.id) {
            return {
              ...board,
              tasks: board.tasks.filter((t) => t.id !== activeTaskId),
            };
          }
          if (board.id === overBoard.id) {
            return {
              ...board,
              tasks: [
                ...board.tasks,
                { ...activeTask, status: statusWithoutAccents },
              ],
            };
          }
          return board;
        })
      );
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full rounded-2xl flex items-start mt-4 gap-3 pb-8">
        {boards.map((board) => (
          <SingleBoard key={board.id} board={board} />
        ))}
      </div>
      <DragOverlay adjustScale={false}>
        {activeTask ? <SingleTask task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};
