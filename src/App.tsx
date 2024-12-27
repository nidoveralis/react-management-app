import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import TableCustomer from './components/table/Table';
import Header from './components/header/Header';
import Modal from './components/modal/Modal';

import { getUsers } from './api/user';

import './App.css';

interface IUserOptions {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

function App() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isCountUser, setIsCountUser] = useState<number>(0);
  const [isUserList, setIsUserList] = useState<IUserOptions[]>([]);

  useEffect(() => {
    getUsers().then((res: any) => {
      setIsUserList(res.data);
      setIsCountUser(res.total);
    });
  }, []);

  return (
    <div className="App">
      <Header setIsOpenModal={setIsOpenModal} isCountUser={isCountUser} />
      <TableCustomer isUserList={isUserList}/>
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
