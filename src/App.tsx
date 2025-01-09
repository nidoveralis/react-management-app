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
  gender?: string | null;
}

function App() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [isCountUser, setIsCountUser] = useState<number>(0);
  const [isUserList, setIsUserList] = useState<IUserOptions[]>([]);
  const [isUser, setIsUser] = useState<IUserOptions | null>(null);
  // const [isUserInputValues, setIsUserInputValues] = useState<IUserOptions | null>(null);
  const [isIdUser, setIsIdUser] = useState<number | null>(null);
  const [purpose, setPurpose] = useState<string>('');

  const [isUserData, setIsUserData] = useState<string>('');
  const [isUserRole, setIsUserRole] = useState<{ value: string, label: string } | null>(null);
  const [isGender, setIsGender] = useState<string | null>(null);


  const cleanData = () => {
    setIsUserData('');
    setIsOpenModal(false);
    setIsIdUser(null);
    setIsUserRole(null);
  };

  const handleClickRemove = (id: number) => {
    const finedUser = isUserList.find((user: IUserOptions) => user.id === id) || null;
    setIsIdUser(id);
    setIsUser(finedUser);
    setIsOpenPopup(true);
    setPurpose('remove');
  }

  const handleClickDelete = (data: boolean) => {
    if (data && isIdUser) {
      deleteUsers(isIdUser)
        .then((res) => {
          setIsIdUser(null);
          cleanData();
          setIsOpenPopup(true);
          setPurpose('success');
        })
        .catch(() => {
          setPurpose('err');
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
        gender: isGender || 'male'
      }).then(() => {
        cleanData();
      }).catch(() => {
        setPurpose('err');
      });
    }
  };

  const handleClickEditUser = () => {console.log(isUserRole, isGender, isUserData);
    if (isUser) {
      const nameParts = isUserData.split(' ');console.log(nameParts);
      const updateUser = {
        first_name: nameParts[0],
        last_name: nameParts[1],
        role: isUserRole?.value || '',
        gender: isGender || 'male',
        id: isUser.id
      };
      editUsers(updateUser).then((res: any) => {
        const updatedUserList = isUserList.map((user: IUserOptions) => {
          if (user.id === isUser.id) {
            return {
              ...user,
              ...updateUser
            };
          }
          return user;
        });
        localStorage.setItem('users', JSON.stringify(updatedUserList));
        setIsUserList(updatedUserList);
        setIsOpenPopup(true);
        setPurpose('success');
        cleanData();
      }).catch(() => {
        setPurpose('err');
      });
    }
  };

  useEffect(() => {
    if (!isOpenModal) {
      setIsUser(null);
      setIsUserRole(null);
    }
  }, [isOpenModal]);

  useEffect(() => {
    getUsers().then((res: any) => {
      setIsUserList(res.data);
      setIsCountUser(res.total);
    }).catch(() => {
      setPurpose('err');
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
        timeout={300}
        classNames='alert'
        unmountOnExit
      >
        <Modal
          handleClickSubmit={isUser ? handleClickEditUser : handleClickAdd}
          setIsOpenModal={setIsOpenModal}
          setIsUserData={setIsUserData}
          setIsUserRole={setIsUserRole}
          setIsGender={setIsGender}
          isOpen={isOpenModal}
          isGender={isGender}
          role={isUserRole}
          data={isUser}
        />
      </CSSTransition>
      <CSSTransition
        in={isOpenPopup}
        timeout={500}
        classNames='alert'
        unmountOnExit
      >
        <Popup
          setIsOpenPopup={setIsOpenPopup}
          handleClickBtn={handleClickDelete}
          isOpen={isOpenPopup}
          title={purpose === 'remove' ? `${isUser?.first_name} ${isUser?.last_name}` : purpose === 'success' ? 'Данные успешно сохранены' : 'Произошла ошибка на сервере'}
          subtitle={purpose === 'remove' ? 'Вы хотите удалить пользователя:' : ''}
          purpose={purpose}
        />
      </CSSTransition>
    </div>
  );
}

export default App;
