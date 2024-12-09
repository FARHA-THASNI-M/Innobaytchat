import { SmallDashOutlined } from "@ant-design/icons";
import { Card, Col, Row, Space, List, Button, Dropdown } from "antd";
import React from "react";
import Chart from "react-apexcharts";
import { getItem } from "../../../services";

const ProjectStatusChart = ({ projectStatus, downloadGraph }) => {
  const data = [
    {
      labels: "Completed",
      value: projectStatus["COMPLETE"] || 0,
      color: "#34A770",
    },
    {
      labels: "In Progress",
      value: projectStatus["IN_PROGRESS"] || 0,
      color: "#08A0F7",
    },
    {
      labels: "Not Started",
      value: projectStatus["NOT_STARTED"] || 0,
      color: "#FBA63C",
    },
    {
      labels: "Delayed",
      value: projectStatus["NOT_COMPLTED"] || 0,
      color: "#F85640",
    },
    {
      labels: "Closed",
      value: projectStatus["CLOSED"] || 0,
      color: "#5F5F5F",
    },
    {
      labels: "Reopen",
      value: projectStatus["REOPEN"] || 0,
      color: "#D63384",
    },
    {
      labels: "On Hold",
      value: projectStatus["ON_HOLD"] || 0,
      color: "#6F42C1",
    },
  ];

  const series = data.map((data) => data.value);
  const options = {
    chart: {
      id: "progress-status-chart",
      toolbar: {
        show: true,
        tools: {
          download: false,
        },
      },
    },
    labels: data.map((data) => data.labels),
    title: {},
    noData: {
      text: "No data available for the chart",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "red",
        fontSize: "16px",
        fontFamily: "Arial",
      },
    },
    colors: data.map((data) => data.color),
    legend: {
      show: false, // Hide legends
    },
    dataLabels: {
      enabled: false, // Hide percentage labels
    },
  };

  return (
    <Card
      id="project-status"
      title="Project Status"
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
                      downloadGraph("project-status");
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
      <Row gutter={28}>
        <Col
          span={12}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Chart options={options} series={series} type="pie" width={280} />
        </Col>
        <Col span={12} style={{ marginTop: "24px", marginBottom: "24px" }}>
          {data?.map((data, index) => (
            <p
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                // width: "170px",
                justifyContent: "space-between",
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
                {data.labels}
              </div>
              <div style={{ fontWeight: 900 }}>{data.value}</div>
            </p>
          ))}
        </Col>
      </Row>
    </Card>
  );
};

export default ProjectStatusChart;
