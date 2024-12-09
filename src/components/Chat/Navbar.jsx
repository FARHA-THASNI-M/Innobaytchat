import { MoreOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";
import { Dropdown, Navbar as ReactNavbar } from "react-chat-elements";
import "react-chat-elements/dist/main.css";

const Navbar = ({ user, onDropdownMenuClick }) => {
  console.log(user, "sssss");
  return (
    <>
      {user ? (
        <ReactNavbar
          type="light"
          left={
            <div>
              <div>
                <Avatar src={user?.avatar} type="circle" />
              </div>
              <div>{user?.title}</div>
            </div>
          }
          right={
            <Dropdown
              animationType="fade"
              animationPosition="norteast"
              buttonProps={{
                icon: { float: "left", size: 15, component: <MoreOutlined /> },
              }}
              items={[{ text: "lorem" }, { text: "ipsum" }, { text: "dolor" }]}
            />
          }
        />
      ) : (
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
      )}
    </>
  );
};

export default Navbar;
