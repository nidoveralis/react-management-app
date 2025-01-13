import React, { FC, useState, useEffect } from 'react';
import DatePicker, { DateObject } from "react-multi-date-picker";
import clsx from 'clsx';

import Form from '../form/Form';

import styles from './modal.module.css';

interface IOptions {
  setIsUserRole: (data: { value: string, label: string } | null) => void;
  setIsGender: (data: string) => void;
  setIsOpenModal: (data: boolean) => void;
  handleClickSubmit: () => void;
  setIsUserData: (data: string) => void;
  setFormattedDate: (data: string | null) => void;
  isOpen: boolean;
  isUserData: string;
  role: { value: string, label: string } | null;
  data?: any;
  isGender: string | null;
  formattedDate: string | null;
};

const Modal: FC<IOptions> = ({
  setIsGender,
  setIsOpenModal,
  handleClickSubmit,
  setIsUserData,
  setIsUserRole,
  setFormattedDate,
  formattedDate,
  isUserData,
  isGender,
  data,
  role,
}) => {
  const [isOpenSelect, setIsOpenSelect] = useState<boolean>(false);
  const [IsModalGender, setIsModalGender] = useState<string | null>(data?.gender || null);
  const [selectedDate, setSelectedDate] = useState<DateObject | null>(null);
  const [isError, setIsError] = useState<string>('');

  const name = data ? `${data.first_name || ''} ${data.last_name || ''}` : '';

  const roleLabel = role
    ? role.value === 'nurse' && isGender ? isGender === 'female' ? 'Медсестра' : 'Медбрат' : role.label
    : null;

  const options = [
    { value: 'doctor', label: 'Доктор' },
    ...(isGender === 'female' || !isGender ? [{ value: 'nurse', label: 'Медсестра' }] : []),
    ...(isGender === 'male' || !isGender ? [{ value: 'nurse', label: 'Медбрат' }] : []),
    { value: 'admin', label: 'Админ' },
  ];

  const isValidDate = (inputDate: string): boolean => {
    const [day, month, year] = inputDate.split('.');
    const inputBirthday = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();
    let age = today.getFullYear() - inputBirthday.getFullYear();

    if (
      today.getMonth() < inputBirthday.getMonth() ||
      (today.getMonth() === inputBirthday.getMonth() && today.getDate() < inputBirthday.getDate())
    ) {
      age--;
    }

    return age < 18;
  };

  const handleClickOnSave = () => {
    if (isUserData === '') {
      setIsError('name');
    } else {
      handleClickSubmit();
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();

    if (inputValue !== '') {
      setIsUserData(e.target.value);
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

  const handleDatePickerChange = (date: any) => {
    if (date) {
      setSelectedDate(date);
      const newDate = new DateObject(date).toString();
      setFormattedDate(newDate);
      setIsError(isValidDate(newDate) ? 'date' : '');
    }
  };

  useEffect(() => {
    if (data) {
      setIsUserData(name);
      setFormattedDate(data?.date || null);
      if (data?.date) {
        const [day, month, year] = data?.date.split(".");
        const fullYear = year.length === 2 ? (parseInt(year) < 50 ? `20${year}` : `19${year}`) : year;
        setSelectedDate(new DateObject(`${fullYear}-${month}-${day}`));
      }
    }
    // eslint-disable-next-line
  }, [data]);

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
            setIsOpenModal={() => { }}
            setIsUserList={() => { }}
            title={data ? '' : 'Найти в списке'}
            label={'Пользователь'}
            name={name}
            isError={isError}
            setIsError={setIsError}
          />
          <div className={styles.form__wrapper}>
            <div
              className={clsx(
                styles.formGroup,
                styles.formGroup__select,
                styles.formGroup__date,
                { [styles.formGroup_error]: isError === 'date' }
              )}>
              <label
                className={clsx(styles.form__label, { [styles.form__label_passive]: !formattedDate })}
                style={{ left: '40px', color: `${isError === 'date' ? '#FF4A33' : '#828D99'}` }}>
                Дата рождения
              </label>
              <span className={styles.selctIcon} />
            </div>
            <DatePicker
              dateSeparator={' '}
              value={selectedDate}
              onChange={handleDatePickerChange}
              range={false}
              format={"DD.MM.YYYY"}
              numberOfMonths={1}
              weekDays={['ВСК', 'ПНД', 'ВТР', 'СРД', 'ЧТВ', 'ПТН', 'СБТ']}
              months={['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']}
              showOtherDays={true}
              weekStartDayIndex={1}
              shadow={false}
              highlightToday={false}
              monthYearSeparator={' '}
              maxDate={new Date()}
            />
            <div className={clsx(styles.formGroup, styles.form__gender)}>
              <button
                className={clsx(styles.genderBtn, IsModalGender === 'male' ? styles.modal__button_active : '')}
                onClick={() => { setIsGender('male'); setIsModalGender('male') }}
              >
                <span className={clsx(styles.form__icon, styles.form__icon_male)} />
                <span>Мужской</span>
              </button>
              <button
                className={clsx(styles.genderBtn, IsModalGender === 'female' ? styles.modal__button_active : '')}
                onClick={() => { setIsGender('female'); setIsModalGender('female') }}>
                <span className={clsx(styles.form__icon, styles.form__icon_female)} />
                <span>Женский</span>
              </button>
            </div>
            <div
              className={clsx(styles.formGroup, styles.formGroup__select, styles.formGroup__role)}
              onClick={() => setIsOpenSelect(!isOpenSelect)}
            >
              {roleLabel && <span className={styles.form__label}>Роль</span>}
              <input type='text' value={roleLabel || 'Роль'} className={styles.form__input} onChange={() => { }} />
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
            <button
              disabled={isError !== ''}
              className={clsx(styles.modal__button, styles.modal__button_active)}
              onClick={handleClickOnSave}>
              {data ? 'Сохранить' : 'Добавить'}
            </button>
            <button className={styles.modal__button} onClick={handleClickCancel}>Отменить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;