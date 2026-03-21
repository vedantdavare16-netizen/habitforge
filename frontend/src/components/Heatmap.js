import { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip"; 

function Heatmap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:5000/api/habits/heatmap", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const result = await res.json();
      console.log(result);

      setData(
        result.map(item => ({
          ...item,
        }))
      );
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        🔥 Activity Heatmap
      </h2>

      <CalendarHeatmap
        startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
        endDate={new Date()}
        values={data}
        valueAccessor={(value) => value.count}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count >= 3) return "color-strong";
          if (value.count >= 1) return "color-medium";
          return "color-light";
        }}
        tooltipDataAttrs={(value) => {
          if (!value || !value.date) return {};
          return {
            "data-tooltip-content": `${value.date} — ${value.count} completions`, // ✅ small update for new version
          };
        }}
      />

      <Tooltip /> 

      <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
        <span>Less</span>
        <div className="w-4 h-4 bg-[#ebedf0]"></div>
        <div className="w-4 h-4 bg-[#9be9a8]"></div>
        <div className="w-4 h-4 bg-[#40c463]"></div>
        <div className="w-4 h-4 bg-[#216e39]"></div>
        <span>More</span>
      </div>
    </div>
  );
}

export default Heatmap;