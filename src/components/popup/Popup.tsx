import { FC, useEffect, useRef } from 'react';

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
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutsideModal = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setIsOpenPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className={clsx(styles.wrapper, styles[purpose])}>
      <div className={styles.background}>
        <div ref={modalRef} className={styles.popup}>
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
              : purpose === 'success'
                ? <button className={clsx(styles.popup__button, styles.popup__button_close)} onClick={() => setIsOpenPopup(false)}>Закрыть</button>
                : <button className={clsx(styles.popup__button, styles.popup__button_error)} onClick={() => setIsOpenPopup(false)}>Вернутся к списку</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Popup;