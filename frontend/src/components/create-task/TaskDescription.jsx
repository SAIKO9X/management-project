import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export const TaskDescription = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <Label className="opacity-75 text-sm font-medium">
        Descrição da Task
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite uma descrição para a task..."
        className="resize-none"
      />
    </div>
  );
};
