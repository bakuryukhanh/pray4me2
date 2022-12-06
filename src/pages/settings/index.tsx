import CustomColorPicker from "@/components/ColorPicker";
import Layout from "@/components/layout";
import Main from "@/components/layout/Main";
import { trpc } from "@/utils/trpc";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Spin } from "antd";
import { useEffect } from "react";
import style from "./index.module.scss";

function App() {
  const { data: users } = trpc.user.getAll.useQuery();
  const { data: categories } = trpc.category.getAll.useQuery();
  const [userForm] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const utils = trpc.useContext();
  const updateUser = trpc.user.updateAll.useMutation({
    onSuccess: () => {
      notification.success({
        message: "User updated",
      });
      utils.user.invalidate();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const updateCategory = trpc.category.updateAll.useMutation({
    onSuccess: () => {
      notification.success({
        message: "Category updated",
      });
      utils.category.invalidate();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    if (!users) return;
    userForm.setFieldsValue({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        color: "#" + user.color,
      })),
    });
  }, [userForm, users]);

  useEffect(() => {
    if (!categories) return;
    categoryForm.setFieldsValue({
      categories,
    });
  }, [categories, categoryForm]);

  if (!users || !categories)
    return (
      <div>
        <Spin />
      </div>
    );
  return (
    <Layout>
      <div className={style.container}>
        <h2>
          User
          <Button
            type="primary"
            style={{ marginLeft: "10px" }}
            onClick={() => userForm.submit()}
          >
            Save
          </Button>
        </h2>
        <Form
          form={userForm}
          initialValues={{
            users: users.map((user) => ({
              name: user.name,
              color: "#" + user.color,
            })),
          }}
          onFinish={(values) => {
            updateUser.mutate(
              values.users.map((user: any) => ({
                id: user.id,
                name: user.name,
                color: user.color.slice(1),
              }))
            );
          }}
        >
          <Form.List name="users">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field) => (
                    <div key={field.key} className={style.row}>
                      <Form.Item
                        label="Name"
                        name={[field.name, "name"]}
                        rules={[{ required: true, message: "Missing name" }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Color"
                        name={[field.name, "color"]}
                        rules={[{ required: true, message: "Missing color" }]}
                      >
                        <CustomColorPicker />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          danger
                          onClick={() => {
                            remove(field.name);
                          }}
                        >
                          Delete
                        </Button>
                      </Form.Item>
                    </div>
                  ))}
                  <Form.Item className={style.button}>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      block
                    >
                      <PlusOutlined /> Add field
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Form>
        <h2>
          Category
          <Button
            type="primary"
            style={{ marginLeft: "10px" }}
            onClick={() => categoryForm.submit()}
          >
            Save
          </Button>
        </h2>
        <Form
          form={categoryForm}
          initialValues={{
            categories: categories.map((cate) => ({
              name: cate.name,
              color: cate.color,
            })),
          }}
          onFinish={(values) => {
            updateCategory.mutate(values.categories);
          }}
        >
          <Form.List name="categories">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field) => (
                    <div key={field.key} className={style.row}>
                      <Form.Item
                        label="Name"
                        name={[field.name, "name"]}
                        rules={[{ required: true, message: "Missing name" }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Color"
                        name={[field.name, "color"]}
                        rules={[{ required: true, message: "Missing color" }]}
                      >
                        <CustomColorPicker />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          danger
                          onClick={() => {
                            remove(field.name);
                          }}
                        >
                          Delete
                        </Button>
                      </Form.Item>
                    </div>
                  ))}
                  <Form.Item className={style.button}>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      block
                    >
                      <PlusOutlined /> Add field
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Form>
      </div>
    </Layout>
  );
}

export default App;
