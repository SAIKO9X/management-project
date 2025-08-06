import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  fetchMilestones,
  createMilestone,
  deleteMilestone,
} from "@/state/Milestone/milestoneSlice";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

const milestoneSchema = z.object({
  name: z.string().min(1, "O nome da sprint é obrigatório"),
  description: z.string().optional(),
  endDate: z.date().nullable().optional(),
  status: z.enum(["PLANEJADO", "EM_ANDAMENTO", "CONCLUIDO"], {
    errorMap: () => ({ message: "Selecione um status válido" }),
  }),
});

export const MilestoneManagement = () => {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const { milestones, loading } = useSelector((state) => state.milestone);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dueDate, setDueDate] = useState(null);

  const form = useForm({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      name: "",
      description: "",
      endDate: null,
      status: "PLANEJADO",
    },
  });

  useEffect(() => {
    form.setValue("endDate", dueDate);
  }, [dueDate, form]);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchMilestones(projectId));
    }
  }, [dispatch, projectId]);

  const handleCreateMilestone = async (data) => {
    const milestoneData = {
      name: data.name,
      description: data.description,
      startDate: new Date().toISOString().split("T")[0],
      endDate: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      status: data.status,
      projectId: Number(projectId),
    };

    try {
      await dispatch(createMilestone(milestoneData)).unwrap();
      dispatch(fetchMilestones(projectId));
      form.reset();
      setDueDate(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao criar milestone:", error);
    }
  };

  const handleDeleteMilestone = async (id) => {
    try {
      await dispatch(deleteMilestone(id)).unwrap();
      dispatch(fetchMilestones(projectId));
    } catch (error) {
      console.error("Erro ao deletar milestone:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Sem data definida";
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gerenciar Sprints</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nova Sprint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Criar Nova Milestone
              </DialogTitle>
              <DialogDescription>
                Preencha os detalhes da sua nova sprint, incluindo nome,
                descrição e data de vencimento.
              </DialogDescription>
              <Separator className="my-4" />
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateMilestone)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name">Nome</Label>
                      <FormControl>
                        <Input
                          id="name"
                          {...field}
                          placeholder="Ex: Lançamento da Versão 1.0"
                        />
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
                      <Label htmlFor="description">Descrição</Label>
                      <FormControl>
                        <Textarea
                          id="description"
                          {...field}
                          placeholder="Ex: Finalizar e revisar o backend completo..."
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className="flex flex-col">
                  <Label>Data de Vencimento</Label>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? (
                        format(dueDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                    </Button>
                    {isCalendarOpen && (
                      <div className="absolute z-50 mt-2 bg-white rounded-md shadow-lg p-4 border">
                        <Calendar
                          mode="single"
                          selected={dueDate}
                          onSelect={(date) => {
                            setDueDate(date);
                            setIsCalendarOpen(false);
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          locale={ptBR}
                        />
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Status</Label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PLANEJADO">Planejado</SelectItem>
                          <SelectItem value="EM_ANDAMENTO">
                            Em Andamento
                          </SelectItem>
                          <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Criar</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm text-muted-foreground mb-6 max-w-2xl text-justify">
        <strong>O que é uma Sprint?</strong>
        <br />
        Sprints (ou marcos) são pontos importantes no seu projeto que ajudam a
        organizar e acompanhar o progresso. No contexto do sistema, uma sprint
        está associada a um projeto e pode conter várias (tasks). Exemplos
        incluem: “Lançamento da Versão 1.0”, “Testes Concluídos”.
      </p>

      {loading ? (
        <div className="flex justify-center py-8">Carregando milestones...</div>
      ) : milestones?.length > 0 ? (
        <ScrollArea className="h-[400px] w-full">
          <div className="grid grid-cols-1 gap-4 pr-4">
            {milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{milestone.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {milestone.description || "Sem descrição"}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(milestone.endDate)}</span>
                  </div>
                  <p className="text-sm mt-2">Status: {milestone.status}</p>

                  <div className="mt-4 flex items-center gap-4">
                    <div style={{ width: 60, height: 60 }}>
                      <CircularProgressbar
                        value={milestone.completionPercentage || 0}
                        text={`${Math.round(
                          milestone.completionPercentage || 0
                        )}%`}
                        styles={{
                          path: { stroke: `hsl(var(--primary))` },
                          trail: { stroke: "#d6d6d6" },
                          text: {
                            fill: `hsl(var(--foreground))`,
                            fontSize: "18px",
                          },
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Progresso:</p>
                      <p className="text-xs text-muted-foreground">
                        {milestone.completedIssues || 0} de{" "}
                        {milestone.totalIssues || 0} tasks concluídas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-2">
          Nenhuma sprint encontrada. Crie uma nova para começar!
        </div>
      )}
    </div>
  );
};
