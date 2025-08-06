import { Separator } from "../ui/separator";

export const TasksStats = ({ stats }) => {
  const statisticCard = [
    { label: "Total de Tasks", value: stats.totalTasks },
    { label: "A Fazer", value: stats.toDoTasks },
    { label: "Em Progresso", value: stats.inProgressTasks },
    { label: "Concluido", value: stats.completedTasks },
  ];

  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold text-xl">Tasks</span>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {statisticCard.map((statistic) => (
          <SingleCard key={statistic.label} statCard={statistic} />
        ))}
      </div>
    </div>
  );
};

function SingleCard({ statCard }) {
  return (
    <div className="p-3 bg-zinc-100 rounded-xl">
      <span className="text-zinc-600 text-xs">
        {statCard.label.toUpperCase()}
      </span>
      <div className="flex gap-2 mt-1 items-center">
        <Separator orientation="vertical" className="!h-4 !w-1 bg-primary" />
        <span className="font-bold text-lg">{statCard.value}</span>
      </div>
    </div>
  );
}
