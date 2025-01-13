import { FC } from 'react';

import AvatarImg from '../../assets/img/avatar.png';

import styles from './table.module.css';
import clsx from 'clsx';

interface IOptions {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  gender?: string | null;
  role?: { value: string, label: string } | null;
  date?: string | null;
};

const TableCustomer: FC<{
  activeId: number | null,
  isUserList: IOptions[],
  handleClickRemove: (data: number) => void
  handleClickEdit: (data: IOptions) => void
}> = ({ activeId, isUserList, handleClickRemove, handleClickEdit }) => {
  return (
    <section className={styles.table__wrapper}>
      <table className={styles.table}>
        <tbody>
          {isUserList.map((user: IOptions, index: number) => {
            const isRole = user.role
              ? user.role.label
              : !user.gender || user.gender === 'female' ? 'Медсестра' : 'Медбрат';
            return (
              <tr
                className={activeId === Number(user.id) ? `${styles.tr_active}` : ''}
                key={index}
              >
                <td>
                  <div className={clsx(styles.table__container, styles.table__container_long)}>
                    <img
                      alt='Фото'
                      src={user?.avatar || AvatarImg}
                      className={styles.table__avatar}
                    />
                    <span>{`${user.last_name || ''} ${user.first_name.slice(0, 1)}.`}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td className={styles.table__td}>{user?.date || ''}</td>
                <td className={styles.table__td}>
                  <div className={styles.table__container}>
                    <i className={clsx(styles.table__gender, styles.table__gender_female)} />
                    <span>{!user.gender || user.gender === 'female' ? 'Женский' : 'Мужской'}</span>
                  </div>
                </td>
                <td className={styles.table__td}>{isRole}</td>
                <td>
                  <div className={styles.table__container}>
                    <button className={clsx(styles.table__btn, styles.table__btn_edit)} onClick={() => handleClickEdit(user)} />
                    <button className={clsx(styles.table__btn, styles.table__btn_remove)} onClick={() => handleClickRemove(user.id)} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  );
}

export default TableCustomer;
