import React, { FC, useState } from 'react';

import styles from './modal.module.css';
import clsx from 'clsx';
import { addUsers } from '../../api/user';

interface IOptions {
  setIsOpenModal: (data: boolean) => void;
  isOpen: boolean;
};

const options = [
  { value: 'doctor', label: 'Доктор' },
  { value: 'nurse', label: 'Медсестра' },
  { value: 'nurse', label: 'Медбрат' },
  { value: 'admin', label: 'Админ' },
];

const Modal: FC<IOptions> = ({ setIsOpenModal, isOpen }) => {
  const [isGender, setIsGender] = useState<string>('male');
  const [isOpenSelect, setIsOpenSelect] = useState<boolean>(false);
  const [isUserData, setIsUserData] = useState<string>('');
  const [isUserRole, setIsUserRole] = useState<{ value: string, label: string } | null>(null);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();
    
    if (inputValue !== '') {
      setIsUserData(e.target.value);
    } else {
      setIsUserData('');
    }
  };

  const handleChangeSecelt = (el: { value: string, label: string }) => {
    setIsUserRole(el);
  };

  const handleClickAdd = () => {
    if (isUserData !== '') {
      addUsers({
        first_name: isUserData,
        role: isUserRole?.value || '',
        gender: 'female'
      })
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modal__background} onClick={() => setIsOpenModal(false)} />
      <div className={styles.modal__form}>
        <div className={styles.modal__wrapper}>
          <h2 className={styles.modal__title}>Добавить нового пользователя</h2>
          <button className='btnClose' onClick={() => setIsOpenModal(false)} />
          <div className={styles.form}>
            <span className={styles.form__text}>Найти в списке</span>
            <input
              className={styles.form__input}
              type="text"
              onChange={handleChangeInput}
              placeholder="Пользователь" />
          </div>
          <div className={styles.form__wrapper}>
            <div className={clsx(styles.formGroup, styles.formGroup__select, styles.formGroup__date)}>
              <label className={styles.form__label}>Дата рождения</label>
              <span className={styles.selctIcon}></span>
            </div>
            <div className={clsx(styles.formGroup, styles.form__gender)}>
              <button
                className={clsx(styles.genderBtn, isGender === 'male' ? styles.modal__button_active : '')}
                onClick={() => setIsGender('male')}
              >
                <span className={clsx(styles.form__icon, styles.form__icon_male)} />
                <span>Мужской</span>
              </button>
              <button
                className={clsx(styles.genderBtn, isGender === 'female' ? styles.modal__button_active : '')}
                onClick={() => setIsGender('female')}>
                <span className={clsx(styles.form__icon, styles.form__icon_female)} />
                <span>Женский</span>
              </button>
            </div>
            <div
              className={clsx(styles.formGroup, styles.formGroup__select, styles.formGroup__role)}
              onClick={() => setIsOpenSelect(!isOpenSelect)}
            >
              <span className={styles.form__label}>Роль</span>
              <span className={clsx(styles.selctIcon, isOpenSelect ? styles.selctIcon_active : '')}></span>
              {isOpenSelect && <ul className={styles.form__list}>
                {options.map((el: { value: string, label: string }, index: number) => {
                  const name = el.value === 'nurse' ? isGender === 'male' ? 'Медбрат' : 'Медсестра' : el.label;
                  return (
                    <li key={index} onClick={() => handleChangeSecelt(el)}>{name}</li>
                  )
                })}
              </ul>}
            </div>
          </div>
          <div className={styles.modal__btns}>
            <button className={clsx(styles.modal__button, styles.modal__button_active)} onClick={handleClickAdd}>Добавить</button>
            <button className={styles.modal__button} onClick={() => setIsOpenModal(false)}>Отменить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;