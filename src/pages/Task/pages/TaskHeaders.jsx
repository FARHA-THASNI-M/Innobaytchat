import {
  AimOutlined,
  FieldTimeOutlined,
  FilterOutlined,
  HolderOutlined,
  PlusOutlined,
  SearchOutlined,
  ThunderboltFilled,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Drawer,
  Dropdown,
  Form,
  Input,
  Layout,
  Progress,
  Row,
  Space,
} from "antd";

import React, { useEffect, useState } from "react";
import { ICONS } from "../../../constants";
import styled from "../../../styles/_task.module.css";
import "../main.css";

import CustomSelect from "../../../components/common/select/customSelect";

import SnagModal from "../../../components/Snag/Snag";
import TaskModal from "../../../components/Task/Task";
import ViolationModal from "../../../components/Violation/Violation";
import { PERMISSIONS } from "../../../constants/permissions";
import { getItem, getPermissions, getPriority, getType } from "../../../services";
import { getProjectCategories } from "../task.service";
import GroupCheckbox from "../../Projects/GroupCheckbox";

const { Content } = Layout;

function TaskHeaders({ props, project }) {
  const permissions = getPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [snagModalVisible, setSnagModalVisible] = useState(false);
  const [violationModalVisible, setViolationModalVisible] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [priorityFilters, setPriorityFilters] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  // 
  const priorityList = getPriority();
  const typeList = getType();
  const pripority = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];
  useEffect(() => {
    getProjectCategoryList()
  }, [])

  const getProjectCategoryList = () => {
    getProjectCategories(project.project_id).then((data) => {
      if (data.success) {
        const categories = data.data.map((category) => ({ value: category?.ref_category?.category_name, key: category?.category_id }))
        setCategoriesList(categories)
      }
    });
  }

  const onCancel = () => {
    setModalVisible(false);
    setSnagModalVisible(false)
    setViolationModalVisible(false)
  };

  return (
    <Content>
      <Row gutter={16}>
        <Col span={18}>
          <Breadcrumb
            className={styled.breadhCrum}
            separator=">"
            items={[
              {
                title: "Project",
              },
              {
                title: `${project?.project_number}`,
              },
            ]}
          />
          <Space>
            <p className={styled.projectHeading}>
              {project.project_name}  </p> <Progress
              percent={project?.project_percentage}
              status="active"
              size={[250]}
              strokeColor={"#87d068"}
            />
            <Avatar.Group
              maxCount={3}
              size="small"
              maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
            >
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" />
              <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
              <Avatar
                style={{ backgroundColor: "#1677ff" }}
                icon={<UserOutlined />}
              />
              <Avatar
                style={{ backgroundColor: "#1677ff" }}
                icon={<UserOutlined />}
              />
              <Avatar
                style={{ backgroundColor: "#1677ff" }}
                icon={<UserOutlined />}
              />
            </Avatar.Group>
          </Space>
          <p className={styled.projectDuration}>
            <FieldTimeOutlined /> Start: {moment(project?.project_start_date).format('MM-DD-YYYY')} - Due: {moment(project?.project_end_date).format('MM-DD-YYYY')}
          </p>
        </Col>
        <Col span={6}>
          <Space style={{ float: 'right' }}>
            {/* <Button icon={<FilterOutlined />} onClick={showDrawer}></Button> */}
            <Input
              // className={styled.inputBox}
              placeholder="Search"
              prefix={<SearchOutlined />}
              width={100}
            />
            <Dropdown
              menu={{
                items: [
                  getItem(permissions.includes(PERMISSIONS.TASK_CREATE), (
                    <div
                      onClick={(e) => {
                        setModalVisible(true);
                      }}
                    >
                      Create Task
                    </div>
                  ), "1"),
                  getItem(permissions.includes(PERMISSIONS.SNAG_CREATE), (
                    <div
                      onClick={(e) => {
                        setSnagModalVisible(true);
                      }}
                    >
                      Create Snag
                    </div>
                  ), "2"),
                  getItem(permissions.includes(PERMISSIONS.VIOLATION_CREATE), (
                    <div
                      onClick={(e) => {
                        setViolationModalVisible(true);
                      }}
                    >
                      Create Violation
                    </div>
                  ), "3"),
                ],
              }}
              placement="bottom"
            >
              <Button type="primary" icon={<PlusOutlined />}>
                Create
              </Button>
            </Dropdown>
          </Space>
        </Col>
      </Row>
      <br />
      <Space
        direction="horizontal"
        style={{ display: "flex", flexWrap: "wrap" }}
      >

        <GroupCheckbox optionList={priorityList} setFilters={setPriorityFilters} filters={priorityFilters} icon={<ThunderboltFilled />} title={'Priority'} />
        <GroupCheckbox optionList={categoriesList} setFilters={setCategoryFilters} filters={categoryFilters} icon={<UnorderedListOutlined />} title={'Category'} />
        <GroupCheckbox optionList={typeList} setFilters={setTypeFilters} filters={typeFilters} icon={<HolderOutlined />} title={'Type'} />
        <DatePicker placeholder="Due Date" variant="borderless" />
        {/* <CustomSelect
          prefixIcon={<img src={ICONS.PRIORITY} />}
          placeholder="Priority"
          options={priorityList}
        />
        <CustomSelect
          prefixIcon={<img src={ICONS.CATEGORY} />}
          placeholder="Category"
          options={categoriesList}
        />
        <CustomSelect
          prefixIcon={<img src={ICONS.DUE} />}
          placeholder="Due Date"
          options={pripority}
        />
        <CustomSelect
          prefixIcon={<img src={ICONS.TYPE} />}
          placeholder="Type"
          options={typeList}
        />
        <CustomSelect
          placeholder="Assigned To"
          options={pripority}
        /> 
        Project Progress{" "}
        <Progress
          percent={project?.project_percentage}
          status="active"
          size={[250]}
          strokeColor={"#87d068"}
        />*/}

      </Space>
      {modalVisible && <TaskModal visible={modalVisible} onCancel={onCancel} project={project} />}
      {
        snagModalVisible && (
          <SnagModal visible={snagModalVisible} onCancel={onCancel} project={project} />
        )
      }
      {
        violationModalVisible && (
          <ViolationModal visible={violationModalVisible} onCancel={onCancel} project={project} />
        )
      }


      {/* <Drawer
    title="Filters"
    // width={720}
    onClose={onClose}
    open={open}
    styles={{
      body: {
        paddingBottom: 80,
      },
    }}
    footer={
      <Space align="end">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose} type="primary">
          Submit
        </Button>
      </Space>
    }
  >
    <Form layout="vertical" hideRequiredMark>
      <Form.Item
        name="name"
        label="Name"
      >
        <Input placeholder="Please enter user name" />
      </Form.Item>

    </Form>
  </Drawer> */}
    </Content >
  );
}

export default TaskHeaders;
