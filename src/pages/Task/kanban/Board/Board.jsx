import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import "./Board.css";
import Dropdown from "../Dropdown/Dropdown";
import { Droppable } from "react-beautiful-dnd";
import { getProjectUsersData, getProjectPhaseData, getProjectCategoriesData, getPriority, getPermissions } from "../../../../services";
import { PlusSquare } from "react-feather";
import InfiniteScroll from 'react-infinite-scroll-component';
import CreateTaskModal from "../../../../components/Task/CreateTask";
import { PERMISSIONS } from "../../../../constants/permissions";

export default function Board(props) {
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [projectUsers, setProjectUsers] = useState([])
  const [categories, setCategories] = useState([]);
  const [phases, setPhases] = useState([])
  const priorityList = getPriority();
  const permissions = getPermissions()
  useEffect(() => {
    getUsers()
    getProjectCategoryList()
    getPhases()
  }, [])

  const getProjectCategoryList = async () => {
    const data = await getProjectCategoriesData(props.project.project_id)
    setCategories(data)
  }


  const getPhases = async () => {
    const data = await getProjectPhaseData(props.project.project_id)
    setPhases(data)
  }

  const getUsers = async () => {
    const users = await getProjectUsersData(props.project.project_id)
    setProjectUsers(users)
  }
  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.code === "Enter") setShow(false);
    });
    return () => {
      document.removeEventListener("keypress", (e) => {
        if (e.code === "Enter") setShow(false);
      });
    };
  });
  return (
    <div id={`scrollableDiv-${props.id}`} className="w-[256px] max-w-[256px] h-[400px] gap-y-17 bg-[#FAFBFC] overflow-y-auto rounded-tl-10" style={{ marginRight: '12px' }}>
      <InfiniteScroll
        dataLength={props.count || 0}
        scrollableTarget={`scrollableDiv-${props.id}`}
        next={() => {
          props.setPage(prev => {
            return prev + 1
          })
        }}
        hasMore={props?.count >= props?.card?.length}
      >

        <div className="">
          {show ? (
            <div>
              <input
                className="title__input"
                type={"text"}
                defaultValue={props.name}
                onChange={(e) => {
                  props.setName(e.target.value, props.id);
                }}
              />
            </div>
          ) : (
            <div className="flex justify-between pb-23 gap-0 border-b-3 border-blue-500 text-black" style={{
              borderBottom: `3px solid ${props.color}`
            }}>
              <div className="flex items-center">

                <div className="rounded-md" style={{
                  width: '8.26px',
                  height: '8px',
                  marginLeft: '12px',
                  top: '8px',
                  gap: '0px',
                  backgroundColor: props.color
                }} ></div>
                <p
                  onClick={() => {
                    setShow(true);
                  }}
                  className="font-poppins pl-4 text-base font-medium leading-6 text-left"
                >
                  {props?.name || "Name of Board"}
                </p>
                <span tyle={{
                  width: '8.26px',
                  height: '8px',
                  marginLeft: '12px',
                  top: '8px',
                  gap: '0px',
                }} className="total__cards">{props.count}</span>
              </div>
              <div className="flex items-center mr-2">
                {props.id === 'NOT_STARTED' && permissions.includes(PERMISSIONS.TASK_CREATE) &&<PlusSquare onClick={() => { props.setSelectedTask(props.task); props.setSubTaskModalVisible(true) }} />}

              </div>
            </div>
          )}
          <div
            onClick={() => {
              setDropdown(true);
            }}
          >
            {dropdown && (
              <Dropdown
                class="board__dropdown"
                onClose={() => {
                  setDropdown(false);
                }}
              >
                <p onClick={() => props.removeBoard(props.id)}>Delete Board</p>
              </Dropdown>
            )}
          </div>
        </div>
        <Droppable droppableId={props.id.toString()}>
          {(provided) => (
            <div
              className="board__cards"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {props.card?.map((item, index) => (
                <Card
                  bid={props.id}
                  id={item.task_id}
                  index={index}
                  key={item.task_id}
                  description={item.description}
                  title={item.task_name}
                  tags={item?.tags}
                  updateCard={props.updateCard}
                  removeCard={props.removeCard}
                  card={item}
                  project={props.project}
                  projectUsers={projectUsers}
                  categories={categories}
                  phases={phases}
                  priorityList={priorityList}
                  taskStatusList={props.taskStatus}
                  setShowTaskModal={props.setShowTaskModal}
                  refetchData={props.refetchData}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </InfiniteScroll>
    </div>
  );
}
