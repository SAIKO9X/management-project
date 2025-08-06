import { TaskDialog } from "../create-task/TaskDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MilestoneManagement } from "../create-task/MilestoneManagement";

export const ProjectsAreaHeader = ({ boards, setBoards, selectedProject }) => {
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);

  return (
    <div className="flex justify-between items-center border border-black/10 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">Projetos</span>
      </div>
      <div className="flex gap-2">
        <TaskDialog
          boards={boards}
          setBoards={setBoards}
          selectedProject={selectedProject}
        />
        <Dialog
          open={isMilestoneDialogOpen}
          onOpenChange={setIsMilestoneDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline">Gerenciar Sprints</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <span className="pb-4"></span>
            <MilestoneManagement />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
