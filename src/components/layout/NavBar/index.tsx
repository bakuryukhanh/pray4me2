import style from "./index.module.scss";
import cls from "classnames";
import Footer from "../../Icons/Footer";
const NavBar = () => {
  return (
    <div className={style["nav-bar"]}>
      <div className={style["nav-bar-logo"]}>
        <img src="/logo.png" alt="logo" />
      </div>
      <div className={style["nav-bar-menu"]}>
        <ul className={style["menu"]}>
          <li className={style["menu-item"]}> Dashboard</li>
          <li className={cls(style["menu-item"], style["active"])}> Board</li>
          <li className={style["menu-item"]}> Analytics</li>
          <li className={style["menu-item"]}> Settings</li>
        </ul>
      </div>
      <div className={style["nav-bar-footer"]}>
        <Footer />
      </div>
    </div>
  );
};

export default NavBar;
