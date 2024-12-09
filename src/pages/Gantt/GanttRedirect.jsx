import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProject, getUsersData } from '../../services';
import { ROUTES } from '../../constants';
import * as jwt_decode from "jwt-decode";
import { getUserProfile } from '../Login/Login.service';
import { message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { operations } from '../../redux/Main';

const GanttRedirect = (props) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        // console.log('queryParams', queryParams)
        const projectId = queryParams.get('project_id');
        const token = queryParams.get('token');
        if (!projectId || !token) {
            // console.log('Project ID or token not found in URL');
            message.error("Project ID or token not found in URL");
        } else {

            // console.log('Project ID:', projectId);
            // console.log('Token:', token);
            const payload = jwt_decode.jwtDecode(token);
            // console.log("payload", payload);
            if (payload && payload?.id) {
                localStorage.setItem("id", payload?.id);
                localStorage.setItem("role_id", payload.role_id);
                localStorage.setItem("token", token);

                getUserProfile(payload?.id).then(async (data) => {
                    if (data && data.success) {
                        const result = data.data;
                        await props.setAuthUser({ isAuthenticated: true, user: result });
                        await props.setProject({
                          project_id: projectId,
                          is_mobile: true,
                        });
                        navigate(ROUTES.GANTT.PATH, {
                          state: {
                            project: { project_id: projectId },
                          },
                        });
                    } else {
                        message.error(data?.message ? data.message : "failed");
                    }
                }).catch((error) => {
                    message.error(error?.message ? error.message : "failed");
                })
            }
        }
    }, [location.search, navigate]);
    return null;
};

function mapStateToProps(state, props) {
    return {
        auth: state.mainReducers?.auth,
        permissions: state.mainReducers?.permissions,
        lookup: state.mainReducers?.lookup,
        project: state.mainReducers?.project
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(operations, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GanttRedirect);
