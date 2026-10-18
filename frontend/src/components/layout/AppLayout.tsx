import { Outlet } from "react-router-dom";
import styles from "./AppLayout.module.css";
import Nav from "./Nav/Nav";

const AppLayout = () => {
  return (
    <div className={styles.page}>
      <Nav />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;