import React, { FC, useState } from 'react';

import styles from './modal.module.css';
import clsx from 'clsx';

interface IOptions {
  setIsOpenModal: (data: boolean) => void;
  isOpen: boolean;
};

const Modal: FC<IOptions> = ({ setIsOpenModal, isOpen }) => {
  const [isGender, setIsGender] = useState<string>('male');
  console.log(isOpen);

  return (
    <div className={styles.modal}>
      <div className={styles.modal__background} onClick={() => setIsOpenModal(false)} />
      <div className={styles.modal__form}>
        <h2 className={styles.modal__title}>Добавить нового пользователя</h2>
        <button className='btnClose' onClick={() => setIsOpenModal(false)} />
        <div className={styles.form}>
          <label className={styles.form__label}>Найти в списке</label>
          <input className={styles.form__input} type="text" id="search" placeholder="Пользователь" />
        </div>
        <div className={styles.form__wrapper}>
          <div className={clsx(styles.formGroup, styles.formGroup__select, styles.formGroup__date)}>
            <label className={styles.form__label}>Дата рождения</label>
            {/* <input type="date" id="birthdate" /> */}
            <span className={styles.seelctIcon}></span>
          </div>
          <div className={clsx(styles.formGroup, styles.form__gender)}>
            <button className={clsx(styles.genderBtn, isGender === 'male' ? styles.genderBtn_active : '')}>
              <span className={styles.form__icon} />
              <span>Женский</span>
            </button>
            <button className={clsx(styles.genderBtn, isGender === 'female' ? styles.genderBtn_active : '')}>
              <span className={styles.form__icon} />
              <span>Мужской</span>
            </button>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.form__label}>Роль</label>
            <select id="role">
              <option value="admin">Админ</option>
              <option value="user">Пользователь</option>
              <option value="viewer">Просмотрщик</option>
            </select>
          </div>
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