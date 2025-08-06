import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { logout } from "@/state/Auth/authSlice";
import { UserAvatar } from "@/components/user/UserAvatar";
import { EditProfileForm } from "@/components/user/EditProfileForm";
import { CreateProjectForm } from "@/components/create-project/CreateProjectForm";
import { CreateTagForm } from "@/components/create-project/CreateTagForm";
import { CreateCategoryForm } from "@/components/create-project/CreateCategoryForm";

export const NavBar = () => {
  const auth = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [isCreateProjectFormOpen, setIsCreateProjectFormOpen] = useState(false);
  const [isCreateTagFormOpen, setIsCreateTagFormOpen] = useState(false);
  const [isCreateCategoryFormOpen, setIsCreateCategoryFormOpen] =
    useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleOpenNestedForm = (formType) => {
    setIsMainDialogOpen(false);
    if (formType === "project") {
      setIsCreateProjectFormOpen(true);
    } else if (formType === "tag") {
      setIsCreateTagFormOpen(true);
    } else if (formType === "category") {
      setIsCreateCategoryFormOpen(true);
    }
  };

  const handleCloseNestedForm = (formType) => {
    if (formType === "project") {
      setIsCreateProjectFormOpen(false);
    } else if (formType === "tag") {
      setIsCreateTagFormOpen(false);
    } else if (formType === "category") {
      setIsCreateCategoryFormOpen(false);
    }
    setIsMainDialogOpen(true);
  };

  return (
    <div className="border-b py-4 px-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <p onClick={() => navigate("/")} className="cursor-pointer font-bold">
          Gerenciamento de Projetos
        </p>

        <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost">Adicionar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Button
                onClick={() => handleOpenNestedForm("project")}
                className="w-full"
              >
                Criar Projeto
              </Button>
              <Button
                onClick={() => handleOpenNestedForm("tag")}
                className="w-full"
              >
                Criar Tag
              </Button>
              <Button
                onClick={() => handleOpenNestedForm("category")}
                className="w-full"
              >
                Criar Categoria
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="ghost" onClick={() => navigate("/tags")}>
          Gerenciar Tags
        </Button>
        <Button variant="ghost" onClick={() => navigate("/categories")}>
          Gerenciar Categorias
        </Button>
      </div>

      <div className="flex gap-1 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-black/5 p-1 rounded-sm">
              <UserAvatar user={auth.user} size="sm" />
              <p>{auth.user?.fullName}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
              Editar Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Deslogar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog
        open={isCreateProjectFormOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseNestedForm("project");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <CreateProjectForm
              onSuccess={() => handleCloseNestedForm("project")}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateTagFormOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseNestedForm("tag");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Tag</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <CreateTagForm onSuccess={() => handleCloseNestedForm("tag")} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateCategoryFormOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseNestedForm("category");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Categoria</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <CreateCategoryForm
              onSuccess={() => handleCloseNestedForm("category")}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          <EditProfileForm onClose={() => setProfileDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
