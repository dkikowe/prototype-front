import React from "react";
import styles from "./Page.module.scss";

const TasksPage = ({ userData }) => {
  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <h1>Задачи</h1>
        <p>Страница задач в разработке...</p>
      </div>
    </div>
  );
};

export default TasksPage;
