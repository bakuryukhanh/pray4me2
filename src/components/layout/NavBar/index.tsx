import style from "./index.module.scss";
import cls from "classnames";
import Footer from "../../Icons/Footer";
import { useRouter } from "next/router";
import Link from "next/link";

const routes = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Board",
    href: "/board",
  },
  {
    name: "Analytics",
    href: "/analytics",
  },
  {
    name: "Settings",
    href: "/settings",
  },
];
const NavBar = () => {
  const router = useRouter();
  return (
    <div className={style["nav-bar"]}>
      <div className={style["nav-bar-logo"]}>
        <img src="/logo.png" alt="logo" />
      </div>
      <div className={style["nav-bar-menu"]}>
        <ul className={style["menu"]}>
          {routes.map((route) => (
            <li
              key={route.name}
              className={cls(style["menu-item"], {
                [style["active"]]: router.asPath === route.href,
              })}
            >
              <Link href={route.href}>{route.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={style["nav-bar-footer"]}>
        <Footer />
      </div>
    </div>
  );
};

export default NavBar;
