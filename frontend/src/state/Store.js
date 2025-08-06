import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/authSlice";
import projectReducer from "./Project/projectSlice";
import chatReducer from "./Chat/chatSlice";
import commentReducer from "./Comment/commentsSlice";
import issueReducer from "./Issue/issueSlice";
import milestoneReducer from "./Milestone/milestoneSlice";
import attachmentReducer from "./Attachment/attachmentSlice";
import projectRolesReducer from "./Roles/projectRolesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    chat: chatReducer,
    comment: commentReducer,
    issue: issueReducer,
    milestone: milestoneReducer,
    attachment: attachmentReducer,
    projectRoles: projectRolesReducer,
  },
});
