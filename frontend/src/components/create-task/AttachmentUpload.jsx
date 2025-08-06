import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { uploadAttachment } from "@/state/Attachment/attachmentSlice";

export const AttachmentUpload = ({ issueId }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      await dispatch(uploadAttachment({ file, issueId })).unwrap();
      setFile(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
    </div>
  );
};
