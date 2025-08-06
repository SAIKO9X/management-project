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
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { login } from "@/state/Auth/authSlice";
import * as z from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email("Digite um email válido"),
  password: z
    .string()
    .nonempty("A senha é obrigatória")
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data) => {
    setSubmitted(true);
    dispatch(login(data));
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="space-y-5">
      <h1 className="text-center font-bold">Entre na sua conta</h1>
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
          <div className="flex justify-between items-center">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <Link
              to="/forgot-password"
              className="hover:underline font-semibold text-sm uppercase"
            >
              Esqueci minha senha
            </Link>
          </div>
          {submitted && error && (
            <p className="text-red-500">
              Erro: {error.message || "Email ou senha inválidos"}
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};
