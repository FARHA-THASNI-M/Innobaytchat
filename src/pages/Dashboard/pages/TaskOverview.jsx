import { Button, Card, DatePicker, Dropdown, Layout, Progress, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatStatusText } from "../../../components/common/service";
import { COMPANY, ROUTES } from "../../../constants";
import styles from "../../../styles/_dashboard.module.css";
import { getFormatDate, getFormatDateTime } from "../../../utils";
const { Content } = Layout;


const TaskOverview = ({ taskOverview, DatePickerChange, taskStatusList }) => {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleTaskClick = (record) => {

    const project = {
      ...record,
      ...record.project,
    };
    return navigate(ROUTES.TASK_DETAILS.PATH, {
      state: { project: project, task_id: record.task_id },
    });
  };

  const columns = [
    {
      title: "Project Number",
      dataIndex: "project_number",
      key: "project_number",
      render: (text, item) => {
        return (
          <div style={{ fontWeight: 900 }}>{item?.project?.project_number}</div>
        );
      },
    },
    {
      title: "Project Name",
      dataIndex: "project_name",
      key: "project_name",
      render: (text, item) => (
        <div style={{ fontWeight: 900 }}>{item?.project?.project_name}</div>
      ),
    },
    {
      title: "Task Name",
      dataIndex: "task_name",
      key: "task_name",
      render: (text, record) => (
        <div
          onClick={() => handleTaskClick(record)}
          style={{ cursor: "pointer" }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "task_end_date",
      key: "task_end_date",
      render: (text) => <div>{getFormatDate(text)}</div>,
    },
    {
      title: "Progress",
      dataIndex: "percentage",
      key: "percentage",
      render: (text) => {
        return (
          <div>
            <Progress percent={parseInt(text)} />
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <div>{formatStatusText(text)}</div>,
      filters: taskStatusList,
    },
  ];

  const style = {
    border: `1px solid `,
    borderRadius: "50%",
  };
  const cellRender = (current, info) => {
    if (info.type !== "date") {
      return info.originNode;
    }
    if (typeof current === "number" || typeof current === "string") {
      return <div className="ant-picker-cell-inner">{current}</div>;
    }
    return (
      <div
        className="ant-picker-cell-inner"
        style={current.date() === 1 ? style : {}}
      >
        {current.date()}
      </div>
    );
  };

  const onChange = (pagination, filters, sorter, extra) => {
    DatePickerChange(startDate, endDate, filters?.status);
  };



  const handleDropdownVisibleChange = (visible) => {
    setDropdownVisible(visible);
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    const [startDate, endDate] = dateStrings;
    setStartDate(startDate)
    setEndDate(endDate)
    DatePickerChange(startDate, endDate);
    setDropdownVisible(false);
  };

  const handleFilterButtonClick = () => {
    setDropdownVisible(!dropdownVisible); // Toggle dropdown visibility on button click
  };

  return (
    <Content>
      <Card
        title="Task Overview"
        extra={
          <Space>
            <Dropdown
              open={dropdownVisible}
              onOpenChange={handleDropdownVisibleChange}
              overlay={
                <DatePicker.RangePicker
                  cellRender={cellRender}
                  onChange={handleDateRangeChange}
                />
              }
              placement="bottomLeft"
              trigger={["click"]}
            >
              <Button type="text" style={{ float: "right" }}>
                <img
                  type="primary"
                  style={{ cursor: "pointer" }}
                  onClick={handleFilterButtonClick}
                  src={COMPANY.FILTER}
                  alt="Filter"
                />
              </Button>
            </Dropdown>
          </Space>
        }
      >
        {taskOverview && (
          <Table
            className={styles.customTable}
            columns={columns}
            dataSource={taskOverview}
            onChange={onChange}
            pagination={false} // Disable pagination
            style={{ width: "100%" }} // Set the width to 100%
          />
        )}
      </Card>
    </Content>
  );
};

export default TaskOverview;
