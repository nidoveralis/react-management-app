import  { FC } from 'react';

import styles from './header.module.css';

interface IHeaderoptions {
  setIsOpenModal: (data: boolean) => void;
  isCountUser: number;
}

const Header: FC<IHeaderoptions> = ({ setIsOpenModal, isCountUser }) => {

  const getUserWordForm = (count: number) => {
    if (count === 1) {
      return 'человек';
    } else if (count > 1 && count < 5) {
      return 'человека';
    } else {
      return 'человек';
    }
  };

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
