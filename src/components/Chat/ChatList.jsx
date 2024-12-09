import React from "react";
import { ChatList as ReactChatList } from "react-chat-elements";
import "react-chat-elements/dist/main.css";

const ChatList = ({
  userList,
  filteredUsers,
  searchValue,
  onChatListClick,
}) => {
  return (
    <ReactChatList
      lockable={true}
      onClick={onChatListClick}
      style={{ height: "500px", overflow: "scroll" }}
      className="chat-list"
      dataSource={
        !searchValue && !searchValue?.length ? userList : filteredUsers
      }
    />
  );
};

export default ChatList;
