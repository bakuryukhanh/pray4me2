import { trpc } from "@/utils/trpc";
import Footer from "../Icons/Footer";
import Header from "./Header";
import style from "./index.module.scss";
import Main from "./Main";
import NavBar from "./NavBar";
const Layout = () => {
  return (
    <div className={style["container"]}>
      <nav className={style["nav-bar"]}>
        <NavBar />
      </nav>
      <div />
      <section className={style["main"]}>
        <div className={style["main-header"]}>
          <Header />
        </div>
        <div className={style["main-content"]}>
          <Main />
        </div>
      </section>
    </div>
  );
};

export default Layout;
