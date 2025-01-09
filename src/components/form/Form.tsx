import React, { FC, useState, useEffect, useRef } from 'react';
import styles from "./form.module.css";
import clsx from 'clsx';

interface IOptions {
  handleChangeInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setIsOpenModal: (data: boolean) => void;
  setIsUserList: (data: IUserOptions[]) => void;
  title?: string;
  label: string;
  name?: string
}

interface IUserOptions {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

const Form: FC<IOptions> = ({ handleChangeInput, title, label, name, setIsOpenModal, setIsUserList }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isVisibleButton, setIsVisibleButton] = useState<boolean>(false);
  const [isVisibleLabel, setIsVisibleLabel] = useState<boolean>(name ? true : false);
  const [isUseVisiblerList, setIsVisibleUserList] = useState<IUserOptions[]>([]);
  const [isValue, setIsValue] = useState<string>(name || '');

  const allUsersList = JSON.parse(localStorage.getItem('users') || '[]');

  const claerData = () => {
    setIsVisibleButton(false);
    setIsVisibleUserList([]);
  };

  const searchUsers = (value: string) => {
    setIsVisibleUserList(allUsersList);
    const findUsers = allUsersList.length > 0 ? allUsersList.filter((item: IUserOptions) => item.last_name.toLowerCase().includes(value)) : [];
    setIsVisibleUserList(findUsers);
    setIsVisibleButton(findUsers.length === 0);
  }

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    searchUsers(value);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setIsValue(e.target.value);
    if (value !== '') {
      setIsVisibleLabel(true);
      searchUsers(value);
      if (handleChangeInput) {
        handleChangeInput(e);
      }
    } else {
      setIsVisibleLabel(false);
      claerData();
    }
  };

  const handleClickAddUser = () => {
    setIsOpenModal(true);
    setIsVisibleButton(false);
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
    <div className={styles.form} style={{ width: `${'100%'}` }} >
      {title && <span className={styles.form__text}>{title}</span>}
      {isVisibleLabel &&
        <label
          className={styles.form__label}
          style={{ top: `${title ? 40 : 5}px` }}
        >{label}</label>
      }
      <input
        className={styles.form__input}
        type="text"
        onChange={(e) => { handleSearchInput(e) }}
        placeholder={label}
        value={isValue}
        onClick={handleInputClick}
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
          {(isVisibleButton && !name && (!title || (title && name))) &&
            <>
              <li className={styles.form__item}>Пользователя с такими параметрами не найден, проверьте правильность написнаия или создайте нового!</li>
              <li className={clsx(styles.form__item, styles.form__item_add)} onClick={handleClickAddUser}>Добавить пользователя</li>
            </>
          }
        </ul>
      </div>
    </div>
  );
}

export default Form;
