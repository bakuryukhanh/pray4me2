import Bell from "../../Icons/Bell";
import Info from "../../Icons/Info";
import style from "./index.module.scss";
import { Avatar, Input } from "antd";
import Search from "../../Icons/Search";
const Header = () => {
  return (
    <div className={style["container"]}>
      <div className={style["search"]}>
        <Input
          prefix={<Search />}
          bordered={false}
          placeholder="Search"
          size="large"
        />
      </div>
      <div className={style["right"]}>
        <Bell />
        <Info />
        <Avatar src="/ava.png" />
      </div>
    </div>
  );
};

export default Header;
