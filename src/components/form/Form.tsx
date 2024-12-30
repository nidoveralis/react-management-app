import React, { FC, useState, useEffect, useRef } from 'react';
import styles from "./form.module.css";
import clsx from 'clsx';

interface IOptions {
  handleChangeInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setIsOpenModal: (data: boolean) => void;
  setIsUserList: (data: IUserOptions[]) => void;
  title?: string;
  label: string;
  value?: string
}

interface IUserOptions {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

const Form: FC<IOptions> = ({ handleChangeInput, title, label, value, setIsOpenModal, setIsUserList }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isVisibleButton, setIsVisibleButton] = useState<boolean>(false);
  const [isUseVisiblerList, setIsVisibleUserList] = useState<IUserOptions[]>([]);
console.log(label);
  const allUsersList = JSON.parse(localStorage.getItem('users') || '[]');

  const claerData = () => {
    setIsVisibleButton(false);
    setIsVisibleUserList([]);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (value !== '') {
      const findUsers = allUsersList.length > 0 ? allUsersList.filter((item: IUserOptions) => item.last_name.toLowerCase().includes(value)) : [];
      setIsVisibleUserList(findUsers);
      setIsVisibleButton(findUsers.length === 0);
      if (handleChangeInput) {
        handleChangeInput(e);
      }
    } else {
      claerData();
    }
  };

  useEffect(() => {
    const handleClickOutsideModal = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        claerData();
        setIsVisibleButton(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  return (
    <div className={styles.form} style={{ width: `${title ? '100%' : 'auto'}` }} >
      {title && <span className={styles.form__text}>{title}</span>}
      <input
        className={styles.form__input}
        type="text"
        onChange={(e) => { handleSearchInput(e) }}
        placeholder={label}
        defaultValue={value || ''}
        onClick={() => { setIsVisibleUserList(allUsersList) }}
      // onBlur={() => claerData()}
      />
      <div ref={modalRef}>
        <ul className={styles.form__list} style={{ top: `${title ? 90 : 55}px` }}>
          {!isVisibleButton &&
            <>{isUseVisiblerList.map((el: IUserOptions, index) => {
              return (<li
                key={index}
                className={clsx(styles.form__item, title && styles.form__item_disable)}
                onClick={() => { setIsUserList([el]) }}
              >{`${el.last_name} ${el.first_name}`}</li>)
            })}
            </>}
          {(isVisibleButton && (!title || (title && value))) &&
            <>
              <li className={styles.form__item}>Пользователя с такими параметрами не найден, проверьте правильность написнаия или создайте нового!</li>
              <li className={clsx(styles.form__item, styles.form__item_add)} onClick={() => setIsOpenModal(true)}>Добавить пользователя</li>
            </>
          }
        </ul>
      </div>
    </div>
  );
}

export default Form;
