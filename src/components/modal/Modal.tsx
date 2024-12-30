import React, { FC, useState } from 'react';

import clsx from 'clsx';

import Form from '../form/Form';

import styles from './modal.module.css';

interface IOptions {
  setIsOpenModal: (data: boolean) => void;
  handleClickSubmit: (data: any) => void;
  setIsUserData: (data: string) => void;
  setIsUserRole: (data: { value: string, label: string } | null) => void;
  isOpen: boolean;
  role: { value: string, label: string } | null;
  data?: any;
};

const Modal: FC<IOptions> = ({ setIsOpenModal, data, handleClickSubmit, setIsUserData, setIsUserRole, role }) => {
  const [isGender, setIsGender] = useState<string | null>(data?.gender);
  const [isOpenSelect, setIsOpenSelect] = useState<boolean>(false);
  const roleLabel = role
    ? role.value === 'nurse' && isGender ? isGender === 'female' ? 'Медсестра' : 'Медбрат' : role.label
    : null;

  const options = [
    { value: 'doctor', label: 'Доктор' },
    ...(isGender === 'female' || !isGender ? [{ value: 'nurse', label: 'Медсестра' }] : []),
    ...(isGender === 'male' || !isGender ? [{ value: 'nurse', label: 'Медбрат' }] : []),
    { value: 'admin', label: 'Админ' },
  ];

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

  const handleClickCancel = () => {
    setIsUserData('');
    setIsUserRole(null);
    setIsOpenModal(false);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modal__background} onClick={handleClickCancel} />
      <div className={styles.modal__form}>
        <div className={styles.modal__wrapper}>
          <h2 className={styles.modal__title}>{
            data
              ? 'Редактировать пользователя'
              : 'Добавить нового пользователя'}</h2>
          <button className='btnClose' onClick={handleClickCancel} />
          <Form
            handleChangeInput={handleChangeInput}
            setIsOpenModal={()=>{}}
            setIsUserList={()=>{}}
            title={data ? '' : 'Найти в списке'}
            label={'Пользователь'}
            value={data ? `${data.first_name} ${data.last_name}` : ''}
          />
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
              {isGender && <span className={styles.form__label}>Роль</span>}
              <input type='text' value={roleLabel || 'Роль'} className={styles.form__input} />
              <span className={clsx(styles.selctIcon, isOpenSelect ? styles.selctIcon_active : '')}></span>
              {isOpenSelect && <ul className={styles.form__list}>
                {options.map((el: { value: string, label: string }, index: number) => {
                  return (
                    <li key={index} onClick={() => handleChangeSecelt(el)}>{el.label}</li>
                  )
                })}
              </ul>}
            </div>
          </div>
          <div className={styles.modal__btns}>
            <button className={clsx(styles.modal__button, styles.modal__button_active)} onClick={handleClickSubmit}>{data ? 'Сохранить' : 'Добавить'}</button>
            <button className={styles.modal__button} onClick={handleClickCancel}>Отменить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;