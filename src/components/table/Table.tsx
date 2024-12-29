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
const TableCustomer: FC<{
  isUserList: IOptions[],
  handleClickRemove: (data: number) => void
}> = ({ isUserList, handleClickRemove }) => {
  return (
    <section className={styles.table__wrapper}>
      <table className={styles.table}>
        <tbody>
          {isUserList.map((user: IOptions, index: number) => (
            <tr
              onClick={() => { }}
              className="active__link_tr"
              key={index}
            >
              <td>
                <div className={clsx(styles.table__container, styles.table__container_long)}>
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
                  <button className={clsx(styles.table__btn, styles.table__btn_edit)} />
                  <button className={clsx(styles.table__btn, styles.table__btn_remove)} onClick={() => handleClickRemove(user.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default TableCustomer;
