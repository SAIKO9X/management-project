import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createComment } from "@/state/Comment/commentsSlice";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux"; // Importar useSelector

export const CreateCommentForm = ({ issueId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Aceder ao utilizador autenticado

  const form = useForm({
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data) => {
    const issueIdNumber = parseInt(issueId, 10);
    if (isNaN(issueIdNumber) || !user) {
      // Verificar se o utilizador existe
      console.error("Invalid issueId or user not found:", issueId, user);
      return;
    }

    // Incluir o userId no payload
    dispatch(
      createComment({
        content: data.content,
        issueId: issueIdNumber,
        userId: user.id,
      })
    );
    form.reset(); // Limpar o formulário após o envio
  };

  return (
    <Form {...form}>
      <form
        className="flex gap-2 items-center"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-2 items-center">
                <div>
                  <Avatar>
                    {/* Pode usar a inicial do utilizador autenticado */}
                    <AvatarFallback>{user?.fullName[0] || "U"}</AvatarFallback>
                  </Avatar>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="w-[20rem]"
                    placeholder="adicione um comentário"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">enviar</Button>
      </form>
    </Form>
  );
};
