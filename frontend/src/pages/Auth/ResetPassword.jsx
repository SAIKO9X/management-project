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
import { useSearchParams, useNavigate } from "react-router-dom";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty("A senha é obrigatória")
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().nonempty("Confirme a senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [message, setMessage] = useState(null);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/reset-password", null, {
        params: { token, newPassword: data.newPassword },
      });
      setMessage({ text: response.data.message, success: true });
      setTimeout(() => navigate("/"), 2000); // Redireciona para login após 2 segundos
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Erro ao redefinir a senha",
        success: false,
      });
    }
  };

  if (!token)
    return (
      <div>
        Token inválido. Por favor, solicite um novo email de redefinição.
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[25rem]">
        <h1 className="text-center font-bold mb-5">Redefinir Senha</h1>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Digite sua nova senha"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirme sua nova senha"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Redefinir Senha
            </Button>
            {message && (
              <p
                className={message.success ? "text-green-500" : "text-red-500"}
              >
                {message.text}
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};
