import React, { FC } from 'react';
import styles from "./form.module.css";

interface IOptions {
  handleChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Form: FC<IOptions> = ({ handleChangeInput }) => {
  return (
    <div className={styles.form}>
      <span className={styles.form__text}>Найти в списке</span>
      <input
        className={styles.form__input}
        type="text"
        onChange={handleChangeInput}
        placeholder="Пользователь" />
    </div>
  );
}

export default Form;
