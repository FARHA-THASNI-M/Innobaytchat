import { SmallDashOutlined } from "@ant-design/icons";
import { Card, Col, Row, Space, List, Button, Dropdown } from "antd";
import React from "react";
import Chart from "react-apexcharts";
import { getItem } from "../../../services";

const TaskCompletionChart = ({ taskCompletion, downloadGraph }) => {
  const series = [
    {
      data: Object.values(taskCompletion),
    },
  ];
  const options = {
    chart: {
      id: "task-completion",
      type: "line",
      height: 350,
      stacked: false,
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },

    xaxis: {
      categories: Object.keys(taskCompletion),
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        endingShape: "rounded",
      },
    },
    legend: {
      show: false,
    },
  };

  return (
    <Card
      id="task-completion"
      title="Task Completion"
      extra={
        <Space>
          <Dropdown
            menu={{
              items: [
                getItem(
                  "3",
                  <Button
                    type="button"
                    onClick={(e) => {
                      downloadGraph("task-completion");
                    }}
                  >
                    Download
                  </Button>
                ),
              ],
            }}
            placement="bottom"
            trigger={"click"}
          >
            <Button
              type="text"
              style={{
                float: "right",
              }}
            >
              <SmallDashOutlined />
            </Button>
          </Dropdown>
        </Space>
      }
      bordered={true}
    >
      <Chart options={options} series={series} type="line" height={300} />
    </Card>
  );
};

export default TaskCompletionChart;
