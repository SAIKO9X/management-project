import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const CircularProgress = ({ percentage }) => {
  const primaryColor = "#000000";

  return (
    <CircularProgressbar
      className="size-52 my-10 mx-auto"
      value={percentage}
      text={`${Math.round(percentage)}%`}
      styles={{
        path: {
          stroke: primaryColor,
          strokeLinecap: "round",
          transition: "stroke-dashoffset 0.5s ease 0s",
        },
        trail: {
          stroke: "#d6d6d6",
          strokeLinecap: "round",
        },
        text: {
          fill: primaryColor,
          fontSize: "1.25rem",
          dominantBaseline: "middle",
          textAnchor: "middle",
          fontWeight: "bold",
        },
      }}
    />
  );
};
