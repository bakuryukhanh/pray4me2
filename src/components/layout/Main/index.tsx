import style from "./index.module.scss";
import { Select } from "antd";
import { MultipleContainers } from "../../MultipleContainer/MultipleContainers";
import { trpc } from "@/utils/trpc";
const Main = () => {
  const { data: items } = trpc.item.getAll.useQuery();
  const { data: statusArr } = trpc.status.getAll.useQuery();

  if (!items || !statusArr) return <div>loading</div>;

  const data = statusArr.reduce((acc, status) => {
    acc[status.id] = items
      .filter((item) => item.statusId === status.id)
      .sort((a, b) => {
        if (!a.ItemStatus[0]?.index || !b.ItemStatus[0]?.index) return 0;
        return a.ItemStatus[0].index.getTime() -
          b.ItemStatus[0].index.getTime() >
          0
          ? 1
          : -1;
      });
    return acc;
  }, {} as { [key: string]: typeof items });

  return (
    <div className={style["container"]}>
      <div className={style["header"]}>
        <h2 className={style["title"]}>Board</h2>
        <Select bordered={false} defaultValue="week" className={style.select}>
          <Select.Option value="week">This Week</Select.Option>
        </Select>
      </div>
      <div className={style["content"]}>
        <MultipleContainers items={data} statusArr={statusArr} />
      </div>
    </div>
  );
};

export default Main;
