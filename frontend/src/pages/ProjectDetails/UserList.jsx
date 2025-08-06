import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { assignUserToIssue } from "@/state/Issue/issueSlice";
import { useDispatch, useSelector } from "react-redux";

export const UserList = ({ issueDetails }) => {
  const { project } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleAssignIssueToUser = (userId) => {
    dispatch(assignUserToIssue({ issueId: issueDetails.id, userId }));
  };

  return (
    <>
      <div className="space-y-2">
        <div className="border rounded-md">
          <p className="py-2 px-3 text-center">
            {issueDetails.assignee?.fullName || "não atribuído"}
          </p>
        </div>
        {project.projectDetails.team.map((item) => (
          <div
            key={item.id}
            onClick={() => handleAssignIssueToUser(item.id)}
            className="py-2 group hover:bg-zinc-600 cursor-pointer flex items-center space-x-4 rounded-md border px-4"
          >
            <Avatar>
              <AvatarFallback>{item.fullName[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm leading-none">{item.fullName}</p>
              <p className="text-sm text-muted-foreground">
                @{item.fullName.replace(/\s+/g, "").toLowerCase()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
