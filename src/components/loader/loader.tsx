import { FC } from "react";

import styles from "./loader.module.css";
import clsx from "clsx";

const Loader: FC = () => {
  return (
    <div className={styles.linearActivity}>
      <div className={clsx(styles.indeterminate, styles.indeterminate_active)}></div>
    </div>
  );
};

export default Loader;
