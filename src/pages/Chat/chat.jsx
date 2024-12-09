import React, { Component, useEffect, useState } from "react";
import {
  UIKitProvider,
  Chat,
  ConversationList,
  useClient,
  rootStore,
} from "agora-chat-uikit";
import "agora-chat-uikit/style.css";
import AC from "agora-chat";
import {
  getAgoraAccessToken,
  userprofile,
  agoraUsersList,
  fileStore,
} from "./chat.services";

const ChatApp = () => {
  const [user, setUser] = useState(localStorage.getItem("username"));
  const [agoraToken, setAgoraToken] = useState(null);
  const [userList, setUserList] = useState([]);
  const conn = new AC.connection({
    appKey: "411107532#1323381",
    debug: false,
  });
  const connectionSetup = async (token) => {
    const options = {
      user: user,
      agoraToken: token,
    };
    await conn.open(options);

    let limit = 20,
      cursor = undefined;
    let option = {
      pageNum: 1,
      pageSize: 1000,
      limit: limit,
      cursor: cursor,
    };
    conn.getJoinedGroups(option).then((res) => {
      res.data.forEach((conversationData) => {
        const conversation = {
          chatType: "groupChat",
          groupId: conversationData.groupid,
          conversationId: conversationData.groupid,
          name: conversationData.groupname,
          disabled: conversationData.disabled === "true" ? true : false,
          lastMessage: {},
        };
        rootStore.conversationStore.addConversation(conversation);
      });
    });

    conn.addEventHandler("eventName", {
      onFileMessage: function (message) {
        if (user !== message.from) {
          return;
        }

        const fileBody = {
          file_name: message.filename,
          file_type: message.type,
          downloadLink: true,
          group_id: message.to,
          url: message.url,
          sharedBy: message.from,
          fileSize: message.file_length.toString(),
        };
        fileStore(fileBody)
          .then((res) => {})
          .catch((error) => console.log("err", error));
      },
    });
  };

  const client = useClient();
  useEffect(() => {
    userInformation();
    getAgoraAccessToken()
      .then((data) => {
        if (data && data.data) {
          setAgoraToken(data.data.agora_token);
          const agoraToken = data.data.agora_token;
          console.log(client, "agoraToken");
          connectionSetup(agoraToken);

          client &&
            client
              .open({
                user,
                agoraToken,
              })
              .then((res) => {
                getUsersListing();
                console.log("get token success", res);
              });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [client]);
  const getUsersListing = async () => {
    agoraUsersList()
      .then((data) => {
        if (data && data.data) {
          setUserList(data.data?.entities);
          data.data?.entities.forEach((conversationData) => {
            const conversation = {
              chatType: "singleChat",
              conversationId: conversationData.username?.toLowerCase(),
              name: conversationData.username?.toLowerCase(),
              disabled: conversationData.disabled === "true" ? true : false,
              lastMessage: {},
            };
            rootStore.conversationStore.addConversation(conversation);
          });
        }
      })
      .catch((error) => {
        console.log("error comming ", error);
      });
  };
  const userInformation = () => {
    userprofile(localStorage.getItem("id")).then((data) => {
      if (data && data.data) {
        console.log(data.data.username, "data.data.username");
        localStorage.setItem("username", data.data.username);
        setUser(data.data.username);
      }
    });
  };

  const searchUsersByPattern = (inputString) => {
    return userList.filter((record) => record.username.includes(inputString));
  };
  const onSearch = async (e) => {
    const foundUser = searchUsersByPattern(e.target.value);
    if (foundUser) {
      console.log(foundUser);
      rootStore.conversationStore.setSearchList(foundUser);
      console.log();
    } else {
      console.log("User not found.");
    }
  };
  const onSearchE = async (e) => {
    console.log(e);
    return [userList];
  };
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ borderRight: "1px solid #fff" }}>
        <ConversationList onSearch={onSearch} style={{ width: "300px" }} />
      </div>
      <div style={{ width: "100%" }}>
        <Chat />
      </div>
    </div>
  );
};

export default ChatApp;
