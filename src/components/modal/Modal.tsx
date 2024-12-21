import React, { FC } from 'react';

import styles from './modal.module.css';

interface IOptions {
  setIsOpenModal: (data: boolean) => void;
  isOpen: boolean;
};

const Modal: FC<IOptions> = ({ setIsOpenModal, isOpen }) => {
  console.log(isOpen);

  return (
    <div className={styles.modal}>
      <div className={styles.modal__background} onClick={() => setIsOpenModal(false)} />
      <div className={styles.modal__form}>
        <h2 className={styles.modal__title}>Добавить нового пользователя</h2>
        <div className={styles.form}>
          <label className={styles.form__label}>Найти в списке</label>
          <input type="text" id="search" placeholder="Пользователь" />
        </div>
        <div className="form-group">
          <label className={styles.form__label}>Дата рождения</label>
          <input type="date" id="birthdate" />
        </div>
        <div className="form-group">
          <label className={styles.form__label}>Пол</label>
          <select id="gender">
            <option value="female">Женский</option>
            <option value="male">Мужской</option>
          </select>
        </div>
        <div className="form-group">
          <label className={styles.form__label}>Роль</label>
          <select id="role">
            <option value="admin">Админ</option>
            <option value="user">Пользователь</option>
            <option value="viewer">Просмотрщик</option>
          </select>
        </div>
        <div className="modal__actions">
          <button className="btn-add">Добавить</button>
          <button className="btn-cancel">Отменить</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;