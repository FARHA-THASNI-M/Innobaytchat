import { UserOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Layout, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COMPANY, ROUTES } from "../../constants";
import { cancelRequest } from "../../services/api";
import { getMetaData } from "../../utils";
import "./Login.css";
import { getLookup, getPermission, getUserProfile, login } from "./Login.service";
import { getRecentProjectsOfUser } from "../../services";
const { Header } = Layout;

const Login = (props) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)


    const onLogin = async (values) => {
        if (values) {
            const data = {
                login: values.username?.toLowerCase(),
                password: values.password,
            };
            setLoading(true)
            login(data)
                .then((result) => {
                    if (result && result.success && result?.data) {
                        props.setAuthUser({ isAuthenticated: true, user: result.data, path: ROUTES.CHAT.PATH, loading: true });
                        localStorage.setItem("token", result?.data?.token);
                        localStorage.setItem("refresh_token", result?.data?.refreshToken);
                        localStorage.setItem("id", result?.data?.user_id);
                        localStorage.setItem("role_id", result?.data?.role_id);
                        getUserData(result?.data?.user_id)
                        getRecentProjects()
                        navigate(ROUTES.CHAT.PATH);
                        lookupMaster()
                        permissions()
                    } else {
                        message.error(result?.message ? result.message : "failed");
                    }
                })
                .catch((error) => {
                    message.error(error?.message ? error.message : "failed");
                    setLoadingProp()
                }).finally(() => {
                    setLoading(false)
                    form.resetFields()
                })
        }
    };

    const setLoadingProp = (load = false) => {
        props.setAuthUser({ loading: load });
    }

    const getUserData = (id) => {
        getUserProfile(id).then((data) => {
            if (data && data.success) {
                const result = data.data;
                props.setAuthUser({ user: result });
            } else {
                message.error(data?.message ? data.message : "failed");
            }
        }).catch((error) => {
            message.error(error?.message ? error.message : "failed");
        })
    }

    const getRecentProjects = async () => {
        props.setRecentProject({ projects: await getRecentProjectsOfUser() });
    }

    useEffect(() => {
        getMeta()
        return () => {
            form.resetFields()
            cancelRequest();
        };
    }, [])

    const getMeta = async () => {
        try {
            const metaData = await getMetaData()
            localStorage.setItem('meta', JSON.stringify(metaData))
        } catch (error) {
            message.error(error?.message ? error.message : "failed");
        }
    }

    const permissions = () => {
        setLoading(true)
        getPermission()
            .then((data) => {
                if (data && data.success) {
                    const result = data.data;
                    props.setPermissions(result)
                    // props.setAuthUser({ isAuthenticated: true, permissions: result });
                    // setTimeout(() => {
                    //     navigate(ROUTES.PROJECTS.PATH);
                    // }, 500)
                    // awsHandler()

                } else {
                    message.error(data?.message ? data.message : "failed");
                }
            })
            .catch((error) => {
                message.error(error?.message ? error.message : "failed");
            }).finally(() => {
                setLoading(false);
                setLoadingProp()
            })
    };

    const lookupMaster = () => {
        setLoading(true)
        getLookup().then((data) => {
            if (data && data.success) {
                const result = data.data;
                props.setLookup(result);
            } else {
                message.error(data?.message ? data.message : "failed");
            }
        })
            .catch((error) => {
                message.error(error?.message ? error.message : "failed");
                setLoadingProp()
            }).finally(() => {
                setLoading(false)
            })
    }

    return (
        <Row>
            <Col flex={4}>
                <Header style={{ position: "fixed", width: "100%", background: 'white', borderBottom: 'none', margin: '20px' }}>
                    <div className="logo">
                        <img src={COMPANY.LOGO} alt="Logo" style={{ height: "40px" }} />
                    </div>
                </Header>
                <div className="login-container">
                    <Form
                        form={form}
                        className="login-form"
                        name="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onLogin}
                    >

                        <h1 style={{ textAlign: "center", fontSize: '44px' }}>Welcome Back</h1>
                        <p style={{ textAlign: "center", fontSize: '18px' }}>Login into your account</p>
                        <Form.Item
                            className="username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your username!",
                                },
                            ]}
                        >
                            <Input suffix={<UserOutlined />} placeholder="User name" disabled={loading} />
                        </Form.Item>
                        <Form.Item
                            className="password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password!",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Password" disabled={loading} autoComplete={'off'} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                // disabled={loading}
                                loading={loading}
                            >
                                Log In
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
            <Col flex={1}>
                <img src={"/assets/images/login/2.jpg"} width={'100%'} style={{ height: '100%', maxHeight: '100vh', overflow: 'hidden' }}></img>
            </Col>
        </Row>

    );
};

export default Login;
