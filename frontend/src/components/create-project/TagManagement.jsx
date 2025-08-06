import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserTags,
  updateTag,
  deleteTag,
} from "@/state/Project/projectSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, X } from "lucide-react";
import { useNotify } from "@/utils/notify";

export const TagManagement = () => {
  const dispatch = useDispatch();
  const { userTags, loading, error } = useSelector((store) => store.project);
  const [editingTag, setEditingTag] = useState(null);
  const [newName, setNewName] = useState("");
  const notify = useNotify();

  useEffect(() => {
    dispatch(fetchUserTags());
  }, [dispatch]);

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setNewName(tag.name);
  };

  const handleSave = async () => {
    if (editingTag) {
      await dispatch(updateTag({ id: editingTag.id, name: newName })).unwrap();
      setEditingTag(null);
      setNewName("");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta tag?")) {
      try {
        await dispatch(deleteTag(id)).unwrap();
        notify({
          type: "success",
          message: "Tag deletada com sucesso!",
        });
      } catch (error) {
        notify({
          type: "error",
          message: "Erro ao deletar tag",
          description: error || "Ocorreu um erro ao tentar deletar a tag.",
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-5">
      <CardHeader>
        <CardTitle>Gerenciar Tags</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <ul className="space-y-4">
          {userTags.map((tag) => (
            <li key={tag.id} className="flex items-center gap-3">
              {editingTag?.id === tag.id ? (
                <>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-1/2"
                  />
                  <Button onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingTag(null)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1">{tag.name}</span>
                  <Button variant="outline" onClick={() => handleEdit(tag)}>
                    Editar
                  </Button>
                  <Button
                    className="bg-red-600/80 cursor-pointer hover:bg-red-700"
                    onClick={() => handleDelete(tag.id)}
                  >
                    Deletar
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
