import { useDispatch } from "react-redux";
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
import { createCategory } from "@/state/Project/projectSlice";
import { useNotify } from "@/utils/notify";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "A categoria deve ter pelo menos 2 caracteres." }),
});

export const CreateCategoryForm = () => {
  const dispatch = useDispatch();
  const notify = useNotify();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(createCategory({ name: data.name })).unwrap();
      notify({
        type: "success",
        message: "Categoria criada com sucesso!",
        description: `A categoria "${data.name}" foi adicionada.`,
      });
      form.reset();
    } catch (error) {
      notify({
        type: "error",
        message: "Erro ao criar categoria",
        description: error || "Ocorreu um erro ao tentar criar a categoria.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Categoria</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome da Categoria"
                  className="border w-full border-gray-700 py-5 px-5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Criar Categoria
        </Button>
      </form>
    </Form>
  );
};
