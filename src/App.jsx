import React, { useEffect, useState } from "react";
import Routes from "./routes";
import { Spin, notification } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { BaseLayout } from "./components/common";
import { operations } from "./redux/Main";
import { getUserDetails } from "./services";
import { onMessage } from "firebase/messaging";
import { messaging } from "./utils/firebase";

function App(props) {
  const user = getUserDetails()
  const isAuthenticated = user && user?.isAuthenticated || false
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  const requestNotificationPermission = async () => {
    try {
      if (!("Notification" in window)) {
        console.log("notification not allowed")
      } else {
        if (Notification.permission === "granted") {
          onMessage(messaging, (payload) => {
            api.info({
              message: payload?.notification?.title,
              description:
                payload?.notification?.body,
            });
          });
        }
        else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              window.location.reload()
            }
          });
        }
      }
    } catch (err) {
      console.log("Notification permission request failed", err);
    }

  }



  return (
    <>
      {contextHolder}
      {isAuthenticated ? (
        <Spin spinning={user?.loading}>
          <BaseLayout
            {...props}
            content={
              <React.Suspense fallback={<Spin />}>
                <Routes  {...props} />
              </React.Suspense>
            }
          ></BaseLayout>
        </Spin>
      ) : (
        <React.Suspense fallback={<Spin />}>
          <Routes  {...props} />
        </React.Suspense>
      )}
    </>
  );
}

function mapStateToProps(state, props) {
  return {
    auth: state.mainReducers?.auth,
    permissions: state.mainReducers?.permissions,
    lookup: state.mainReducers?.lookup,
    project: state.mainReducers?.project,
    recentProjects: state.mainReducers?.recentProjects
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(operations, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
