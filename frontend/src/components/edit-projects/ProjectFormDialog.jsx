import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { availableIcons } from "@/utils/availableIcons";

const projectSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  status: z.string().optional(),
  icon: z.string().optional(),
});

export const ProjectFormDialog = ({
  isOpen,
  onOpenChange,
  project,
  onSave,
}) => {
  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      status: project?.status || "Em Progresso",
      icon: project?.icon || availableIcons[0].name, // Valor padrão ajustado
    },
  });

  const handleSubmit = (data) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {project ? "Editar Projeto" : "Criar Projeto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label>Nome</label>
            <Input {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label>Descrição</label>
            <Input {...form.register("description")} />
          </div>
          <div>
            <label>Status</label>
            <Input {...form.register("status")} />
          </div>
          <div>
            <label>Ícone</label>
            <Select
              onValueChange={(value) => form.setValue("icon", value)}
              defaultValue={form.getValues("icon")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um ícone" />
              </SelectTrigger>
              <SelectContent>
                {availableIcons.map((iconObj) => (
                  <SelectItem key={iconObj.name} value={iconObj.name}>
                    <div className="flex items-center gap-2">
                      <iconObj.icon className="w-5 h-5" />
                      <span>{iconObj.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
