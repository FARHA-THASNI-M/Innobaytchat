import { Descriptions, Popover, Typography, message } from "antd";
import { WeeklyCalendar } from "antd-weekly-calendar";
import moment from "moment";
import { useEffect, useState } from "react";
import { getProject } from "../../services";
import { getProjectAssignedTasks, getProjectMeetings } from "./Calender.service";
import './main.css';
const { Text } = Typography;

function MyCalendar() {
  const project = getProject()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCalenderDetails()

  }, [])

  const getCalenderDetails = async () => {
    setEvents([])
    setLoading(true)
    getProjectMeetings(project.project_id).then((data) => {
      if (data && data.success) {
        formatData(data.data)
        getAssignedTaskList()
      } else {
        message.error(data?.message ? data.message : "failed");
      }
    }).catch((error) => {
      message.error(error?.message ? error.message : "failed");
    }).finally(() => {
      setLoading(false)
    })
  }

  const getAssignedTaskList = async () => {
    setLoading(true)
    getProjectAssignedTasks(project.project_id).then((data) => {
      if (data && data.success) {
        formatTaskData(data.data)
      } else {
        message.error(data?.message ? data.message : "failed");
      }
    }).catch((error) => {
      message.error(error?.message ? error.message : "failed");
    }).finally(() => {
      setLoading(false)
    })
  }

  const formatTaskData = (data) => {
    const eventData = []
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        const { task_end_date, task_name, task_number, task_start_date } = data[i]
        const taskStartDate = moment(task_start_date)
        const taskDueDate = moment(task_end_date)
        eventData.push({
          startTime: new Date(taskDueDate.year(), taskDueDate.month(), taskDueDate.date(), 9, 0, 0),
          endTime: new Date(taskDueDate.year(), taskDueDate.month(), taskDueDate.date(), 10, 0, 0),
          title: <Popover content={<>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Task Start Date">{taskStartDate.format("YYYY-MM-DD")}</Descriptions.Item>
              <Descriptions.Item label="Task End Date">{taskDueDate.format("YYYY-MM-DD")}</Descriptions.Item>
            </Descriptions>
          </>} title={task_number + " " + task_name}>
            Task: {task_number}
          </Popover>,
          backgroundColor: "orange"
        })
      }
    }
    setEvents((previous) => ([...previous, ...eventData]))
  }


  const formatData = (data) => {
    const eventData = []
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        const { start_date, end_date, start_time, end_time, meeting_name, description, recurrence, recurrence_rule } = data[i]
        let rule = []
        if (recurrence_rule) {
          rule = recurrence_rule.split(",").map(Number);
        }
        const result = formatAsCalenderEvent(moment(start_date), moment(end_date), start_time, end_time, meeting_name, description, recurrence, rule)
        eventData.push(...result)
      }
      setEvents((previous) => ([...previous, ...eventData]))
    }
  }

  const formatAsCalenderEvent = (start, end, startTime, endTime, title, description, recurrence, rule) => {
    let days = [];
    const startHour = parseInt(startTime?.split(":")[0])
    const startMin = parseInt(startTime?.split(":")[1])
    const endHour = parseInt(endTime?.split(":")[0])
    const endMin = parseInt(endTime?.split(":")[1])
    while (start.isSameOrBefore(end)) {
      if (recurrence === 'Repeat weekly' && rule.length) {
        if (rule.includes(start.day())) {
          const year = start.year();
          const month = start.month();
          const date = start.date();
          const startTime = moment()
            .set('year', year)
            .set('month', month)
            .set('date', date)
            .set('hour', startHour)
            .set('minute', startMin);
          const endTime = moment()
            .set('year', year)
            .set('month', month)
            .set('date', date)
            .set('hour', endHour)
            .set('minute', endMin);
          days.push({
            startTime: new Date(year, month, date, startHour, startMin, 0),
            endTime: new Date(year, month, date, endHour, endMin, 0),
            title: <Popover content={<>
              <Text type="secondary">{description}</Text>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Start Time">{startTime.format("YYYY-MM-DD HH:mm")}</Descriptions.Item>
                <Descriptions.Item label="End Time">{endTime.format("YYYY-MM-DD HH:mm")}</Descriptions.Item>
                <Descriptions.Item label="Duration">{endTime.diff(startTime, 'minutes')} mins</Descriptions.Item>
              </Descriptions>
            </>} title={title}>
            <p style={{marginTop:"-10px"}}>{title}</p>
            </Popover>,
          })
        }
        start.add(1, "days")
      } else {
        const year = start.year();
        const month = start.month();
        const date = start.date();
        const startTime = moment()
          .set('year', year)
          .set('month', month)
          .set('date', date)
          .set('hour', startHour)
          .set('minute', startMin);
        const endTime = moment()
          .set('year', year)
          .set('month', month)
          .set('date', date)
          .set('hour', endHour)
          .set('minute', endMin);
        days.push({
          startTime: new Date(year, month, date, startHour, startMin, 0),
          endTime: new Date(year, month, date, endHour, endMin, 0),
          title: <Popover content={<>
            <Text type="secondary">{description}</Text>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Start Time">{startTime.format("YYYY-MM-DD HH:mm")}</Descriptions.Item>
              <Descriptions.Item label="End Time">{endTime.format("YYYY-MM-DD HH:mm")}</Descriptions.Item>
              <Descriptions.Item label="Duration">{endTime.diff(startTime, 'minutes')} mins</Descriptions.Item>
            </Descriptions>
          </>} title={title}>
            <p style={{marginTop:"-10px"}}> {title}</p>
          </Popover>,
        })
        start.add(1, "days")
      }
    }
    return days;
  }

  return (
    <>
      <div className="calendar-view">
        <WeeklyCalendar
          events={events}
          weekends={true}
        />
      </div>
    </>
  );
}
export default MyCalendar;
