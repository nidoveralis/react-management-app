import React, { FC, useState, useEffect, useRef } from 'react';
import styles from "./form.module.css";
import clsx from 'clsx';

interface IOptions {
  handleChangeInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setIsOpenModal: (data: boolean) => void;
  setIsUserList: (data: IUserOptions[]) => void;
  setIsError?: (data: string) => void;
  title?: string;
  label: string;
  name?: string;
  isError?: string;
}

interface IUserOptions {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

const Form: FC<IOptions> = ({
  handleChangeInput,
  setIsOpenModal,
  setIsUserList,
  setIsError,
  isError,
  title,
  label,
  name,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isVisibleButton, setIsVisibleButton] = useState<boolean>(false);
  const [isVisibleLabel, setIsVisibleLabel] = useState<boolean>(name ? true : false);
  const [isUseVisiblerList, setIsVisibleUserList] = useState<IUserOptions[]>([]);
  const [isValue, setIsValue] = useState<string>(name || '');

  const allUsersList = JSON.parse(localStorage.getItem('users') || '[]');

  const clearData = () => {
    setIsVisibleButton(false);
    setIsVisibleUserList([]);
  };

  const searchUsers = (value: string) => {
    setIsVisibleUserList(allUsersList);
    const findUsers = allUsersList.length > 0 ? allUsersList.filter((item: IUserOptions) =>
      item.last_name ? item.last_name.toLowerCase().includes(value.toLowerCase()) : null) : [];
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
      if (setIsError) {
        setIsError('');
      }
      setIsVisibleLabel(true);
      searchUsers(value);
      if (handleChangeInput) {
        handleChangeInput(e);
      }
    } else {
      setIsVisibleLabel(false);
      clearData();
    }
  };

  const handleClickAddUser = () => {
    setIsOpenModal(true);
    setIsVisibleButton(false);
  };

  const handleOnBlurInput = () => {
    if (setIsError) {
      if (isValue.trim().length === 0) {
        setIsError('name');
      } else {
        setIsError('');
      }
    }
  };

  const handleClickUser = (el: IUserOptions) => {
    if (!title) {
      setIsValue(el.last_name);
      setIsUserList([el]);
      setIsVisibleUserList([]);
    }
  };

  useEffect(() => {
    if (isValue === '') {
      setIsUserList(allUsersList);
    }
    // eslint-disable-next-line
  }, [isValue]);

  useEffect(() => {
    if (isError === 'name' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isError]);

  useEffect(() => {
    const handleClickOutsideModal = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        clearData();
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
        ref={inputRef}
        className={clsx(styles.form__input, { [styles.form__input_error]: isError === 'name' })}
        type="text"
        onChange={(e) => { handleSearchInput(e) }}
        placeholder={label}
        value={isValue}
        onClick={handleInputClick}
        onBlur={handleOnBlurInput}
      />
      <div ref={modalRef}>
        <ul className={styles.form__list} style={{ top: `${title ? 90 : 55}px` }}>
          {!isVisibleButton &&
            <>{isUseVisiblerList.map((el: IUserOptions, index) => {
              return (<li
                key={index}
                className={clsx(styles.form__item, title && styles.form__item_disable)}
                onClick={() => handleClickUser(el)}
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
