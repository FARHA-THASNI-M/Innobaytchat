import React, { useEffect, useRef, useState } from "react";
import { Input, List, Avatar, Button, Spin } from "antd";

import {
  // Button,
  ChatList,
  Dropdown,
  MessageBox,
  MessageList,
  Navbar,
  SystemMessage,
} from "react-chat-elements";
import {
  socketListener,
  socketEmitter,
} from "../../services/socket/socket-listner";
import { allUserList } from "./chat.services";
import { generateAvatarLink } from "../../components/common/service";
import { SOCKET_EVENT_NAME } from "../../constants";
import "react-chat-elements/dist/main.css";
import "./main.css";
import {
  AudioOutlined,
  MoreOutlined,
  PaperClipOutlined,
  SendOutlined,
} from "@ant-design/icons";
const { Search } = Input;
const messageListReferance = React.createRef();
const inputReferance = React.createRef();
let clearRef = () => {};

const ChatApp = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [inputValue, setInputValue] = useState("");
  const messageInput = useRef(null);
  const [userList, setUserList] = useState([]);
  const [user, setUser] = useState({});
  const [messageList, setMessageList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const data = {
    id: 297,
    fromSelf: true,
    message:
      "https://staging-ebonite-chat.s3.me-central-1.amazonaws.com/chat/8/file/15-05-2024/1715775846270_App.tsx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYS2NWEDLDRJ66PMH%2F20240516%2Fme-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240516T024816Z&X-Amz-Expires=900&X-Amz-Signature=0272a72a8edd801da3abd17c3a42bd914a4ed585eb10feea3ad89bb4fdacd6ca&X-Amz-SignedHeaders=host",
    message_type: "file",
    receiver: 17,
    sender: 8,
    status: "sent",
    is_edited: false,
    is_deleted: false,
    sent_at: "2024-05-15T12:24:16.000Z",
    delevired_at: null,
    seen_at: null,
    is_stream_available: false,
    streamId: null,
    meta: {
      size: 5540,
    },
    createdAt: "2024-05-15T12:24:16.682Z",
    updatedAt: "2024-05-15T12:24:16.682Z",
    chatStream: null,
    user: {
      user_id: 8,
      username: "superadmin",
      first_name: "Super",
      last_name: "Admin",
      email: "info.ebonite@gmail.com",
    },
  };
  setMessageList([
    {
      avatar: message.fromSelf
        ? generateAvatarLink(
            message.user?.first_name + " " + message.user?.first_name
          )
        : user.avatar,
      avatarType: "circle",
      title: data.user?.first_name + " " + message.user?.last_name,
      position: data.fromSelf ? "right" : "left",
      type: data.message_type,
      text: data.message_type === "text" ? message.message : undefined,
      audio: { audioURL: data.message, size: 100 },
      size: "10000",
      size: 10000,
      date: new Date(message.sent_at),
    },
  ]);
  useEffect(() => {
    fetchAllUserList();
    // socketEmitter(SOCKET_EVENT_NAME.USER_LIST, { page: 1, pageSize: 10000 });
    // socketListener(SOCKET_EVENT_NAME.USER_LIST_RESP, userListResp);
    // socketListener(SOCKET_EVENT_NAME.GET_MESSAGE, userListResp);
    socketListener(SOCKET_EVENT_NAME.ERROR, error);
    // socketListener(SOCKET_EVENT_NAME.CHAT_LISTING_RESP, messageListing);
    // socketListener(SOCKET_EVENT_NAME.NEW_MESSAGE_ACK, userListResp);
    // socketListener(SOCKET_EVENT_NAME.USER_LIST_RESP, userListResp);
    // socketListener(SOCKET_EVENT_NAME.USER_LIST_RESP, userListResp);
  }, []);
  const userListing = () => {};
  const userListResp = (err, data) => {
    setLoading(false);
    if (data && data.rows) {
      console.log("data.rows", data.rows);
      const dataSource = data?.rows?.map((row) => {
        let avatar, title, subtitle, group_id, user_id;
        if (row.groupChat) {
          group_id = row.group_id;
          avatar = generateAvatarLink(row.groupChat.chat_group_name);
          title = row.groupChat.chat_group_name;
          subtitle = `${row.groupChat.groupMember.length} members`;
        } else if (row.user) {
          user_id = row.chat_user_id;
          avatar = generateAvatarLink(
            `${row.user?.first_name} ${row.user?.last_name}`
          );
          title = `${row.user?.first_name} ${row.user?.last_name}`;
          subtitle = row.user.email;
        }

        return {
          replyButton: true,
          avatar,
          alt: title,
          title,
          subtitle,
          user_id,
          group_id,
          date: new Date(row.createdAt),
          unread: 0, // You can set this to the appropriate unread count
        };
      });
      console.log("triggered");

      if (user) {
        loadMessages(dataSource[0]);
        setUser(dataSource[0]);
      }

      setUserList(dataSource);
    }
  };
  const fetchAllUserList = () => {
    allUserList()
      .then((data) => {
        console.log("data", data);
        if (data && data.data.rows) {
          const dataSource = data?.data?.rows?.map((row) => {
            return {
              title: row.first_name + " " + row.last_name,
              username: row.username,
              user_id: row.user_id,
              subtitle: row.email,
              avatarFlexible: true,
              date: null,
              avatar: generateAvatarLink(row.first_name + " " + row.last_name),
            };
          });
          console.log("dataSource", dataSource);
          setUsersList(dataSource);
        }
      })
      .catch((err) => console.log(err));
  };

  const onHandleSearchChange = (value) => {
    console.log(usersList, "usersList");
    setSearchValue(value.target.value);
    const searchQuery = value.target.value.toLowerCase();
    const filteredUsers = usersList.filter((user) => {
      return (
        user.username.toLowerCase().includes(searchQuery) ||
        user.title.toLowerCase().includes(searchQuery)
      );
    });
    setFilteredUsers(filteredUsers);
  };

  const error = (err, data) => {
    console.log("user error resp", data);
  };

  const messageListing = (err, data) => {
    if (data && data.rows) {
      const dataSource = data?.rows?.map((message) => ({
        avatar: message.fromSelf
          ? generateAvatarLink(
              message.user?.first_name + " " + message.user?.first_name
            )
          : user.avatar,
        avatarType: "circle",
        title: message.user?.first_name + " " + message.user?.last_name,
        position: message.fromSelf ? "right" : "left",
        type: message.message_type,
        text: message.message_type === "text" ? message.message : undefined,
        audio: { audioURL: message.message, size: 100 },
        size: 10000,
        date: new Date(message.sent_at),
      }));
      //      position={"left"}
      // type={"audio"}
      // title={"Emre"}
      // data={{
      //   audioURL: "https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3",
      // }}
      const data = {
        id: 297,
        fromSelf: true,
        message:
          "https://staging-ebonite-chat.s3.me-central-1.amazonaws.com/chat/8/file/15-05-2024/1715775846270_App.tsx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYS2NWEDLDRJ66PMH%2F20240516%2Fme-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240516T024816Z&X-Amz-Expires=900&X-Amz-Signature=0272a72a8edd801da3abd17c3a42bd914a4ed585eb10feea3ad89bb4fdacd6ca&X-Amz-SignedHeaders=host",
        message_type: "file",
        receiver: 17,
        sender: 8,
        status: "sent",
        is_edited: false,
        is_deleted: false,
        sent_at: "2024-05-15T12:24:16.000Z",
        delevired_at: null,
        seen_at: null,
        is_stream_available: false,
        streamId: null,
        meta: {
          size: 5540,
        },
        createdAt: "2024-05-15T12:24:16.682Z",
        updatedAt: "2024-05-15T12:24:16.682Z",
        chatStream: null,
        user: {
          user_id: 8,
          username: "superadmin",
          first_name: "Super",
          last_name: "Admin",
          email: "info.ebonite@gmail.com",
        },
      };
      setMessageList(dataSource);
    }
    console.log("any dta", data);
  };
  const loadMessages = (e) => {
    console.log("e", e);
    if (e.user_id)
      socketEmitter(SOCKET_EVENT_NAME.CHAT_LISTING, {
        id: e.user_id,
        page: 1,
        pageSize: 10000,
      });
    else {
      socketEmitter(SOCKET_EVENT_NAME.CHAT_LISTING, {
        group_id: e.group_id,
        page: 1,
        pageSize: 10000,
      });
    }
  };
  let inputClear = (e) => {};
  const onChatListClick = (e) => {
    setSearchValue("");
    if (e.user_id === user.user_id) return;
    let clickerUserList;
    if (e.user_id) {
      clickerUserList = userList.filter((item) => item.user_id === e.user_id);
    } else {
      clickerUserList = userList.filter((item) => item.group_id === e.group_id);
    }

    loadMessages(e);
    setMessageList([]);

    setUser(...clickerUserList);
  };
  const sendMessage = (message) => {
    console.log(message, "-----");
    setMessageList([
      ...messageList,
      {
        avatar: user.avatar,
        avatarType: "circle",
        title: user.title,
        position: "right",
        type: inputValue,
        text: "text",
        date: new Date(),
      },
    ]);
    socketEmitter(SOCKET_EVENT_NAME.SEND_NEW_MESSAGE, {
      to: user.user_id,
      group: user.group_id,
      message: inputValue,
      message_type: "text",
    });
    setInputValue("");
  };
  return (
    <div style={{ height: "100%" }}>
      {loading ? (
        <Spin className="spin-loder" tip="Loading..."></Spin>
      ) : (
        <div
          style={{
            display: "flex",
            height: "90%",
            border: "1px solid #f0f0f0",
          }}
        >
          <div style={{ borderRight: "1px solid #fff", width: "300px" }}>
            <div>
              <Navbar
                type={"light"}
                left={<div>Conversation List</div>}
                right={
                  <Dropdown
                    buttonProps={{
                      icon: {
                        float: "left",
                        size: 15,
                        component: <MoreOutlined />,
                      },
                    }}
                    items={[
                      {
                        text: "lorem",
                      },
                      {
                        text: "ipsum",
                      },
                      {
                        text: "dolor",
                      },
                    ]}
                  />
                }
              />
              <Input
                className="inputSearchBox"
                placeholder="Search here.."
                value={searchValue}
                onChange={onHandleSearchChange}
                enterButton
              />
            </div>
            <div>
              <ChatList
                onClick={onChatListClick}
                style={{ height: "500px", overflow: "scroll" }}
                className="chat-list"
                dataSource={
                  !searchValue && !searchValue.length ? userList : filteredUsers
                }
              />
              )
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <Navbar
              type="light"
              left={
                <div>
                  <div>
                    <Avatar src={user.avatar} type="circle" />
                  </div>
                  <div>{user.title}</div>
                </div>
              }
              right={
                <Dropdown
                  animationType="fade"
                  animationPosition="norteast"
                  buttonProps={{
                    icon: {
                      float: "left",
                      size: 15,
                      component: <MoreOutlined />,
                    },
                  }}
                  items={[
                    {
                      text: "lorem",
                    },
                    {
                      text: "ipsum",
                    },
                    {
                      text: "dolor",
                    },
                  ]}
                />
              }
            />
            <MessageList
              referance={messageListReferance}
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={messageList}
            />

            <div className="inputContainer" style={{ position: "bottom" }}>
              <Input
                style={{ width: "90%", background: "#fff" }}
                variant="borderless"
                placeholder="Enter message"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                autoFocus
                onPressEnter={sendMessage}
                suffix={
                  <SendOutlined
                    onClick={sendMessage}
                    style={{
                      fontSize: 14,
                      color: "#71717A",
                      transform: "rotate(330deg)",
                      cursor: "pointer",
                    }}
                  />
                }
              ></Input>
              <AudioOutlined
                style={{
                  fontSize: 16,
                  color: "#71717A",
                }}
              />
              <PaperClipOutlined
                style={{
                  fontSize: 16,
                  color: "#71717A",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
