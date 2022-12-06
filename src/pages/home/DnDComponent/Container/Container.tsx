import React, { forwardRef } from "react";
import classNames from "classnames";

import { Handle, Remove } from "../Item";

import styles from "./Container.module.scss";
import More from "../../Icons/More";
import Plus from "../../Icons/Plus";
import { Button, Form, Input, Modal, Select } from "antd";
import { Content } from "antd/es/layout/layout";
import { trpc } from "../../../../utils/trpc";

export interface Props {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
  id: string;
}

const ContainerElement = (
  {
    children,
    columns = 1,
    horizontal,
    hover,
    onClick,
    label,
    placeholder,
    style,
    scrollable,
    shadow,
    unstyled,
    id,
    ...props
  }: Props,
  ref: any
) => {
  const [modal, context] = Modal.useModal();
  const { data: categories } = trpc.category.getAll.useQuery();
  const { data: user } = trpc.user.getAll.useQuery();
  const [form] = Form.useForm();
  const addItems = trpc.item.add.useMutation({
    onSuccess: (res) => {
      console.log(res);
      utils.item.invalidate();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const utils = trpc.useContext();

  const handleAddItems = () => {
    const addModal = modal.confirm({
      title: "Add Item",
      content: (
        <div>
          <Form
            onFinish={(values) => {
              console.log(values);
              addItems.mutate({
                ...values,
                status: id,
              });
              addModal.destroy();
            }}
            form={form}
          >
            <Form.Item label="title" name="title">
              <Input />
            </Form.Item>
            <Form.Item label="description" name="description">
              <Input />
            </Form.Item>
            <Form.Item label="category" name="category">
              <Select
                options={categories?.map((item) => {
                  return { label: item.name, value: item.id };
                })}
              />
            </Form.Item>
            <Form.Item label="user" name="users">
              <Select
                mode="multiple"
                options={user?.map((item) => {
                  return { label: item.name, value: item.id };
                })}
              />
            </Form.Item>
          </Form>
        </div>
      ),
      onOk: () => form.submit(),
    });
  };
  return (
    <div
      {...props}
      ref={ref}
      style={
        {
          ...style,
          "--columns": columns,
        } as React.CSSProperties
      }
      className={classNames(
        styles.Container,
        unstyled && styles.unstyled,
        horizontal && styles.horizontal,
        hover && styles.hover,
        placeholder && styles.placeholder,
        scrollable && styles.scrollable,
        shadow && styles.shadow
      )}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
    >
      {context}
      {label ? (
        <div className={styles.Header}>
          {label}
          <div className={styles.Actions}>
            <div onClick={handleAddItems}>
              <Plus />
            </div>
            <More />
          </div>
        </div>
      ) : null}
      {placeholder ? (
        children
      ) : (
        <ul style={{ margin: "0", padding: "20px", display: "block" }}>
          {children}
        </ul>
      )}
    </div>
  );
};

export const Container = forwardRef(ContainerElement);
