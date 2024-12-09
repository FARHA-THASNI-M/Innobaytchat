import { Layout, Result, Button } from "antd";
const { Content } = Layout;

const InternalServerError = () => {
  return (
    <Content>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary">Back</Button>}
      />
    </Content>
  );
};
export default InternalServerError;
