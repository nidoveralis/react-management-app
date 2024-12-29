import React, { FC } from 'react';
import styles from "./form.module.css";

interface IOptions {
  handleChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
  label: string;
}

const Form: FC<IOptions> = ({ handleChangeInput, title, label }) => {
  return (
    <div className={styles.form}>
      {title && <span className={styles.form__text}>{title}</span>}
      <input
        className={styles.form__input}
        type="text"
        onChange={handleChangeInput}
        placeholder={label} />
    </div>
  );
}

export default Form;
