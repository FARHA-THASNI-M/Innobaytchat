import React, { useEffect, useState } from "react";
import { Layout, Card, Col, Row, Statistic } from "antd";
import styles from "../../../styles/_dashboard.module.css";
const { Content } = Layout;
const Tiles = ({ tileData }) => {
  return (
    <Content>
      <Row
        gutter={16}
        style={{
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          marginBottom: "5px",
        }}
      >
        {tileData?.map((data, index) => (
          <Col key={index}>
            <Card className={styles.cardTIle}>
              <p className={styles.cardTitle}>{data.value}</p>
              <p className={styles.cardBody}>{data.title}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default Tiles;
