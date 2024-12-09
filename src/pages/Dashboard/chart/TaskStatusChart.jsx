import { SmallDashOutlined } from "@ant-design/icons";
import { Button, Card, Col, Dropdown, Row, Space } from "antd";
import React from "react";
import Chart from "react-apexcharts";
import { formatStatusText } from "../../../components/common/service";
import { getItem } from "../../../services";

const TaskStatus = ({ taskStatus, downloadGraph }) => {
  const data = [
    { label: "In Progress", percentage: 3, color: "#08A0F7" },
    { label: "Completed", percentage: 12, color: "#34A770" },
    { label: "Closed", percentage: 15, color: "#5F5F5F" },
    { label: "Reopen", percentage: 2, color: "#D63384" },
    { label: "Not Started", percentage: 7, color: "#FBA63C" },
    { label: "Delayed", percentage: 5, color: "#F85640" },
    // { label: "On Hold", percentage: 1, color: "#6F42C1" },
  ];
console.log(Object.values(taskStatus).length)
  const series = [
    {
      data: Object.values(taskStatus),
    },
  ];

  const options = {
    chart: {
      id: "task-status",
      type: "bar",
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        endingShape: "rounded",
        distributed: true,
      },
    },
    colors: data.map((item) => item.color),
    legend: {
      show: false,
    },
    xaxis: {
      categories: Object.keys(taskStatus).map((item) => formatStatusText(item)),
    },
  };

  return (
    <Card id="task-status">
      <Row gutter={16}>
        <Col span={18}>
          <Card
            title="Task Status"
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
                            downloadGraph("task-status");
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
            bordered={false}
            style={{
              boxShadow: "none",
              borderRight: "1px solid",
              borderRadius: 0,
            }}
          >
            <Chart options={options} series={series} type="bar" height={250} />
          </Card>
        </Col>
        <Col
          span={6}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {data?.map((data, index) => (
            <p
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                margin: "3px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    height: "10px",
                    width: "10px",
                    background: data.color,
                    borderRadius: "50%",
                  }}
                ></div>
                {data.label}
              </div>
            </p>
          ))}
        </Col>
      </Row>
    </Card>
  );
};

export default TaskStatus;
