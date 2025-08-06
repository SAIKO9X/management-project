import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import * as z from "zod";
import api from "@/config/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftToLine } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email("Digite um email válido"),
});

export const ForgotPassword = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", null, {
        params: { email: data.email },
      });
      setMessage({ text: response.data.message, success: true });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Erro ao enviar o email",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative">
      <div className="w-[25rem]">
        <h1 className="text-center font-bold mb-5">Redefinir Senha</h1>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Digite seu email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Email de Redefinição"
              )}
            </Button>
            {message && (
              <p
                className={
                  message.success
                    ? "text-green-500 bg-green-100 p-2 rounded-sm border border-green-400"
                    : "text-red-500 bg-red-100 p-2 rounded-sm border border-red-400"
                }
              >
                {message.text}
              </p>
            )}
          </form>
        </Form>
      </div>
      <Button
        className="absolute top-2 left-2 w-32 cursor-pointer flex items-center justify-center"
        onClick={() => navigate("/")}
      >
        <ArrowLeftToLine />
        VOLTAR
      </Button>
    </div>
  );
};
