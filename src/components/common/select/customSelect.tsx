import React, { ReactNode } from "react";
import { Select, SelectProps } from "antd";
import styled from "styled-components";

type CustomSelectProps = SelectProps & {
  prefixIcon?: ReactNode;
};




const CustomSelect = ({ prefixIcon, children, ...rest }: CustomSelectProps) => {
  const SelectWrapper = styled.div`
  position: relative;

  .prefix-icon-wrapper {
    position: absolute;
    z-index: 1;
    width: 3rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

 && .ant-select .ant-select-selector {
    padding-left: calc(3rem - 8px);
    border:none;
    box-shadow:none;
  }
`;
  return (
    <SelectWrapper>
      {prefixIcon && <div className="prefix-icon-wrapper">{prefixIcon}</div>}
      <Select {...rest}>{children}</Select>
    </SelectWrapper>
  );
};

export default CustomSelect;
