import React, { useState } from 'react';
import './App.css';
import Header from './components/header/Header';
import Modal from './components/modal/Modal';

function App() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <div className="App">
      <Header setIsOpenModal={setIsOpenModal} />
      {isOpenModal &&
        <Modal setIsOpenModal={setIsOpenModal} isOpen={isOpenModal} />}
    </div>
  );
}

export default App;
