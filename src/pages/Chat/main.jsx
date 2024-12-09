import React, { useEffect, useRef, useState } from "react";
import { Avatar, Input, Spin, message } from "antd";
import {
  socketListener,
  socketEmitter,
} from "../../services/socket/socket-listner";
import { ChatList, MessageList, InputBox } from "../../components/Chat";
import { SOCKET_EVENT_NAME } from "../../constants";
import { allUserList, userprofile, fileUpload, allGroupList } from "./chat.services";
import { generateAvatarLink } from "../../components/common/service";
import "./main.css";
import moment from "moment";
import {
  AudioOutlined,
  MoreOutlined,
  PaperClipOutlined,
  SendOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { Dropdown, Navbar } from "react-chat-elements";

const { Search } = Input;

const messageListReferance = React.createRef();
const inputReferance = React.createRef();
let clearRef = () => { };

let selectedUsers = {}

const ChatApp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const messageInput = useRef(null);
  const [userList, setUserList] = useState([]);
  const [user, setUser] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    currentUserInformation();
    fetchAllUserList();
    fetchAllGroupList()
    socketEmitter(SOCKET_EVENT_NAME.USER_LIST, { page: 1, pageSize: 10000 });
    socketListener(SOCKET_EVENT_NAME.USER_LIST_RESP, userListResp);
    socketListener(SOCKET_EVENT_NAME.ERROR, error);
    socketListener(SOCKET_EVENT_NAME.CHAT_LISTING_RESP, messageListing);
    socketListener(SOCKET_EVENT_NAME.NEW_MESSAGE_ACK, newMessageHandle);
    socketListener(SOCKET_EVENT_NAME.GET_MESSAGE, messageAck );
  }, []);
  const newMessageHandle = (error, data) => {
    if (!data) return;
    socketEmitter(SOCKET_EVENT_NAME.USER_LIST, { page: 1, pageSize: 10000 });
    if (messageList.some((message) => message.id === data.id)) {
      return;
    }

     console.log(
       "newMessageHandle",
       data,
       selectedUsers?.user_id,
       selectedUsers
     );
    if (
      data.receiver === parseInt(selectedUsers?.user_id) ||
      data.group_id === parseInt(selectedUsers?.group_id)
    ) {
      setMessageList((prevMessageList) => {
        let filteredList = prevMessageList.filter(
          (message) => message.id !== undefined && message.id !== null
        );
        filteredList = filteredList.filter((message) => message.id !== data.id);
        const newMessage = {
          id: data.id,
          avatar: generateAvatarLink(
            data.user?.first_name + " " + data.user?.last_name
          ),
          avatarType: "circle",
          title: !data.fromSelf
            ? data.user?.first_name + " " + data.user?.last_name
            : "You",
          position: data.fromSelf ? "right" : "left",
          type: data.message_type === "image" ? "photo" : data.message_type,
          text:
            data.message_type === "text"
              ? data.message
              : data.message_type === "file"
              ? data.meta.name || "File"
              : null,
          senderId: data.sender,
          fromSelf: data.fromSelf,
          unreadMessage:
            data.status === "sent" && !data.fromSelf ? true : false,
          status:
            message.status && message.fromSelf === "sent"
              ? "sent"
              : message.status && message.fromSelf === "seen"
              ? "read"
              : message.fromSelf
              ? "received"
              : null,
          data: {
            videoURL: data.message,
            audioURL: data.message,
            uri: data.message,
            size: data.meta.size || 10,
            status: {
              download: data.message_type === "file" ? false : true,
              click: data.message_type === "file" ? false : true,
            },
            width: 300,
            height: 300,
            onDownload: downloadHandler,
          },
          date: new Date(data.sent_at),
        };

        // Return the updated message list with the new message prepended
        return [newMessage, ...filteredList];
      });
      if (user) loadMessages(user);
    }
  }

const currentUserInformation = () => {
  userprofile()
    .then((res) => {
      if (res && res.data) {
        const title = res.data.first_name + " " + res.data.last_name;
        setCurrentUser({
          avatar: generateAvatarLink(title),
          title: title,
          user_id: res.data.user_id,
          email: res.data.email,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
        });
      }
    })
    .catch((error) => {
      console.log("Error in  currentUserInformation ", error);
    });
};
const messageAck = (err, data) => {
  if (!data) return;
  socketEmitter(SOCKET_EVENT_NAME.USER_LIST, { page: 1, pageSize: 10000 });
  if (messageList.some((message) => message.id === data.id)) {
    return;
  }
  console.log("messageAck", data, selectedUsers?.user_id, selectedUsers);
  if (
    data.sender === parseInt(selectedUsers?.user_id) ||
    data.group_id === parseInt(selectedUsers?.group_id)
  ) {
    setMessageList((prevMessageList) => {
      let filteredList = prevMessageList.filter(
        (message) => message.id !== undefined && message.id !== null
      );
      filteredList = filteredList.filter((message) => message.id !== data.id);

      const newMessage = {
        id: data.id,
        avatar: generateAvatarLink(
          data.user?.first_name + " " + data.user?.last_name
        ),
        avatarType: "circle",
        title: !data.fromSelf
          ? data.user?.first_name + " " + data.user?.last_name
          : "You",
        position: data.fromSelf ? "right" : "left",
        type: data.message_type === "image" ? "photo" : data.message_type,
        text:
          data.message_type === "text"
            ? data.message
            : data.message_type === "file"
            ? data.meta.name || "File"
            : null,
        senderId: data.sender,
        fromSelf: data.fromSelf,
        status:
          message.status && message.fromSelf === "sent"
            ? "sent"
            : message.status && message.fromSelf === "seen"
            ? "read"
            : message.fromSelf
            ? "received"
            : null,
        unreadMessage: data.status === "sent" && !data.fromSelf ? true : false,
        data: {
          videoURL: data.message,
          audioURL: data.message,
          uri: data.message,
          size: data.meta.size || 10,
          status: {
            download: data.message_type === "file" ? false : true,
            click: data.message_type === "file" ? false : true,
          },
          width: 300,
          height: 300,
        },
        date: new Date(data.sent_at),
      };
      return [newMessage, ...filteredList];
    });
  }
};
const userListResp = (err, data) => {
    setLoading(false);
  if (data && data.rows) {
    const dataSource = data?.rows?.map((row) => {
      console.log( data?.rows,"--- data?.rows---")
      let avatar, title, subtitle, group_id, user_id;
      if (row.groupChat) {
        group_id = row.group_id;
        avatar = generateAvatarLink(row.groupChat.chat_group_name);
        title = row.groupChat.chat_group_name;
        subtitle = `${row.groupChat.groupMember.length} members`;
      } else if (row.user) {
        user_id = row.chat_user_id;
        avatar = generateAvatarLink(
          `${row.user?.first_name}  ${row.user?.last_name}`
        );
        title = `${row.user?.first_name} ${row.user?.last_name}`;
        subtitle = row.user.email;
      }

      if (row.last_message) {
        let msg = row.last_message
        if (parseInt(localStorage.getItem('id')) === parseInt(msg.sender)) {
          subtitle = `You: `;
          if (msg.message_type === "text") {
            subtitle += `${msg.message}`;
          } else if (msg.message_type === "image") {
            subtitle += "sent image";
          } else if (msg.message_type === "video") {
            subtitle += "sent video";
          } else if (msg.message_type === "file") {
            subtitle += "sent file";
          }
          else if (msg.message_type === "audio") {
            subtitle += "sent audio";
          }
        } else if (msg.user?.first_name && msg.user?.last_name) {
          subtitle = `${msg.user?.first_name} : `;
          if (msg.message_type === "text") {
            subtitle += `${msg.message}`;
          } else if (msg.message_type === "image") {
            subtitle += "sent image";
          } else if (msg.message_type === "video") {
            subtitle += "sent video";
          } else if (msg.message_type === "file") {
            subtitle += "sent file";
          }else if (msg.message_type === "audio") {
            subtitle += "sent audio";
          }
        }
      }
      return {
        associated_chat_id: row?.associated_chat_id,
        replyButton: true,
        avatar,
        alt: title,
        title,
        subtitle,
        user_id,
        group_id,
        date: new Date(row.updatedAt),
        userStatus: row.userStatus,
        unread: row.unread_message_count || 0,
      };
    });
    // if (Object.keys(user).length === 0) {
    //   loadMessages(dataSource[0]);
    //   setUser(dataSource[0]);
    //   selectedUsers = dataSource[0];
    //   dataSource[0]["className"] = "current-chat";
    // } else {
    //   const updatedUserList = dataSource.map((item) => {
    //     if (item.associated_chat_id === selectedUsers.associated_chat_id) {
    //       item.className = "current-chat";
    //     } else {
    //       item.className = ""; 
    //     }
    //     return item;
    //   });

    //   setUserList(updatedUserList);
    //   return;
    // }
    setUserList(dataSource);
  }
};

  const downloadHandler = () => {
    console.log("clicked")
  }
const fetchAllUserList = () => {
  allUserList()
    .then((data) => {
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
            userStatus: row.userStatus,
          };
        });
        console.log(dataSource,"---user list")
        setUsersList(dataSource);
      }
    })
    .catch((err) => console.log(err));
};

const fetchAllGroupList =()=>{
  allGroupList().then((data) => {
    if (data && data.data) {
      const dataSource = data?.data?.map((row) => {
        return {
          title: row.chat_group_name,
          username: row.chat_group_name,
          group_id: row.chat_group_id,
          subtitle: row.chat_group_desc,
          avatarFlexible: true,
          date: row.createdAt,
          avatar: generateAvatarLink(row.chat_group_name),
          userStatus: null 
        };
      });
      setGroupList(dataSource);
    }
  })
  .catch((err) => console.log(err));
};

const onHandleSearchChange = (value) => {
  setSearchValue(value.target.value);
  const searchQuery = value.target.value.toLowerCase();
  const filteredUsers = usersList?.filter((user) => {
    return (
      user.username.toLowerCase().includes(searchQuery) ||
      user.title.toLowerCase().includes(searchQuery)
    );
  });
  const filteredGroup = groupList?.filter((user) => {
    return (
      user.username.toLowerCase().includes(searchQuery) ||
      user.title.toLowerCase().includes(searchQuery)
    );
  });
  setFilteredUsers([...filteredUsers , ...filteredGroup]);
};

const error = (err, data) => {
  console.log("Exception log", data);
};

const messageListing = (err, data) => {
  if (data && data.rows) {
    let status = null;
    if (message.fromSelf) {
      if (message.status === "sent") {
        status = "sent";
      } else if (message.status === "seen") {
        status = "read";
      } else {
        status = "received";
      }
    }
    const newMessages = data.rows
      ?.map((message) => ({
        id: message.id,
        avatar: message.fromSelf
          ? generateAvatarLink(
              message.user?.first_name + " " + message.user?.last_name
            )
          : user?.avatar,
        avatarType: "circle",
        title: message.fromSelf
          ? "You"
          : message.user?.first_name + " " + message.user?.last_name,
        position: message.fromSelf ? "right" : "left",
        fromSelf: message.fromSelf,
        type: message.message_type === "image" ? "photo" : message.message_type,
        text:
          message.message_type === "text"
            ? message.message
            : message.message_type === "file"
            ? message.meta.name || "File"
            : null,
        senderId: message.sender,
        unreadMessage:
          message.status === "sent" && !message.fromSelf ? true : false,
        status:
          message.status && message.fromSelf === "sent"
            ? "sent"
            : message.status && message.fromSelf === "seen"
            ? "read"
            : message.fromSelf ? "received" : null,
        data: {
          videoURL: message.message,
          audioURL: message.message,
          uri: message.message,
          size: message.meta.size || 10,
          status: {
            download: message.message_type === "file" ? false : true,

            click: message.message_type === "file" ? false : true,
          },
          width: 300,
          height: 300,
        },
        date: new Date(message.sent_at),
      }))
      .reverse();
    if (newMessages.length > 0) {
      setMessageList([...newMessages]);
    }
  }
};
  const loadMessages = (e, page = 1) => {
  if (e?.user_id) {
    socketEmitter(SOCKET_EVENT_NAME.CHAT_LISTING, {
      id: e?.user_id,
      page: page,
      pageSize: 10000,
    });
  } else {
    socketEmitter(SOCKET_EVENT_NAME.CHAT_LISTING, {
      group_id: e?.group_id,
      page: page,
      pageSize: 10000,
    });
  }
};
useEffect(() => {
  const ids = messageList.filter((i) => !i.fromSelf).map((i) => i.id);
  if (ids.length > 0) {
     socketEmitter(SOCKET_EVENT_NAME.SEEN_MESSAGES, {
       ids: ids,
     });
  }
  
}, [messageList])
const onChatListClick = async (e) => {
  setSearchValue("");
  selectedUsers = e;
  if (
    (e.user_id === user?.user_id && e.user_id && user?.user_id) ||
    (e.group_id === user?.group_id && e.group_id && user?.group_id)
  ) {
    return;
  }
  let updatedUserList = userList.map((item) => {
    if (e.user_id && item.user_id === e.user_id) {
      return { ...item, unread: 0, className: "current-chat" };
    } else if (e.group_id && item.group_id === e.group_id) {
      return { ...item, unread: 0, className: "current-chat" };
    } else {
      return { ...item, className: "" };
    }
  });

  setUserList(updatedUserList);
  let clickerUserList;
  if (e.user_id) {
    clickerUserList = userList.filter((item) => item.user_id === e.user_id);
  } else {
    clickerUserList = userList.filter((item) => item.group_id === e.group_id);
  }
  setInputValue("");
  loadMessages(e);
  setMessageList([]);
  setCurrentPage(1);

  if (clickerUserList.length > 0) {
    setUser(...clickerUserList);
    return;
  }
  setUser(e);
};
const onMessageScroll = (e) => {
  const element = e.target;
  if (element.scrollTop === 0) {
    loadMessages(user, currentPage + 1);
    setCurrentPage(currentPage + 1);
  }
};
  
  const preSignedUrl = async (message) => {
    return fileUpload({ message })
      .then((data) => {
        if (data.success) {
          const { url } = data.data;
          return url;
        }
      })
      .catch((error) => {
        message.error(error?.message ? error.message : "failed");
      });
  };

const sendMessage = async (message, message_type, meta = {}) => {
  socketEmitter(SOCKET_EVENT_NAME.SEND_NEW_MESSAGE, {
    to: user.user_id,
    group_id: user.group_id,
    message: message,
    message_type: message_type,
    meta: meta,
  });
  if (user) loadMessages(user);
  setInputValue("");
  if (message_type !== "text") {
    return;
  }
  setMessageList((prevMessageList) => [
    {
      avatar: generateAvatarLink(
        currentUser?.first_name + " " + currentUser?.last_name
      ),
      avatarType: "circle",
      title: "You",
      position: "right",
      type: message_type === "image" ? "photo" : message_type,
      text: message_type === "text" ? message : undefined,
      senderId: currentUser.user_id,
      unreadMessage: false,
      data: {
        videoURL: message,
        audioURL: message,
        uri: message,
        size: meta.size || 10,
        status: { download: true },
        width: 300,
        height: 300,
      },
      date: new Date(),
    },
    ...prevMessageList,
  ]);
};

const generateURLForChatFile = (fileDetails, message_type) => {
  if (message_type) {
    return `chat/${currentUser.user_id}/${fileDetails.type || "file"
      }/${moment().format("DD-MM-YYYY")}/${Date.now()}_audio.mp3`;
  }
  return `chat/${currentUser.user_id}/${fileDetails.type || "file"
    }/${moment().format("DD-MM-YYYY")}/${Date.now()}_${fileDetails?.name}`;
};
const uploadFiletoS3 = async (file, message_type) => {
  const path = generateURLForChatFile(file, message_type);
  return fileUpload({ path })
    .then((data) => {
      if (data.success) {
        const { url } = data.data;
        var myHeaders = new Headers();
        myHeaders.append(
          "Content-Type",
          file?.type || message_type || "file"
        );
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
};
return (
  <div style={{ height: "100%" }}>
    {loading ? (
      <Spin className="spin-loder" tip="Loading..."></Spin>
    ) : (
      <div
        style={{
          display: "flex",
          height: "100%",
          border: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{ borderRight: "1px solid rgb(226 224 224)", width: "300px" }}
        >
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
          <ChatList
            onChatListClick={onChatListClick}
            userList={userList}
            filteredUsers={filteredUsers}
            searchValue={searchValue}
          />
        </div>
        {user ? (
          <div style={{ width: "100%" }}>
            <Navbar
              type="light"
              left={
                <div>
                  <div>
                    <Avatar src={user?.avatar} type="circle" />
                  </div>
                  <div className="chatInfoArea">
                    <label className="nameLabel">{user?.title}</label>
                    <label className="statusLabel">
                      {user.userStatus
                        ? user?.userStatus?.is_online
                          ? "Online"
                          : user.userStatus.last_online
                          ? "Offline"
                          : "Offline"
                        : user.group_id
                        ? ""
                        : "Offline"}
                    </label>
                  </div>
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
              messageList={messageList}
              messageListReferance={messageListReferance}
              onScrollEvent={onMessageScroll}
            />
            <InputBox
              inputValue={inputValue}
              setInputValue={setInputValue}
              sendMessage={sendMessage}
              uploadFileToS3={uploadFiletoS3}
            />
          </div>
        ) : (
          <div className="engageScreen">
            <div className="container">
              <div className="image">
                <WechatOutlined style={{ color: "gray", fontSize: "72px" }} />
              </div>
              <h1>Innobayt Web Chat</h1>
              <p>
                Send and receive messages to friends and groups effortlessly.
              </p>
              <p className="chatfooter">
                🔒 Your personal messages are end-to-end encrypted
              </p>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);
};

export default ChatApp;
