import React, { useEffect, useState } from 'react'
import { getFilesDetails, getItem } from '../../services';
import {  deleteFile, olderVersionFiles } from './files.service';
import { Breadcrumb, Button, Card, Dropdown, List, message } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { ICONS } from '../../constants';
import { dateFormat } from '../../components/common/service';
import styled from "../../styles/_files.module.css";
import "./main.css"
function OlderVersionFIle(props) {
  const filesDetails = getFilesDetails();
  console.log(filesDetails, "'-------filesDetails");
  const [olderFiles , setOlderFiles] = useState([])
  const [deleted , setDeleted]  = useState(false)
  useEffect(() => {
    setDeleted(false);
    getOlderFilesDetails({
      project_id: filesDetails.project_id,
      folder_id: filesDetails.folder_id,
      file_name: filesDetails.file_name,
    });
  }, [deleted]);

    const deleteFiles = async (id) => {
      props.setAuthUser({ loading: true });
      await deleteFile(id)
        .then(() =>setDeleted(true))
        .catch((error) => {
          message.error(error?.message ? error.message : "failed");
        })
        .finally(() => {
          props.setAuthUser({ loading: false });
        });
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
  const getOlderFilesDetails = (data) => {
    olderVersionFiles(data).then((result) => {
      if (result && result.data) {
        setOlderFiles(result.data);
      } 
    }).catch((err) => {
        message.error(err.message ? err.message : "Error in file loading!")
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


    const renderItem = (item) =>
      item.map((value, key) => (
        <List.Item key={item[key].id} style={{ alignItems: "center" }}>
          <List.Item.Meta
            avatar={<img src={getIcon(item[key].file_name)} width={"40px"} />}
            title={
              <p className={styled.fileName}>
                <p>{item[key].file_name}</p>
                <p style={{ position: "relative" }}>
                  {dateFormat(item[key].updated_at)} {"  "}
                  <Dropdown
                    trigger={"click"}
                    menu={{
                      items: [
                        getItem(
                          "1",
                          <Button
                            type="link"
                            onClick={() => {
                              downloadFile(
                                item[key]?.url,
                                item[key]?.file_name
                              );
                            }}
                          >
                            Download file
                          </Button>
                        ),
                        getItem(
                          "2",
                          <Button
                            type="link"
                            danger
                            onClick={() => {
                              deleteFiles(item[key].files_id);
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
  return (
    <>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Files",
          },
          {
            title: `${filesDetails.file_name}`,
          },
        ]}
      />
      <Card
        style={{
          padding: 0,
        }}
        bordered={false}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "16px",
          fontWeight:"bold"
          
        }}>
          <div>Name</div>
          <div>Modified</div>
        </div>
      </Card>
      <List size="small" dataSource={[olderFiles]} renderItem={renderItem} />
    </>
  );
}

export default OlderVersionFIle