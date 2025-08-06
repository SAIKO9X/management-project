import { Check } from "lucide-react";
import { CommandItem } from "../ui/command";
import { availableIcons } from "@/utils/availableIcons";

export const SingleProjectCommandItem = ({
  project,
  isSelected,
  onSelectedItem,
}) => {
  const { name: projectName, tasks, icon: iconName } = project;
  const ProjectIcon =
    availableIcons.find((icon) => icon.name === iconName)?.icon || null;

  return (
    <CommandItem
      value={projectName}
      onSelect={() => onSelectedItem(project)}
      className="cursor-pointer hover:bg-primary/10 rounded-lg p-2 w-full"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex items-center justify-center rounded-md p-2">
            {ProjectIcon && (
              <ProjectIcon className="w-5 h-5 text-white" strokeWidth={2} />
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-medium">{projectName}</span>
            <span className="text-xs text-zinc-500">
              {tasks?.length || 0} tasks
            </span>
          </div>
        </div>

        {isSelected && (
          <div className="bg-primary rounded-full flex items-center justify-center p-1.5">
            <Check className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
        )}
      </div>
    </CommandItem>
  );
};
