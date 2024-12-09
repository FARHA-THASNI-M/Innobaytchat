import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Paperclip } from "react-feather";
import {
  UserOutlined,
} from "@ant-design/icons";
import Dropdown from "../Dropdown/Dropdown";
import Tag from "../Tags/Tag";
import "./Card.css";
import CardDetails from "./CardDetails/CardDetails";
import {format} from 'date-fns'
import ViewTask from "../../../../components/Task/ViewTask";
import {Layout, Modal, Tooltip, Avatar} from 'antd'
const { Content } = Layout;
import { getUserShortName } from "../../../../services";

const Card = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  const refetchData = () => {
    props.refetchData()
    setShowTaskModal(false)
  }

  const extractTextFromHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent != null ? doc.body.textContent : "";
  }

  return (
    <Content>
    { <Modal open={showTaskModal} width={1080} onCancel={refetchData} footer={null}>
            <ViewTask project={props.project} task={props.card} projectUsers={props.projectUsers} categories={props.categories} fetchData={refetchData} setShowTaskModal={props.setShowTaskModal} priorityList={props.priorityList} phases={props.phases} isSubtask={true} taskStatusList={props.taskStatusList} isModal={true} />
    </Modal>}
    <Draggable
      key={props.id.toString()}
      draggableId={props.id.toString()}
      index={props.index}
    >
      {(provided) => (
        <>
          <div
            className="custom__card"
            onClick={() => {
              setShowTaskModal(!showTaskModal);
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="card__text">
              <div className="flex flex-row">
                <img src={"/assets/images/icons/board-task-icon.svg"} />
                <div className="m-6 p-2 w-20 flex items-center justify-center gap-1 rounded-md bg-[#E5ECF6] h-5">subtask</div>
              </div>
              <p className="m-0 font-poppins text-base font-medium leading-6 tracking-[0.3px] text-left">{props.title}</p>
              {/* <p className="m-0 font-poppins text-sm font-normal leading-5 tracking-wider text-left">{extractTextFromHTML(props.description)}</p> */}
            </div>

            <div className="card__footer">
              <div className="flex mt-2">
                <img src="/assets/images/icons/ClockCounterClockwise.svg" />
                <div className="flex ml-2 justify-between">

                <p>{format(props?.card?.task_start_date, 'LLL')} {format(props?.card?.task_start_date, 'd')} - </p>
                <p className="ml-1"> {format(props?.card?.task_end_date, 'LLL')} {format(props?.card?.task_end_date, 'd')} </p>
                </div>
              </div>
              <div className="flex mt-2">
                <Paperclip /> &nbsp; <>
                  {props?.card?.ref_attachment?.length}
                </> &nbsp; &nbsp;
                {props?.card?.assigned ? 
            <Tooltip title={props?.card?.assigned?.first_name + " " + props?.card?.assigned?.last_name}>
              <Avatar size={'small'}>{getUserShortName(props?.card?.assigned?.first_name, props?.card?.assigned?.last_name)}</Avatar>
            </Tooltip> : 
            <Avatar size={'small'} icon={<UserOutlined />}></Avatar>}
                  
              </div>
            </div>

            {provided.placeholder}
          </div>
        </>
      )}
    </Draggable>
    </Content>
  );
};

export default Card;
