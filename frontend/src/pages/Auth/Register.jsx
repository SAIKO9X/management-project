import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormMessage,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { register } from "@/state/Auth/authSlice";
import * as z from "zod";

const registerSchema = z.object({
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email("Digite um email válido"),
  password: z
    .string()
    .nonempty("A senha é obrigatória")
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
  fullName: z
    .string()
    .nonempty("O nome completo é obrigatório")
    .min(3, "O nome deve ter no mínimo 3 caracteres"),
});

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, jwt } = useSelector((state) => state.auth);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  const onSubmit = (data) => {
    setSubmitted(true);
    dispatch(register(data));
  };

  useEffect(() => {
    if (jwt) {
      navigate("/");
    }
  }, [jwt, navigate]);

  return (
    <div className="space-y-5">
      <h1 className="text-center font-bold">Crie uma conta</h1>
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
                    type="email"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="Email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="Senha"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="Nome Completo"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar Conta"}
          </Button>
          {submitted && error && (
            <p className="text-red-500">
              Erro: {error.message || "Erro ao registrar"}
            </p>
          )}
          {submitted && jwt && (
            <p className="text-green-500">
              Conta criada com sucesso! Redirecionando...
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};
