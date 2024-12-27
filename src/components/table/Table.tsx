import React, { FC } from 'react';

import styles from './table.module.css';
import clsx from 'clsx';

interface IOptions {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}
const TableCustomer: FC<{ isUserList: IOptions[] }> = ({ isUserList }) => {
  return (
    <table className={styles.table}>
      <thead className={styles.table__header}>
        <tr>
          <th>ФИО пользователя<button>По алфавиту А-Я</button></th>
          <th>Контактные данные</th>
          <th>Дата рождения</th>
          <th>Пол</th>
          <th>Роль</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {isUserList.map((user: IOptions, index: number) => (
          <tr
            onClick={() => { }}
            className="active__link_tr"
            key={index}
          >
            <td>
              <div className={styles.table__container}>
                <img
                  alt='Фото'
                  src={user.avatar}
                  className={styles.table__avatar}
                />
                <span>{`${user.first_name} ${user.last_name}`}</span>
              </div>
            </td>
            <td>{user.email}</td>
            <td>24.10.1998</td>
            <td>
              <div className={styles.table__container}>
                <i className={clsx(styles.table__gender, styles.table__gender_female)} />
                <span>Женский</span>
              </div>
            </td>
            <td>Медсестра</td>
            <td>
              <div className={styles.table__container}>
                <button className={clsx(styles.table__btn, styles.table__btn_edit)}></button>
                <button className={clsx(styles.table__btn, styles.table__btn_remove)}></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableCustomer;
