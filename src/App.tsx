import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import TableCustomer from './components/table/Table';
import Header from './components/header/Header';
import Modal from './components/modal/Modal';

import { deleteUsers, getUsers, addUsers, editUsers } from './api/user';

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
  const [isUser, setIsUser] = useState<IUserOptions | null>(null);
  const [isIdUser, setIsIdUser] = useState<number | null>(null);
  const [isUserData, setIsUserData] = useState<string>('');
  const [isUserRole, setIsUserRole] = useState<{ value: string, label: string } | null>(null);
  const [purpose, setPurpose] = useState<string>('');

  const cleanData = () => {
    setIsUserData('');
    setIsOpenModal(false);
    setIsIdUser(null);
    setIsUserRole(null);
  };

  const handleClickRemove = (id: number) => {
    setIsIdUser(id);
    setIsOpenPopup(true);
    setPurpose('remove');
  }

  const handleClickDelete = (data: boolean) => {
    if (data && isIdUser) {
      deleteUsers(isIdUser).then((res) => {
        setIsIdUser(null);
      });
    }
  };

  const handleClickEdit = (user: IUserOptions) => {
    setIsOpenModal(true);
    setIsUser(user);
  };

  const handleClickAdd = () => {
    if (isUserData !== '') {
      addUsers({
        first_name: isUserData,
        role: isUserRole?.value || '',
        gender: 'male'
      }).then(() => {
        cleanData();
      });
    }
  };

  const handleClickEditUser = () => {
    if (isIdUser) {
      editUsers({
        first_name: isUserData,
        role: isUserRole?.value || '',
        gender: 'male',
        id: isIdUser
      }).then((res: any) => {
        console.log(res);
        cleanData();
        setIsOpenPopup(true);
        // setPurpose(`${res.status.toString()}`);
      });
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
          setIsOpenModal={setIsOpenModal}
          setIsUserList={setIsUserList}
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
      <TableCustomer
        isUserList={isUserList}
        handleClickRemove={handleClickRemove}
        handleClickEdit={handleClickEdit}
      />
      <CSSTransition
        in={isOpenModal}
        timeout={400}
        classNames='alert'
        unmountOnExit
      >
        <Modal
          setIsOpenModal={setIsOpenModal}
          handleClickSubmit={isUser ? handleClickEditUser : handleClickAdd}
          setIsUserData={setIsUserData}
          setIsUserRole={setIsUserRole}
          isOpen={isOpenModal}
          role={isUserRole}
          data={isUser}
        />
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
          purpose={purpose}
        />
      </CSSTransition>
    </div>
  );
}

export default App;
