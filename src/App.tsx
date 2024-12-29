import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import TableCustomer from './components/table/Table';
import Header from './components/header/Header';
import Modal from './components/modal/Modal';

import { deleteUsers, getUsers } from './api/user';

import './App.css';
import Form from './components/form/Form';
import Popup from './components/popup/Popup';

interface IUserOptions {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

function App() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [isCountUser, setIsCountUser] = useState<number>(0);
  const [isUserList, setIsUserList] = useState<IUserOptions[]>([]);
  const [isIdUser, setIsIdUser] = useState<number | null>(null);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
  };

  const handleClickRemove = (id: number) => {
    setIsIdUser(id);
    setIsOpenPopup(true);
  }

  const handleClickDelete = (data: boolean) => {
    console.log(data);
    if (data && isIdUser) {
      deleteUsers(isIdUser);
    }
  };

  useEffect(() => {
    getUsers().then((res: any) => {
      setIsUserList(res.data);
      setIsCountUser(res.total);
    });
  }, []);

  return (
    <div className="App">
      <Header setIsOpenModal={setIsOpenModal} isCountUser={isCountUser} />
      <div className='mainForm'>
        <Form
          handleChangeInput={handleChangeInput}
          label='Поиск...'
        />
        <div className='mainForm__footer'>
          <span>ФИО пользователя<button className='mainForm__btnSorted'>По алфавиту А-Я</button></span>
          <span>Контактные данные</span>
          <span>Дата рождения</span>
          <span>Пол</span>
          <span>Роль</span>
        </div>
      </div>
      <TableCustomer isUserList={isUserList} handleClickRemove={handleClickRemove} />
      <CSSTransition
        in={isOpenModal}
        timeout={400}
        classNames='alert'
        unmountOnExit
      >
        <Modal setIsOpenModal={setIsOpenModal} isOpen={isOpenModal} />
      </CSSTransition>
      <CSSTransition
        in={isOpenPopup}
        timeout={400}
        classNames='alert'
        unmountOnExit
      >
        <Popup
          setIsOpenPopup={setIsOpenPopup}
          handleClickBtn={handleClickDelete}
          isOpen={isOpenPopup}
          title={'Казимир Антонина Рикудович'}
          subtitle={'Вы хотите удалить пользователя:'}
          purpose={'remove'}
        />
      </CSSTransition>
    </div>
  );
}

export default App;
