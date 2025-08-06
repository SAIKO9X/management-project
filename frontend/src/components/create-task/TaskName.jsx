import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const TaskName = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="opacity-75 text-sm font-medium">Título da Task</Label>
      <Input
        placeholder="Digite o nome da task..."
        className="h-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
