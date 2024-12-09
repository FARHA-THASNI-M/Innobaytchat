import React, { useEffect, useState } from "react";
import { Layout, Card, Col, Row, Statistic } from "antd";
import styles from "../../../styles/_dashboard.module.css";
const { Content } = Layout;
const TaskTiles = ({ tileData }) => {
  return (
    <Content>
      <Row gutter={16} style={{ marginBottom: "10px " }}>
        {tileData?.map((data, index) => (
          <Col key={index}>
            <Card
              className={styles.taskCardTile}
              style={{
                background: data.color,
                padding: "0px !important",
                marginBottom: "10px",
              }}
            >
              <p className={styles.taskCardTitle}>{data.value}</p>
              <p className={styles.taskCardBody}>{data.title}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default TaskTiles;
