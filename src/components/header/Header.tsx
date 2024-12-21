import React, { useEffect, useState, FC } from 'react';

import { getUsers } from '../../api/user';

import styles from './header.module.css';

interface IHeaderoptions {
  setIsOpenModal: (data: boolean) => void;
}

const Header: FC<IHeaderoptions> = ({ setIsOpenModal }) => {
  const [isCountUser, setIsCountUser] = useState<number>(0);

  const getUserWordForm = (count: number) => {
    if (count === 1) {
      return 'человек';
    } else if (count > 1 && count < 5) {
      return 'человека';
    } else {
      return 'человек';
    }
  };

  useEffect(() => {
    getUsers().then((res: any) => {
      setIsCountUser(res.total);
    });
  }, []);

  return (
    <div className={styles.header}>
      <p className={styles.header__title}>Пользователи клиники <span className={styles.header__span}>{isCountUser} {getUserWordForm(isCountUser)}</span></p>
      <button
        className={styles.header__button}
        onClick={() => setIsOpenModal(true)}
      ><span className={styles.header__icon} />Добавить нового пользователя</button>
    </div>
  );
}

export default Header;
