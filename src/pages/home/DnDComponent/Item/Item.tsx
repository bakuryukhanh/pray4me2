import React, { useEffect } from "react";
import classNames from "classnames";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { Avatar, Button, Form, Input, Modal, Select, Tooltip } from "antd";

import { Handle, Remove } from "./components";

import styles from "./Item.module.scss";
import More from "../../Icons/More";
import cardStyles from "./card.module.scss";
import { ItemRouterOutput } from "../../../../server/trpc/router/item";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { trpc } from "../../../../utils/trpc";

export interface Props {
  renderProps?: ItemRouterOutput["getAll"][0];
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  handleProps?: any;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: React.ReactNode;
  onRemove?(): void;
  renderItem?(args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: React.Ref<HTMLElement>;
    style: React.CSSProperties | undefined;
    transform: Props["transform"];
    transition: Props["transition"];
    value: Props["value"];
  }): React.ReactElement;
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        index,
        listeners,
        sorting,
        style,
        transition,
        transform,
        wrapperStyle,
        renderProps,
        ...props
      },
      ref
    ) => {
      const utils = trpc.useContext();
      const [modal, contextHolder] = Modal.useModal();
      const [form] = Form.useForm();
      const deleteItem = trpc.item.delete.useMutation({
        onSuccess: () => {
          console.log("deleted");
          utils.item.invalidate();
        },
      });
      const editItem = trpc.item.update.useMutation({
        onSuccess: () => {
          utils.item.invalidate();
        },
      });

      const { data: categories } = trpc.category.getAll.useQuery();
      const { data: user } = trpc.user.getAll.useQuery();
      const { data: status } = trpc.status.getAll.useQuery();

      const handleDeleteItem = () => {
        if (renderProps) deleteItem.mutate({ id: renderProps?.id });
      };

      const handleEditItem = () => {
        const editModal = modal.confirm({
          title: "Edit Item",
          content: (
            <div>
              <Form
                onFinish={(values) => {
                  editItem.mutate({ id: renderProps?.id, ...values });
                }}
                initialValues={{
                  ...renderProps,
                  category: renderProps?.categoryId,
                  users: renderProps?.userIds,
                  status: renderProps?.statusId,
                }}
                form={form}
              >
                <Form.Item
                  label="title"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your title!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your description!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="category"
                  name="category"
                  rules={[
                    {
                      required: true,
                      message: "Please input your category!",
                    },
                  ]}
                >
                  <Select
                    options={categories?.map((item) => {
                      return { label: item.name, value: item.id };
                    })}
                  />
                </Form.Item>
                <Form.Item
                  label="user"
                  name="users"
                  rules={[
                    {
                      required: true,
                      message: "Please input your user!",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    options={user?.map((item) => {
                      return { label: item.name, value: item.id };
                    })}
                  />
                </Form.Item>
                <Form.Item label="status" name="status">
                  <Select
                    options={status?.map((item) => {
                      return { label: item.name, value: item.id };
                    })}
                  />
                </Form.Item>
              </Form>
            </div>
          ),
          onOk: async () => {
            await form.validateFields();
            const error = form.getFieldsError();
            const hasError = error.some((item) => item.errors.length > 0);
            if (!hasError) form.submit();
          },
        });
      };

      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = "grabbing";

        return () => {
          document.body.style.cursor = "";
        };
      }, [dragOverlay]);

      return (
        <li
          className={classNames(
            styles.Wrapper,
            fadeIn && styles.fadeIn,
            sorting && styles.sorting,
            dragOverlay && styles.dragOverlay
          )}
          style={
            {
              ...wrapperStyle,
              transition: [transition, wrapperStyle?.transition]
                .filter(Boolean)
                .join(", "),
              "--translate-x": transform
                ? `${Math.round(transform.x)}px`
                : undefined,
              "--translate-y": transform
                ? `${Math.round(transform.y)}px`
                : undefined,
              "--scale-x": transform?.scaleX
                ? `${transform.scaleX}`
                : undefined,
              "--scale-y": transform?.scaleY
                ? `${transform.scaleY}`
                : undefined,
              "--index": index,
              "--color": color,
            } as React.CSSProperties
          }
          ref={ref}
        >
          {contextHolder}
          <div
            className={classNames(
              styles.Item,
              dragging && styles.dragging,
              handle && styles.withHandle,
              dragOverlay && styles.dragOverlay,
              disabled && styles.disabled
            )}
            style={style}
            {...(!handle ? listeners : undefined)}
            {...props}
          >
            <div className={cardStyles.container}>
              <div className={cardStyles.header}>
                <div
                  className={cardStyles.tag}
                  style={{ "--color": renderProps?.category?.color }}
                >
                  {renderProps?.category?.name}
                </div>
                <div className={cardStyles.action}>
                  {" "}
                  <Tooltip
                    trigger={["hover"]}
                    overlay={
                      <ul>
                        <li>
                          <span
                            onMouseDown={handleDeleteItem}
                            style={{ cursor: "pointer" }}
                          >
                            <DeleteOutlined /> Delete
                          </span>
                        </li>
                        <li>
                          <span
                            onMouseDown={handleEditItem}
                            style={{ cursor: "pointer" }}
                          >
                            <EditOutlined /> Edit
                          </span>
                        </li>
                      </ul>
                    }
                  >
                    <div
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <More />
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className={cardStyles.title}>{renderProps?.title}</div>
              <div>
                <p className={cardStyles.content}>{renderProps?.description}</p>
              </div>
              <Avatar.Group>
                {renderProps?.users.map((item) => (
                  <Avatar
                    style={{
                      background: item.color,
                    }}
                    key={item.name}
                  >
                    {item.name}
                  </Avatar>
                ))}
              </Avatar.Group>
            </div>
          </div>
        </li>
      );
    }
  )
);
