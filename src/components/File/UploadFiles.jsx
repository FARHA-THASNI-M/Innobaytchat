import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Popconfirm,
  Select,
  message
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { checkFileIsExist, getFilerscreate, getFolderListing, getUploadUrl } from "../common/service";
import "./up.css";
const { Option } = Select;

const UploadFiles = ({ visible, onCancel, project,updateFilesList }) => {

  const [folderData, setFolderData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  console.log('selectedFolderId', selectedFolderId)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    FolderList();
  }, []);

  const FolderList = async () => {
    await getFolderListing({ project_id: project?.project_id })
      .then((res) => {
        setFolderData(res.data || []);
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      });
  };

  const props = {
    name: 'file',
    multiple: true,
    maxCount: 5,
    onChange(e) {
      setFileData(e?.fileList)
    },
    customRequest(e) { customRequest(e) },
  }

  const customRequest = (e) => {
    e.onSuccess([], e.file);
  };

  const cancel = () => {
    setFileData([])
    onCancel()
  }

  const fileUpload = async () => {
    if (fileData && fileData.length) {
      const files = [];
      setLoading(true);
      for (let i = 0; i < fileData.length; i++) {
        const file = fileData[i].originFileObj;
        const fileExist = await checkFileIsExistOrNot({
          project_id: project?.project_id,
          folder_id: selectedFolderId,
          file_name:file.name,
        });
        console.log(fileExist, "fileExist");
        const url = await getUrlToUpload(file);
        files.push({
          url,
          type: "file",
          file_name: file.name,
          file_type: file.type,
          folder_id: selectedFolderId,
          project_id: project?.project_id,
          group_id: "",
          files_id: fileExist?.data?.isExist ? fileExist?.data?.files_ids : [],
        });
      }
      
      // console.log('files', files);
  
      const createdFiles = [];
      for (let j = 0; j < files.length; j++) {
        const mydata = await getFilerscreate(files[j]);
        createdFiles.push(mydata);
      }
      
      // console.log('createdFiles', createdFiles);
  
      if (createdFiles.length) {
       
        cancel();
      }
      updateFilesList()
    } else {
      message.error("Please select file");
    }
  };
  const getUrlToUpload = async (file) => {
    const path = generateURLForFile(file);
    console.log('path', path)
    return getUploadUrl({ path })
      .then((data) => {
        if (data.success) {
          const { url } = data.data;
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", file?.type);
          var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: file,
          };
          return fetch(url, requestOptions)
            .then((response) => {
              if (response.status === 200) {
                return path;
              }
            })
            .catch((error) => console.log("error", error));
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      });
  }

  const checkFileIsExistOrNot = async (data) => {
    try {
      return await checkFileIsExist(data)
    }
    catch (error){
      return {}
    }
    
  }
  const generateURLForFile = (fileDetails) => {
    return `${project.project_name}/file/${moment().format('DD-MM-YYYY')}/${Date.now()}_${fileDetails?.name}`
  }

  const handleFolderChange = (value, option) => {
    setSelectedFolderId(option.key);
  };
  return (
    <>
      <Modal
        title="Upload File"
        text={"Add your documents here, and you can upload"}
        open={visible}
        closeIcon={null}
        footer={[
          <div className="flex justify-between">
            <Select defaultValue="Select Folder" onChange={handleFolderChange} className="blue-text w-[120px]">
              {folderData.map(folder => (
                <Option key={folder.folder_id} value={folder.folder_name}>{folder.folder_name}</Option>
              ))}
            </Select>

            <div className="flex gap-2">
              <Popconfirm
                title="Are you sure?"
                description="changes will not be saved"
                onConfirm={cancel}
                onCancel={() => {
                  return 0;
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button type={"default"} disabled={loading}>Cancel</Button>
              </Popconfirm>
              <Button
                htmlType="submit"
                type="primary"
                onClick={fileUpload}
                loading={loading}
              >
                {"Upload"}
              </Button>

            </div>

          </div>

        ]}
      >
        Add your documents here, and you can upload
        <Dragger {...props} disabled={loading}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Maximum 5 files</p>
        </Dragger>

      </Modal>
    </>
  );
};

export default UploadFiles;
