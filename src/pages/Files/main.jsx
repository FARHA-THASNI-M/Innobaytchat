import {
  MoreOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Divider,
  Dropdown,
  Flex,
  Layout,
  List,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import FileViewer from "../../components/File/FileView";
import CreateFolder from "../../components/File/CreateFolder";
import UploadFiles from "../../components/File/UploadFiles";
import {
  dateFormat,
  deleteFolder,
  fileIsPdfOrImage,
  getFolderListing,
} from "../../components/common/service";
import { ICONS, ROUTES } from "../../constants";
import { getItem, getProject } from "../../services";
import styled from "../../styles/_files.module.css";
import { deleteFile, getFilesListing, updateFile } from "./files.service";
import "./main.css";

const { Panel } = Collapse;

const FileList = (props) => {
  const project = getProject();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [documentModalVisible, setDocumentrModalVisible] = useState(false);
  const [fileData, setFileData] = useState({})
  const [moveToMenuOpen, setMoveToMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [files, setFiles] = useState(null);
  const [taskFile, setTaskFile] = useState(null);
  const [filesFolderIDArray, setFilesFolderIDArray] = useState([]);

  const [folderData, setFolderData] = useState([]);

  let groupedFiles = {};
  let groupedIdArray = [];

  useEffect(() => {
    fileList();
    folderList();
  }, []);
  const fileList = () => {
    getFilesListing({ project_id: project.project_id })
      .then((res) => {
        if (res && res.success) {
          res?.data?.filesList?.forEach((file) => {
            if (!groupedFiles[file?.folder?.folder_name]) {
              groupedFiles[file?.folder?.folder_name] = [];
              groupedIdArray.push(file?.folder_id);
            }
            groupedFiles[file?.folder?.folder_name].push(file);
          });
          setFiles(groupedFiles);
          setFilesFolderIDArray(groupedIdArray);
          const taskList = {}
          res?.data?.taskList?.map((item, index) => {
            taskList[item?.task_name] = item?.ref_attachment;
          })
          setTaskFile(taskList);
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      });
  };

  const folderList = () => {
    getFolderListing({ project_id: project?.project_id })
      .then((res) => {
        setFolderData(res.data);
        res?.data?.forEach((file) => {
          if (!groupedFiles[file?.folder_name]) {
            groupedFiles[file?.folder_name] = [];
            groupedIdArray.push(file?.folder_id);
          }
        });
        setFiles(groupedFiles);
        setFilesFolderIDArray(groupedIdArray);
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      });
  };

  const handleCreateFolder = () => {
    setCreateModalVisible(true);
    setMoveToMenuOpen(false);
  };

  const handleFileUpload = () => {
    setUploadModalVisible(true);
  };

  const onCancel = () => {
    setCreateModalVisible(false);
  };

  const onCreate = (data) => {
    setCreateModalVisible(false);
  };
  const onUploadCancel = (data) => {
    setUploadModalVisible(false);
  };

  const handleMoveToClick = (e) => {
    e.stopPropagation();
    setMoveToMenuOpen(!moveToMenuOpen);
  };

  const handleMoveFile = (file, folder) => {
    const updatedFiles = { ...files };

    const filesInFolder = [...updatedFiles[folder.folder_name]];

    const myfile = filesInFolder.push(file);

    updatedFiles[folder.folder_name] = filesInFolder;
    // const updatedFilesInFolder = filesInFolder.filter((f) => f.id !== file.id);

    // file.folder = {
    //   folder_name: folder.folder_name

    // };

    // if (!updatedFiles[folder.folder_name]) {
    //   updatedFiles[folder.folder_name] = [];
    // }

    // updatedFiles[folder.folder_name].push(file);
    updateFile(file.files_id, {
      folder_id: folder.folder_id,
    })
      .then((res) => {
        fileList();
      })
      .catch((error) => {
        message.error(
          error?.message
            ? error.message
            : "Failed to move file. Please try again"
        );
      });

    setFiles(updatedFiles);
  };

  const handleViewDocumentClick = (item) => {
    console.log(item, "----item");
    setDocumentrModalVisible(true);
    setFileData(item);
  }

  const handleCancel = () => {
    setDocumentrModalVisible(false);
    setFileData({});
  };

  const downloadFile = async (url, filename) => {
    try {
      if (url) {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Failed to fetch ${response.statusText}`);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename || "default-filename";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      }
    } catch (error) {
      message.error(error?.message ? error.message : "failed");
    }
  };

  const deleteFiles = async (id) => {
    props.setAuthUser({ loading: true });
    await deleteFile(id)
      .then(() => fileList())
      .then(() => folderList())
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      })
      .finally(() => {
        props.setAuthUser({ loading: false });
      });
  };

  const deleteFolders = async (id) => {
    props.setAuthUser({ loading: true });
    await deleteFolder(id)
      .then(() => fileList())
      .then(() => folderList())
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      })
      .finally(() => {
        props.setAuthUser({ loading: false });
      });
  };

  const getIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") {
      return ICONS.PDF;
    } else if (["png", "jpg", "jpeg"].includes(extension)) {
      return ICONS.IMAGE;
    } else {
      return ICONS.FILE;
    }
  };

  const viewOlderVersionFile = (fileDetails) => {
    props.setFilesDetails({ fileDetails });
    navigate(ROUTES.OLDER_FILES.PATH, { state: { files: fileDetails } });
  }

  const renderItem = (item) =>
    item.map((value, key) => (
      <List.Item key={item[key].id} style={{ alignItems: "center" }}>
        <List.Item.Meta
          avatar={<img src={getIcon(item[key].file_name)} width={"40px"} />}
          title={
            <p className={styled.fileName}>
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: false,
                  symbol: "more",
                  tooltip: item[key].file_name,
                }}
                style={{ margin: "0.1px" }}
              >
                {item[key].file_name.length > 50
                  ? item[key].file_name.slice(0, 50) + "..."
                  : item[key].file_name}
              </Typography.Paragraph>
              <p style={{ position: "relative" }}>
                {dateFormat(item[key].created_at)}
                <Dropdown
                  trigger={"click"}
                  onOpenChange={(visible) => {
                    if (!visible) {
                      setMoveToMenuOpen(false); // Assuming you have state for managing menu open/close
                    }
                  }}
                  menu={{
                    items: [
                      getItem(
                        "1",
                        <Button
                          type="link"
                          onClick={() => {
                            viewOlderVersionFile(item[key]);
                          }}
                        >
                          View older Version
                        </Button>
                      ),
                      fileIsPdfOrImage(item[key].file_name) &&
                      getItem(
                        "6",
                        <Button
                          type="link"
                          onClick={() => {
                            handleViewDocumentClick(item[key]);
                          }}
                        >
                          View File
                        </Button>
                      ),
                      getItem(
                        "2",
                        <>
                          <Button type="link" onClick={handleMoveToClick}>
                            Move to
                          </Button>
                          {moveToMenuOpen && (
                            <div
                              style={{
                                position: "absolute",
                                top: "0",
                                left: "-118%",
                                width: "80%",
                                backgroundColor: "white",
                                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                                borderRadius: "4px",
                                padding: "15px 30px",
                                zIndex: 1,
                                transition: "left 0.3s ease",
                              }}
                            >
                              <div
                                style={{
                                  height: "136px",
                                  overflowY: "scroll",
                                  scrollbarWidth: "none",
                                }}
                              >
                                {folderData.map((folder) => (
                                  <div
                                    key={folder.id}
                                    onClick={() =>
                                      handleMoveFile(item[key], folder)
                                    }
                                    style={{
                                      paddingBottom: "8px",
                                      marginBottom: "8px",
                                      color: "#1677ff",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {folder.folder_name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ),
                      getItem(
                        "3",
                        <Button
                          type="link"
                          onClick={(e) => {
                            downloadFile(item[key]?.url, item[key]?.file_name);
                          }}
                        >
                          Download file
                        </Button>
                      ),
                      getItem(
                        "4",
                        <Button
                          type="link"
                          danger
                          onClick={() => {
                            deleteFiles(item[key].files_id);
                            // moveToTrash(item[key].files_id);
                          }}
                        >
                          Delete
                        </Button>
                      ),
                    ],
                  }}
                  placement="bottom"
                >
                  <MoreOutlined />
                </Dropdown>
              </p>
            </p>
          }
        // description={`${item[key].fileSize} / ${item[key].time} / ${item[key].sharedBy}`}
        />
      </List.Item>
    ));

  const taskItem = (item) =>
    item.map((value, key) => (
      <List.Item key={item[key].id} style={{ alignItems: "center" }}>
        <List.Item.Meta
          avatar={<img src={getIcon(item[key].file_name)} width={"40px"} />}
          title={
            <p className={styled.fileName}>
              <p>{item[key].file_name}</p>
              <p style={{ position: "relative" }}>
                {dateFormat(item[key].created_at)} {"  "}
                <Dropdown
                  trigger={"click"}
                  onOpenChange={(visible) => {
                    if (!visible) {
                      setMoveToMenuOpen(false); // Assuming you have state for managing menu open/close
                    }
                  }}
                  menu={{
                    items: [
                      getItem(
                        "3",
                        <Button
                          type="link"
                          onClick={(e) => {
                            downloadFile(item[key]?.url, item[key]?.file_name);
                          }}
                        >
                          Download file
                        </Button>
                      ),
                      fileIsPdfOrImage(item[key].file_name) &&
                      getItem(
                        "7",
                        <Button
                          type="link"
                          onClick={() => {
                            handleViewDocumentClick(
                              item[key]
                            );
                          }}
                        >
                          View File
                        </Button>
                      ),
                    ],
                  }}
                  placement="bottom"
                >
                  <MoreOutlined />
                </Dropdown>
              </p>
            </p>
          }
        // description={`${item[key].fileSize} / ${item[key].time} / ${item[key].sharedBy}`}
        />
      </List.Item>
    ));

  const updateFilesList = () => {
    fileList();
    folderList();
  };

  return (
    <Layout.Content className={styled.fileScrollView}>
      <Flex justify="flex-end">
        <Space align="end" style={{ marginBottom: "16px" }}>
          <Button
            color="#CCE6FF"
            icon={<PlusOutlined />}
            onClick={handleCreateFolder}
          >
            Create Folder
          </Button>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={handleFileUpload}
          >
            Upload
          </Button>
        </Space>
      </Flex>
      <Spin spinning={false}>
        {files &&
          Object.keys(files).map((folder, index) =>
            folder !== "undefined" ? (
              <Collapse ghost bordered={false} style={{ marginBottom: "10px" }}>
                <Panel
                  header={
                    <div className="flex items-center">
                      <img
                        src={ICONS.CHECKED_FOLDER}
                        style={{ marginRight: "5px" }}
                      />
                      {folder}
                    </div>
                  }
                  key={folder}
                  extra={
                    <p style={{ position: "relative" }}>
                      {dateFormat(folder.created_at)} {"  "}
                      <Dropdown
                        trigger={"click"}
                        menu={{
                          items: [
                            getItem(
                              "4",
                              <Button
                                type="link"
                                danger
                                onClick={(e) => {
                                  deleteFolders(filesFolderIDArray[index]);
                                }}
                              >
                                Delete
                              </Button>
                            ),
                          ],
                        }}
                        placement="bottom"
                      >
                        <MoreOutlined />
                      </Dropdown>
                    </p>
                  }
                >
                  <List
                    size="small"
                    dataSource={[files[folder]]}
                    renderItem={renderItem}
                  />
                </Panel>
              </Collapse>
            ) : (
              <List
                size="small"
                dataSource={[files[folder]]}
                renderItem={renderItem}
              />
            )
          )}

        <Divider orientation="left">Task Attachments</Divider>

        {taskFile &&
          Object.keys(taskFile).map((task, index) => (
            <Collapse
              ghost
              bordered={false}
              key="taskList"
              style={{ marginBottom: "10px" }}
            >
              <Panel
                header={
                  <div className="flex items-center">
                    <img
                      src={ICONS.CHECKED_FOLDER}
                      style={{ marginRight: "5px" }}
                    />
                    {task}
                  </div>
                }
                key={task}
                extra={
                  <p style={{ position: "relative" }}>
                    {dateFormat(task.created_at)}
                  </p>
                }
              >
                <List
                  size="small"
                  dataSource={[taskFile[task]]}
                  renderItem={taskItem}
                />
              </Panel>
            </Collapse>
          ))}
      </Spin>
      {createModalVisible && (
        <CreateFolder
          visible={createModalVisible}
          onCancel={onCancel}
          onCreate={onCreate}
          project={project}
          updateFilesList={updateFilesList}
        />
      )}
      {uploadModalVisible && (
        <UploadFiles
          visible={uploadModalVisible}
          fetchFiles={fileList}
          onCancel={onUploadCancel}
          project={project}
          updateFilesList={updateFilesList}
        />
      )}
      { }
      {documentModalVisible && (
        <FileViewer
          data={fileData}
          visible={documentModalVisible}
          handleCancel={handleCancel}
        />
      )}
    </Layout.Content>
  );
};

export default FileList;
