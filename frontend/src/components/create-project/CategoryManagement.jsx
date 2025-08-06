import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserCategories,
  updateCategory,
  deleteCategory,
} from "@/state/Project/projectSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, X } from "lucide-react";
import { useNotify } from "@/utils/notify";

export const CategoryManagement = () => {
  const dispatch = useDispatch();
  const [editingCategory, setEditingCategory] = useState(null);
  const [newName, setNewName] = useState("");
  const notify = useNotify();
  const { userCategories, loading, error } = useSelector(
    (store) => store.project
  );

  useEffect(() => {
    dispatch(fetchUserCategories());
  }, [dispatch]);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewName(category.name);
  };

  const handleSave = async () => {
    if (editingCategory) {
      await dispatch(
        updateCategory({ id: editingCategory.id, name: newName })
      ).unwrap();
      setEditingCategory(null);
      setNewName("");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta categoria?")) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        notify({
          type: "success",
          message: "Categoria deletada com sucesso!",
        });
      } catch (error) {
        notify({
          type: "error",
          message: "Erro ao deletar categoria",
          description:
            error || "Ocorreu um erro ao tentar deletar a categoria.",
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-5">
      <CardHeader>
        <CardTitle>Gerenciar Categorias</CardTitle>
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
          {userCategories.map((category) => (
            <li key={category.id} className="flex items-center gap-3">
              {editingCategory?.id === category.id ? (
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
                    onClick={() => setEditingCategory(null)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1">{category.name}</span>
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(category)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
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
