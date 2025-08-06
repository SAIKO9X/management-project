import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { TaskName } from "@/components/create-task/TaskName";
import { TaskDescription } from "@/components/create-task/TaskDescription";
import { PriorityList } from "@/components/create-task/PriorityList";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const taskSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  priority: z.enum(["BAIXA", "MEDIA", "ALTA"], {
    errorMap: () => ({ message: "Selecione uma prioridade válida" }),
  }),
  type: z.enum(["BUG", "FEATURE", "TASK", "IMPROVEMENT", "RESEARCH", "SPIKE"], {
    errorMap: () => ({ message: "Selecione um tipo válido" }),
  }),
  dueDate: z.date().nullable().optional(),
  milestoneId: z.number().nullable().optional(),
});

export const EditIssueForm = ({ issue, onSave }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    issue.dueDate ? new Date(issue.dueDate) : null
  );
  const milestones = useSelector((state) => state.milestone.milestones);

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      type: issue.type,
      dueDate: issue.dueDate ? new Date(issue.dueDate) : null,
      milestoneId: issue.milestone?.id || null,
    },
  });

  const onSubmit = (data) => {
    const updatedIssue = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      type: data.type,
      dueDate: data.dueDate
        ? format(data.dueDate, "yyyy-MM-dd'T'HH:mm:ss")
        : null,
      milestoneId: data.milestoneId || null,
      status: issue.status,
    };
    console.log("Enviando para o backend:", updatedIssue);
    onSave(updatedIssue);
  };

  const handleDateSelect = (date, onChange) => {
    onChange(date);
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TaskName value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TaskDescription
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PriorityList
                  selectedPriority={field.value}
                  setPriority={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BUG">Bug</SelectItem>
                  <SelectItem value="FEATURE">Feature</SelectItem>
                  <SelectItem value="TASK">Tarefa</SelectItem>
                  <SelectItem value="IMPROVEMENT">Melhoria</SelectItem>
                  <SelectItem value="RESEARCH">Pesquisa</SelectItem>
                  <SelectItem value="SPIKE">Spike</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Vencimento</FormLabel>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal mt-1",
                    !field.value && "text-muted-foreground"
                  )}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Escolha uma data</span>
                  )}
                </Button>

                {isCalendarOpen && (
                  <div className="absolute top-full left-0 z-50 mt-2 bg-white rounded-md shadow-lg p-4 border border-gray-200">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) =>
                        handleDateSelect(date, field.onChange)
                      }
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="milestoneId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Milestone (opcional)</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um milestone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {milestones && milestones.length > 0 ? (
                    milestones.map((milestone) => (
                      <SelectItem
                        key={milestone.id}
                        value={milestone.id.toString()}
                      >
                        {milestone.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="0" disabled>
                      Nenhum milestone disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-1 justify-end mt-6">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Cancelar
          </Button>
          <Button className="ml-5 px-5" type="submit">
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
};
