import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { assignRole } from "@/state/Roles/projectRolesSlice";
import { UserAvatar } from "./UserAvatar";
import { fetchProjectById } from "@/state/Project/projectSlice";
import { useNotify } from "@/utils/notify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RoleManagement = ({ projectId }) => {
  const dispatch = useDispatch();
  const notify = useNotify();
  const project = useSelector((state) => state.project.selectedProject);
  const { loading, error } = useSelector((state) => state.projectRoles);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(assignRole({ projectId, userId, role: newRole })).unwrap();

      dispatch(fetchProjectById(projectId));

      notify({
        type: "success",
        message: "Cargo atualizado com sucesso!",
      });
    } catch (err) {
      notify({
        type: "error",
        message: "Erro ao atualizar cargo",
        description: err || "Não foi possível atualizar o cargo do membro.",
      });
    }
  };

  if (!project || project.id !== parseInt(projectId)) {
    return <div>Carregando detalhes do projeto...</div>;
  }

  const getRoleForUser = (userId) => {
    const roleInfo = project.roles.find(
      (role) => role.user && role.user.id === userId
    );
    return roleInfo ? roleInfo.role : "MEMBER";
  };

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Gerenciar Cargos da Equipa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        {project.team.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <UserAvatar user={member} size="md" />
              <div>
                <p className="font-semibold">{member.fullName}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>

            {project.owner.id === member.id ? (
              <span className="text-sm font-medium text-gray-500">
                Dono do Projeto
              </span>
            ) : (
              <Select
                value={getRoleForUser(member.id)}
                onValueChange={(newRole) =>
                  handleRoleChange(member.id, newRole)
                }
                disabled={loading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
