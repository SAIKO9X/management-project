import { useEffect } from "react";
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
import {
  createProject,
  fetchUserCategories,
  fetchUserTags,
} from "@/state/Project/projectSlice";
import { availableIcons } from "@/utils/availableIcons";
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

export const CreateProjectForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const project = useSelector((store) => store.project);
  const notify = useNotify();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "Em Progresso",
      icon: availableIcons[0].name,
      category: "",
      tags: [],
    },
  });

  useEffect(() => {
    dispatch(fetchUserTags());
    dispatch(fetchUserCategories());
  }, [dispatch]);

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
    try {
      await dispatch(createProject(projectData)).unwrap();
      notify({
        type: "success",
        message: "Projeto criado com sucesso!",
        description: `O projeto "${data.name}" foi adicionado.`,
      });
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      notify({
        type: "error",
        message: "Erro ao criar projeto",
        description: error || "Ocorreu um erro ao tentar criar o projeto.",
      });
    }
  };

  if (!project.userCategories || !project.userTags)
    return <div>Carregando categorias e tags...</div>;

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
                      <div className="flex items-center gap-2">
                        <iconObj.icon className="w-5 h-5" />
                        <span>{iconObj.name}</span>
                      </div>
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
                  {project.userCategories.map((cat) => (
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
                  {project.userTags.map((tag) => (
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
        <Button type="submit" className="w-full">
          Criar Projeto
        </Button>
      </form>
    </Form>
  );
};
