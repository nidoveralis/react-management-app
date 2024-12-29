import React, { FC, useState } from 'react';

import styles from './popup.module.css';
import clsx from 'clsx';

interface IOptions {
  setIsOpenPopup: (data: boolean) => void;
  isOpen: boolean;
  title: string;
  purpose: string;
  subtitle?: string;
  handleClickBtn?: (data: boolean) => void;
};

const Popup: FC<IOptions> = ({ setIsOpenPopup, isOpen, title, purpose, subtitle, handleClickBtn }) => {

  return (
    <div className={clsx(styles.wrapper, styles[purpose])}>
      <div className={styles.background} onClick={() => setIsOpenPopup(false)} >
        <div className={styles.popup}>
          <div className={styles.popup__img}></div>
          <div className={styles.popup__text}>
            <p className={styles.popup__subtitle}>{subtitle}</p>
            <p className={styles.popup__title}>{title}</p>
          </div>
          <div className={styles.popup__btns}>
            {purpose === 'remove'
              ? <>
                <button className={styles.popup__button} onClick={() => handleClickBtn && handleClickBtn(true)}>Удалить</button>
                <button className={styles.popup__button} onClick={() => setIsOpenPopup(false)}>Отменить</button>
              </>
              : purpose === 'error'
                ? <button className={styles.popup__button} onClick={() => setIsOpenPopup(false)}>Вернутся к списку</button>
                : <button className={styles.popup__button} onClick={() => setIsOpenPopup(false)}>Закрыть</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Popup;