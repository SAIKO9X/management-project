import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { TaskName } from "./TaskName";
import { TaskDescription } from "./TaskDescription";
import { PriorityList } from "./PriorityList";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createIssue, fetchIssues } from "@/state/Issue/issueSlice";
import { fetchMilestones } from "@/state/Milestone/milestoneSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";

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

const setTimeToDate = (date, timeString) => {
  if (!date || !timeString) return date;

  const [hours, minutes] = timeString.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours || 0);
  newDate.setMinutes(minutes || 0);
  return newDate;
};

export const TaskDialog = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [timeValue, setTimeValue] = useState("12:00");
  const milestones = useSelector((state) => state.milestone.milestones);

  useEffect(() => {
    console.log("Fetching milestones for project ID:", id);
    dispatch(fetchMilestones(id));
  }, [dispatch, id]);

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "BAIXA",
      type: "TASK",
      dueDate: null,
      milestoneId: null,
    },
  });

  // Set initial time value if there's a due date
  useEffect(() => {
    const dueDate = form.getValues("dueDate");
    if (dueDate) {
      setTimeValue(
        `${dueDate.getHours().toString().padStart(2, "0")}:${dueDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );
    }
  }, [form.getValues("dueDate")]);

  const onSubmit = async (data) => {
    // Combine date and time
    let finalDueDate = null;
    if (data.dueDate) {
      finalDueDate = setTimeToDate(data.dueDate, timeValue);
    }

    const newTask = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      type: data.type,
      projectId: id,
      status: "A_FAZER",
      dueDate: finalDueDate ? finalDueDate.toISOString() : null,
      milestoneId: data.milestoneId || null,
    };

    await dispatch(createIssue(newTask)).unwrap();
    dispatch(fetchIssues(id));
    form.reset();
    setTimeValue("12:00");
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    form.reset();
    setTimeValue("12:00");
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="px-5 cursor-pointer">Adicionar Nova Task</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nova Task</DialogTitle>
          <div>Preencha o formulário abaixo para criar uma nova task</div>
          <Separator className="mt-4" />
        </DialogHeader>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                  <FormLabel>Data e Hora de Vencimento</FormLabel>
                  <div className="flex gap-2">
                    <div className="w-1/2 relative">
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                      </Button>
                      {isCalendarOpen && (
                        <div className="absolute top-full left-0 z-50 mt-2 bg-white rounded-md shadow-lg p-4 border border-gray-200">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setIsCalendarOpen(false);
                            }}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="time"
                        value={timeValue}
                        onChange={(e) => setTimeValue(e.target.value)}
                        className="pl-10 w-32"
                        disabled={!field.value}
                      />
                    </div>
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
                  <FormLabel>Milestone</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? null : Number(value))
                    }
                    value={field.value ? field.value.toString() : "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um milestone (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
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
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button className="ml-5 px-5" type="submit">
                Criar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
