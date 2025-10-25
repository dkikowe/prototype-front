import React from "react";
import styles from "./Page.module.scss";

const ProfilePage = ({ userData }) => {
  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <h1>Профиль</h1>
        {userData ? (
          <div>
            <p>
              Имя: {userData.firstName} {userData.lastName}
            </p>
            <p>Username: @{userData.username}</p>
            <p>ID: {userData.id}</p>
            <p>Язык: {userData.languageCode}</p>
          </div>
        ) : (
          <p>Данные пользователя не загружены</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
