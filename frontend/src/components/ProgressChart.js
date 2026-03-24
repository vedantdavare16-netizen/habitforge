import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ProgressChart({ habits }) {
  const data = {
    labels: habits.map((h) => h.name),
    datasets: [
      {
        label: "Completion Count",
        data: habits.map((h) => {
  const today = new Date().toISOString().split("T")[0];

  const lastDate = h.lastCompletedDate
    ? new Date(h.lastCompletedDate).toISOString().split("T")[0]
    : null;

  return lastDate === today ? 1 : 0;
}),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="text-lg font-bold mb-2">Progress Chart</h2>
      <Bar data={data} />
    </div>
  );
}

export default ProgressChart;