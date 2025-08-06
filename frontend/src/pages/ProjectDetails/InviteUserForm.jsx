import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormMessage,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { inviteToProject } from "@/state/Project/projectSlice";
import { useNotify } from "@/utils/notify";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const InviteUserForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const notify = useNotify();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await dispatch(
        inviteToProject({ email: data.email, projectId: id })
      ).unwrap();
      notify({
        type: "success",
        message: "Convite enviado!",
        description: `O convite foi enviado para: ${data.email} participar do projeto.`,
      });
      form.reset();
      if (onClose) {
        onClose();
      }
    } catch (error) {
      notify({
        type: "error",
        message: "Erro ao enviar convite",
        description:
          error.message || "Ocorreu um erro ao tentar enviar o convite.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="email do parceiro"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              "Convidar Parceiro"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
