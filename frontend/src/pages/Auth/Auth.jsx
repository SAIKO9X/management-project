import { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";
import { Card } from "@/components/ui/card";

export const Auth = () => {
  const [active, setActive] = useState(true);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="box h-[30rem] w-[25rem]">
        <Card className="p-5 shadow-[#1b1b1b] shadow-2xl">
          <div className="w-full px-10 space-y-5">
            {active ? <Register /> : <Login />}

            <div className="flex gap-2 items-center justify-center">
              <span>
                {active ? "Já tem uma conta ?" : "Ainda não tem uma conta ?"}
              </span>
              <p
                className="cursor-pointer underline hover:text-zinc-500 transition"
                onClick={() => setActive(!active)}
              >
                {active ? "entrar" : "cadastrar"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
