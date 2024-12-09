import React, { useEffect, useRef } from "react";
import { MessageList as ReactMessageList } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import { Tag, message } from "antd";

dayjs.extend(isToday);
dayjs.extend(isTomorrow);

const MessageList = ({ messageList, messageListReference, onScrollEvent }) => {
  const preprocessMessages = (messages) => {
    const groupedMessages = [];
    let lastDateLabel = null;

    messages
      ?.slice()
      ?.reverse()
      ?.forEach((message) => {
        console.log(message,"===message===")
        const messageDate = dayjs(message.date);
        let dateLabel = "";
        if (message.unreadMessage) {
          dateLabel = "Unread Message";
        } else if (messageDate.isToday()) {
          dateLabel = "Today";
        } else if (messageDate.isTomorrow()) {
          dateLabel = "Tomorrow";
        } else {
          dateLabel = messageDate.format("MMMM D, YYYY");
        }

        if (dateLabel !== lastDateLabel) {
          groupedMessages.push({
            type: "date-label",
            text: dateLabel,
          });
          lastDateLabel = dateLabel;
        }

        groupedMessages.push(message);
      });

    return groupedMessages.reverse();
  };

  const groupedMessageList = preprocessMessages(messageList);

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
  const onDownload = (e) => {
    console.log("Download", e);
    downloadFile(e.data.uri , e.text);
  }
  return (
    <div
      style={{
        height: "calc(100vh - 237px)",
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        backgroundColor: "#F0F0F0",
      }}
      ref={messageListReference}
      onScroll={onScrollEvent}
    >
      {groupedMessageList?.map((item, index) =>
        item.type === "date-label" ? (
          <div key={index} className="date-label">
            <Tag color="default" bordered={false}>
              {item.text}
            </Tag>
          </div>
        ) : (
          <ReactMessageList
            className="message-list"
            key={index}
            isShowChild={true}
            lockable={true}
            dataSource={[item]}
            sendMessagePreview={true}
            onDownload={onDownload}
          />
        )
      )}
    </div>
  );
};

export default MessageList;
