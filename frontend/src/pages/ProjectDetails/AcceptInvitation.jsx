import { Button } from "@/components/ui/button";
import { acceptInvitation } from "@/state/Project/projectSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export const AcceptInvitation = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAcceptInvitation = () => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    if (token) {
      dispatch(acceptInvitation({ token })).then((action) => {
        if (action.type === "projects/acceptInvite/fulfilled") {
          const projectId = action.payload.projectId;
          navigate(`/project/${projectId}`);
        } else {
          console.error("Erro ao aceitar o convite:", action.payload);
        }
      });
    } else {
      console.error("Token de convite não encontrado na URL.");
    }
  };

  return (
    <div className="h-[85vh] flex flex-col justify-center items-center">
      <h1 className="py-5 font-semibold text-xl">
        Você foi convidado para fazer parte do projeto
      </h1>
      <Button onClick={handleAcceptInvitation}>Aceitar Convite</Button>
    </div>
  );
};
