import {
  ClockArrowDown,
  ClockArrowUp,
  CircleEqual,
  Check,
  ChevronDown,
} from "lucide-react";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const priorities = [
  {
    name: "BAIXA",
    icon: ClockArrowDown,
    textColor: "text-green-700",
    backgroundColor: "bg-green-500/10",
  },
  {
    name: "MEDIA",
    icon: CircleEqual,
    textColor: "text-yellow-700",
    backgroundColor: "bg-yellow-500/10",
  },
  {
    name: "ALTA",
    icon: ClockArrowUp,
    textColor: "text-red-700",
    backgroundColor: "bg-red-500/10",
  },
];

export const PriorityList = ({ selectedPriority, setPriority }) => {
  const selected =
    priorities.find((p) => p.name.toUpperCase() === selectedPriority) ||
    priorities[0];

  function renderSelectedPriority() {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`size-6 ${selected.backgroundColor} rounded-md flex items-center justify-center text-lg ${selected.textColor}`}
        >
          {<selected.icon />}
        </div>
        <span className={`${selected.textColor}`}>{selected.name}</span>
      </div>
    );
  }

  function renderDropdownMenuItem(priority) {
    const isSelected = priority.name.toUpperCase() === selectedPriority;
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div
            className={`size-6 ${priority.backgroundColor} rounded-md flex items-center justify-center text-lg ${priority.textColor}`}
          >
            <priority.icon className={`text-lg ${priority.textColor}`} />
          </div>
          <span className={`${priority.textColor}`}>{priority.name}</span>
        </div>
        {isSelected && <Check className="text-primary w-4 h-4" />}
      </div>
    );
  }

  return (
    <div>
      <Label className="opacity-75 text-sm font-medium">Prioridade</Label>
      <div className="mt-2 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              id="priority-dropdown"
              variant="outline"
              className="w-full h-11 flex justify-between"
            >
              {renderSelectedPriority()}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]"
          >
            {priorities.map((priority, index) => (
              <DropdownMenuItem
                key={index}
                className="flex items-center gap-2"
                onClick={() => setPriority(priority.name.toUpperCase())}
              >
                {renderDropdownMenuItem(priority)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
