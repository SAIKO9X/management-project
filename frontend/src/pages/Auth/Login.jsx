import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormMessage,
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { login } from "@/state/Auth/authSlice";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    formState: { isSubmitted },
  } = form;

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground mt-2">
          Insira os seus dados para aceder à sua conta.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="email@exemplo.com"
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
                <FormLabel>Senha</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    aria-label={
                      showPassword ? "Esconder senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Esqueceu a sua senha?
            </Link>
          </div>
          {isSubmitted && error && (
            <p className="text-red-500 text-sm text-center">
              {error.message || "Email ou senha inválidos"}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "A entrar..." : "Entrar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
