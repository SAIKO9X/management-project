import { Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { NavBar } from "./pages/NavBar/NavBar";
import { Auth } from "./pages/Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AcceptInvitation } from "./pages/ProjectDetails/AcceptInvitation";
import { getUser } from "./state/Auth/authSlice";
import { fetchProjects } from "./state/Project/projectSlice";
import { ProjectTabs } from "./pages/ProjectDetails/ProjectTabs";
import { IssueDetailsPage } from "./pages/IssueDetails/IssueDetailsPage";
import { ResetPassword } from "./pages/Auth/ResetPassword";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { TagManagement } from "./components/create-project/TagManagement";
import { CategoryManagement } from "./components/create-project/CategoryManagement";

export const App = () => {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        if (accessToken) {
          await dispatch(getUser()).unwrap();
          await dispatch(fetchProjects({}));
        }
      } catch (error) {
        console.error("Erro ao inicializar a aplicação:", error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initApp();
  }, [dispatch, accessToken]);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Carregando...
      </div>
    );
  }

  return (
    <>
      {user ? (
        <div>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectTabs />} />
            <Route
              path="/project/:projectId/issue/:issueId"
              element={<IssueDetailsPage />}
            />
            <Route path="/accept_invitation" element={<AcceptInvitation />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/tags" element={<TagManagement />} />
            <Route path="/categories" element={<CategoryManagement />} />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </>
  );
};
