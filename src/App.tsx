import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import Header from './components/header/Header';
import Modal from './components/modal/Modal';

import './App.css';

function App() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <div className="App">
      <Header setIsOpenModal={setIsOpenModal} />
      <CSSTransition
        in={isOpenModal}
        timeout={400}
        classNames='alert'
        unmountOnExit
      >
        <Modal setIsOpenModal={setIsOpenModal} isOpen={isOpenModal} />
      </CSSTransition>

    </div>
  );
}

export default App;
