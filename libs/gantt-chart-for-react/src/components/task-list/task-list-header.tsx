import React from "react";
import styles from "./task-list-header.module.css";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight, fontFamily, fontSize, rowWidth }) => {
  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 2,
        }}
      >
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;Tasks
        </div>
        
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: "100px",
            maxWidth: "100px",
          }}
        >
          &nbsp;Start Date
        </div>
        
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: "100px",
            maxWidth: "100px"
          }}
        >
          &nbsp;End Date
        </div>
      </div>
    </div>
  );
};
