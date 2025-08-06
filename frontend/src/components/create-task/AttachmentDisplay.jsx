import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileIcon,
  Trash2,
  Download,
  Image,
  FileText,
  FileArchive,
  File,
} from "lucide-react";
import {
  fetchAttachments,
  deleteAttachment,
} from "@/state/Attachment/attachmentSlice";
import { AttachmentUpload } from "@/components/create-task/AttachmentUpload";
import api from "@/config/api";

export const AttachmentDisplay = ({ issueId }) => {
  const dispatch = useDispatch();
  const { attachments, loading, error } = useSelector(
    (state) => state.attachment
  );

  useEffect(() => {
    if (issueId) {
      dispatch(fetchAttachments(issueId));
    }
  }, [dispatch, issueId]);

  const handleDownload = async (attachmentId, fileName) => {
    try {
      const response = await api.get(
        `/api/attachments/download/${attachmentId}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao baixar anexo:", err);
    }
  };

  const handleDelete = (attachmentId) => {
    dispatch(deleteAttachment(attachmentId));
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <File />;

    const extension = fileName.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <Image />;
    } else if (["pdf", "doc", "docx", "txt", "md"].includes(extension)) {
      return <FileText />;
    } else if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
      return <FileArchive />;
    } else {
      return <FileIcon />;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Anexos</h2>
        <AttachmentUpload issueId={issueId} />
      </div>

      {error && <div className="text-red-500 py-4">Erro: {error}</div>}

      {loading ? (
        <div className="flex justify-center py-4">Carregando anexos...</div>
      ) : attachments?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {attachments.map((attachment) => (
            <Card key={attachment.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(attachment.fileName)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium truncate">
                      {attachment.fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(attachment.uploadDate).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDownload(attachment.id, attachment.fileName)
                      }
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(attachment.id)}
                      title="Deletar"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          Nenhum anexo encontrado.
        </div>
      )}
    </div>
  );
};
