import { useEffect, useState } from "react";
import "./app.css";
import Board from "./Board/Board";
// import data from '../data'
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Editable from "./Editable/Editable";
import useLocalStorage from "use-local-storage";
import "./bootstrap.css";
import { fetchTaskByStatus, updateTask } from "../task.service";
import { useDispatch, useSelector } from 'react-redux'
import { setSubtaskSuccess, setSubtaskRequest } from '../../../redux/Main/actions/Tasks/task'
import { getTaskStatus } from "../../../services";

function Kanban({ item, project, setShowTaskModal, subTaskModalVisible, setSubTaskModalVisible, refetchData, setTaskModalVisible, setSelectedTask }) {
  const dispatch = useDispatch()
  const subtaskData = useSelector(state => state?.mainReducers?.taskByStatus);
  const taskStatus = getTaskStatus().sort((a, b) => a.order - b.order)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(100)
  function prepareBoardData() {
    let finalData = [];
    taskStatus.map(value => {
      let data = {
        id: value.key,
        boardName: value.value,
        color: value.meta_code,
        count: subtaskData[item?.task_id] ? subtaskData[item?.task_id][value.key]?.count : 0,
        card: subtaskData[item?.task_id] ? subtaskData[item?.task_id][value.key]?.rows : []
      }
      finalData.push(data)
    })
    return finalData
  }
  const [data, setData] = useState(prepareBoardData());

  const defaultDark = window.matchMedia(
    "(prefers-colors-scheme: dark)"
  ).matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const setName = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].boardName = title;
    setData(tempData);
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };

  useEffect(() => {
    if (item?.task_id) {
      fetchSubtaskData()
    }
  }, [item, page])

  const fetchSubtaskData = async () => {
    let promises = []
    taskStatus.map((val) => {
      promises.push(fetchSubtaskService({ id: item?.task_id, status: val.key }))
    })
    dispatch(setSubtaskRequest({ id: item?.task_id }))
    let finalData = await Promise.all(promises);
    let respData = {
      prepare: true
    }
    finalData.forEach(value => {
      respData[item?.task_id] = {
        ...respData[item?.task_id],
        ...value
      }
    })
    await dispatch(setSubtaskSuccess(respData))
    prepareBoardData()
  }

  useEffect(() => {
    if (!subtaskData.isLoading) {
      let finalData = prepareBoardData()
      setData(finalData)
    }
  }, [page, subtaskData])


  const fetchSubtaskService = async (data) => {

    let resp = await fetchTaskByStatus(data.id, data.status, 1, page * limit)
    let rows = resp.data.rows
    const uniqueValues = Object.values(rows.reduce((acc, obj) => {
      acc[obj.task_id] = obj;
      return acc;
    }, {}));

    let respData = {
      [data.status]: {
        ...resp.data,
        rows: uniqueValues
      }
    }

    return respData
  }
  // const dragCardInSameBoard = (source, destination) => {
  //   let tempData = Array.from(data);
  //   console.log("Data", tempData);
  //   const index = tempData.findIndex(
  //     (item) => item.id.toString() === source.droppableId
  //   );
  //   console.log(tempData[index], index);
  //   let [removedCard] = tempData[index].card.splice(source.index, 1);
  //   tempData[index].card.splice(destination.index, 0, removedCard);
  //   setData(tempData);
  // };

  const addCard = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].card.push({
      id: uuidv4(),
      title: title,
      tags: [],
      task: [],
    });
    setData(tempData);
  };

  const removeCard = (boardId, cardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].card.findIndex((item) => item.id === cardId);

    tempData[index].card.splice(cardIndex, 1);
    setData(tempData);
  };

  const addBoard = (title) => {
    const tempData = [...data];
    tempData.push({
      id: uuidv4(),
      boardName: title,
      card: [],
    });
    setData(tempData);
  };

  const removeBoard = (bid) => {
    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setData(tempData);
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    setData(dragCardInBoard(source, destination));
    let updatedReduxData = subtaskData[item.task_id][source.droppableId]
    updatedReduxData = updatedReduxData?.rows.filter(val => val.task_id != result.draggableId)
    dispatch(setSubtaskSuccess({
      [item.task_id]: {
        ...subtaskData[item.task_id],
        [source.droppableId]: {
          count: subtaskData[item.task_id][source.droppableId].count - 1,
          rows: updatedReduxData
        }
      }
    }))
    setPage(1)
    await updateTask(result.draggableId, { status: destination?.droppableId })
    await fetchSubtaskData()
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    setData(tempBoards);
  };

  useEffect(() => {
    localStorage.setItem("kanban-board", JSON.stringify(data));
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App" data-theme={theme}>
        <div className="app_outer pb-12">
          <div className="app_boards bg-white">
            {data.map((boardData) => (
              <Board
                key={boardData.id}
                id={boardData.id}
                name={boardData.boardName}
                card={boardData.card}
                color={boardData.color}
                setName={setName}
                addCard={addCard}
                removeCard={removeCard}
                removeBoard={removeBoard}
                updateCard={updateCard}
                project={project}
                taskStatus={taskStatus}
                setShowTaskModal={setShowTaskModal}
                refetchData={refetchData}
                setTaskModalVisible={setTaskModalVisible}
                count={boardData.count}
                setPage={setPage}
                project_category_id={item.project_category_id}
                task_number={item.task_number}
                parent_task={item.task_id}
                fetchSubtaskData={fetchSubtaskData}
                subTaskModalVisible={subTaskModalVisible}
                setSubTaskModalVisible={setSubTaskModalVisible}
                setSelectedTask={setSelectedTask}
                task={item}
              />
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Kanban;
