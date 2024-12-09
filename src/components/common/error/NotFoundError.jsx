import { useNavigate } from 'react-router-dom';
import { Layout, Result, Button } from "antd";

const { Content } = Layout;


const NotFoundError = () => {
    const navigate = useNavigate();
  return (
    <Content>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={()=>navigate("/")}>Back</Button>}
      />
    </Content>
  );
};
export default NotFoundError;
