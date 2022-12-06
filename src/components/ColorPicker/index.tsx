import { Col, Input, Popover, Radio, Row, Space } from "antd";
import React, { useEffect } from "react";
import styles from "./index.module.scss";
import styled from "styled-components";
import type { Color } from "react-color";
import { SketchPicker } from "react-color";
import { DownOutlined } from "@ant-design/icons";
interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

export const hexRegex = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");

const ColorButton = styled.div<{ color: string }>`
  background: ${(props: { color: string }) => props.color};
  width: 30px;
  height: 30px;
  border-radius: 8px;
`;

const defaultColors = ["#3863ef", "#2B98F0", "#8CC152", "#FD9727"];

const CustomColorPicker: React.FC<Props> = (props) => {
  const { value, onChange } = props;
  const [customColor, setCustomColor] = React.useState<string | undefined>(
    value && !defaultColors.includes(value) ? value : undefined
  );

  const [error, setError] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    if (!value) {
      return setError("Vui lòng chọn màu sắc");
    }
    if (!hexRegex.test(value)) {
      return setError("Sai định dạng mã màu");
    }
    setCustomColor(value && !defaultColors.includes(value) ? value : undefined);
    return setError(undefined);
  }, [value]);

  const handleCustomColorChange = (color: Color) => {
    setCustomColor(color.toString());
    onChange?.(color.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    setCustomColor(inputValue);
    onChange?.(inputValue);
  };

  return (
    <Row>
      <Space align="start">
        <Space direction="vertical">
          <Input
            value={customColor}
            addonAfter={
              <Popover
                content={
                  <SketchPicker
                    color={customColor}
                    onChange={(e) => handleCustomColorChange(e.hex)}
                  />
                }
                trigger={["click"]}
              >
                <DownOutlined />
              </Popover>
            }
            onChange={handleInputChange}
            style={{ maxWidth: "150px" }}
            className={error ? styles["error-input"] : ""}
          />
          <span
            style={{
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              color: "#e2181a",
            }}
          >
            {error}
          </span>
        </Space>
      </Space>
    </Row>
  );
};

export default CustomColorPicker;
