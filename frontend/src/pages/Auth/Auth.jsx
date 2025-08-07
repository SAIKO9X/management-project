import { useState, useEffect } from "react"; // Importar useEffect
import { useDispatch } from "react-redux"; // Importar useDispatch
import { Login } from "./Login";
import { Register } from "./Register";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { BriefcaseBusiness } from "lucide-react";
import { clearErrors } from "@/state/Auth/authSlice"; // Importar a ação

export const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const dispatch = useDispatch();

  // Limpa os erros de autenticação ao carregar a página
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="flex min-h-screen">
      {/* Coluna Esquerda (Visual) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 dark:bg-zinc-900 items-center justify-center p-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <BriefcaseBusiness className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Bem-vindo ao Gestor de Projetos
          </h1>
          <p className="text-muted-foreground">
            Organize as suas tarefas, colabore com a sua equipa e atinja os seus
            objetivos.
          </p>
        </div>
      </div>

      {/* Coluna Direita (Formulário) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md p-8 border-0 shadow-none lg:border lg:shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? "register" : "login"}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {isRegister ? <Register /> : <Login />}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2 items-center justify-center mt-6 text-sm">
            <span>
              {isRegister ? "Já tem uma conta?" : "Ainda não tem uma conta?"}
            </span>
            <p
              className="font-semibold text-primary cursor-pointer hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Entrar" : "Criar uma conta"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
