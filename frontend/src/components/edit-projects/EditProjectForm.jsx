import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Cross1Icon } from "@radix-ui/react-icons";
import { availableIcons } from "@/utils/availableIcons";
import {
  fetchUserCategories,
  fetchUserTags,
  updateProject,
  fetchProjectById,
} from "@/state/Project/projectSlice";
import { useNotify } from "@/utils/notify";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  description: z.string().optional(),
  status: z.string().optional(),
  icon: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const EditProjectForm = ({ projectId, onSuccess }) => {
  const dispatch = useDispatch();
  const project = useSelector((store) => store.project.projectDetails);
  const userCategories = useSelector(
    (store) => store.project.userCategories || []
  );
  const userTags = useSelector((store) => store.project.userTags || []);
  const [isLoading, setIsLoading] = useState(true);
  const [formReady, setFormReady] = useState(false);
  const notify = useNotify();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "Em Progresso",
      icon: availableIcons[0]?.name || "",
      category: "",
      tags: [],
    },
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (projectId && !isNaN(projectId)) {
          await Promise.all([
            dispatch(fetchProjectById(projectId)),
            dispatch(fetchUserTags()),
            dispatch(fetchUserCategories()),
          ]);
        } else {
          console.error("ID do projeto inválido:", projectId);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, projectId]);

  useEffect(() => {
    if (!isLoading && project && project.id === parseInt(projectId)) {
      form.reset({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "Em Progresso",
        icon: project.icon || availableIcons[0]?.name || "",
        category: project.category?.name || "",
        tags: project.tags?.map((tag) => tag.name) || [],
      });
      setFormReady(true);
    }
  }, [project, projectId, form, isLoading]);

  const handleTagsChange = (newTag) => {
    const currentTags = form.getValues("tags") || [];
    if (currentTags.includes(newTag)) {
      form.setValue(
        "tags",
        currentTags.filter((tag) => tag !== newTag)
      );
    } else {
      form.setValue("tags", [...currentTags, newTag]);
    }
  };

  const onSubmit = async (data) => {
    const projectData = {
      name: data.name,
      description: data.description,
      status: data.status,
      icon: data.icon,
      category: data.category ? { name: data.category } : null,
      tags: data.tags.map((tag) => ({ name: tag })),
    };

    setIsLoading(true);
    try {
      await dispatch(updateProject({ projectId, projectData })).unwrap();
      notify({
        type: "success",
        message: "Projeto atualizado com sucesso!",
        description: `O projeto "${data.name}" foi atualizado.`,
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      notify({
        type: "error",
        message: "Erro ao atualizar projeto",
        description: error || "Ocorreu um erro ao tentar atualizar o projeto.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formReady) {
    return (
      <div className="py-4 text-center">Carregando dados do projeto...</div>
    );
  }

  if (!projectId || isNaN(projectId)) {
    return (
      <div className="text-red-500 py-4">
        ID do projeto inválido. Feche este diálogo e tente novamente.
      </div>
    );
  }

  if (!project || (project.id !== parseInt(projectId) && !isLoading)) {
    return (
      <div className="text-red-500 py-4">
        Projeto não encontrado. Tente novamente.
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Projeto</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome do projeto"
                  className="border w-full border-gray-700 py-5 px-5"
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
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Descrição do projeto"
                  className="border w-full border-gray-700 py-5 px-5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border w-full border-gray-700 py-5 px-5">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ícone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border w-full border-gray-700 py-5 px-5">
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableIcons.map((iconObj) => (
                    <SelectItem key={iconObj.name} value={iconObj.name}>
                      {iconObj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border w-full border-gray-700 py-5 px-5">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <Select onValueChange={handleTagsChange}>
                <FormControl>
                  <SelectTrigger className="border w-full border-gray-700 py-5 px-5">
                    <SelectValue placeholder="Selecione as tags" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.name}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 flex-wrap mt-2">
                {field.value.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleTagsChange(tag)}
                  >
                    {tag} <Cross1Icon className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Atualizando..." : "Atualizar Projeto"}
        </Button>
      </form>
    </Form>
  );
};
