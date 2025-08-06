import React, { createContext, useContext, useState, useCallback } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
};

const classes = {
  success: "border-green-500 bg-green-50 text-green-800",
  error: "border-red-500 bg-red-50 text-red-800",
  info: "border-blue-500 bg-blue-50 text-blue-800",
  warning: "border-yellow-500 bg-yellow-50 text-yellow-800",
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const notify = useCallback(
    ({ type = "success", message, description = "", duration = 3000 }) => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, type, message, description }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    },
    []
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 space-y-3">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert className={`border ${classes[n.type]} w-80 shadow-lg`}>
                {icons[n.type]}
                <AlertTitle>{n.message}</AlertTitle>
                {n.description && (
                  <AlertDescription>{n.description}</AlertDescription>
                )}
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
