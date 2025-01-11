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
  role?: { value: string, label: string } | null;
  date?: string | null;
};

const sortOptions = [
  { value: 'name', label: 'По алфавиту А-Я' },
  { value: 'gender', label: 'По полу' },
  { value: 'date', label: 'По дату' }
];

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isCountUser, setIsCountUser] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [isUserList, setIsUserList] = useState<IUserOptions[]>([]);
  const [isUser, setIsUser] = useState<IUserOptions | null>(null);
  const [isIdUser, setIsIdUser] = useState<number | null>(null);
  const [purpose, setPurpose] = useState<string>('');
  const [isUserData, setIsUserData] = useState<string>('');
  const [isUserRole, setIsUserRole] = useState<{ value: string, label: string } | null>(null);
  const [isGender, setIsGender] = useState<string | null>(null);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [isSort, setIsSort] = useState<{ value: string, label: string }>({ value: 'name', label: 'По алфавиту А-Я' });

  const cleanData = () => {
    setIsUserData('');
    setIsOpenModal(false);
    setIsIdUser(null);
    setIsUserRole(null);
    setIsGender(null);
    setFormattedDate(null);
    setIsUser(null);
  };

  const updateUser = () => {
    const nameParts = isUserData.split(' ');
    const updateUser = {
      first_name: nameParts[0],
      last_name: nameParts[1],
      role: isUserRole || null,
      gender: isGender,
      date: formattedDate
    };
    return updateUser;
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
          const filteredList = isUserList.filter((el: IUserOptions) => el.id !== isIdUser);
          setIsUserList(filteredList);
          setIsOpenPopup(false);
          cleanData();
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
      const newUser = updateUser();
      addUsers(newUser).then((res: any) => {
        setIsOpenPopup(true);
        setPurpose('success');
        sortingUsersList([...isUserList, res.data]);
        cleanData();
      }).catch(() => {
        setPurpose('err');
      });
    }
  };

  const handleClickEditUser = () => {
    if (isUser) {
      const newUser = updateUser();
      editUsers({ ...newUser, id: isUser.id }).then((res: any) => {
        const updatedUserList = isUserList.map((user: IUserOptions) => {
          if (user.id === isUser.id) {
            return {
              ...user,
              ...newUser,
              id: isUser.id
            };
          }
          return user;
        });
        setIsOpenPopup(true);
        setPurpose('success');
        sortingUsersList(updatedUserList);
        cleanData();
      }).catch(() => {
        setPurpose('err');
      });
    }
  };

  const handleClickSorted = () => {
    const findInd = sortOptions.findIndex((item) => item.value === isSort.value);
    setIsSort(sortOptions[findInd > 1 ? 0 : findInd + 1]);
  };

  const parseDateString = (dateString: string): Date => {
    const [day, month, year] = dateString.split('.');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const sortingUsersList = (list: IUserOptions[]) => {
    let sortedUsers: IUserOptions[] = [];

    if (isSort.value === 'gender') {
      sortedUsers = [...list].sort((a: IUserOptions, b: IUserOptions) => {
        const genderA = a.gender || "";
        const genderB = b.gender || "";

        if (genderA === 'male' && genderB !== 'male') {
          return -1;
        }
        if (genderB === 'male' && genderA !== 'male') {
          return 1;
        }

        if (genderA === 'female' && genderB !== 'female' && genderB !== 'male') {
          return -1;
        }
        if (genderB === 'female' && genderA !== 'female' && genderA !== 'male') {
          return 1;
        }

        return 0
      });
    } else if (isSort.value === 'date') {
      sortedUsers = [...list].sort((a: IUserOptions, b: IUserOptions) => {
        if (!a.date && !b.date) {
          return 0;
        }
        if (!a.date) {
          return 1;
        }

        if (!b.date) {
          return -1;
        }

        const dateA = parseDateString(a.date).getTime();
        const dateB = parseDateString(b.date).getTime();

        return dateA - dateB;
      });
    } else {
      sortedUsers = [...list].sort((a: IUserOptions, b: IUserOptions) => {
        if (a.last_name < b.last_name) {
          return -1;
        }
        if (a.last_name > b.last_name) {
          return 1;
        }
        return 0;
      });
    }
    setIsUserList(sortedUsers);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (!isLoading && scrollTop + clientHeight >= scrollHeight - 20) {
      if (currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  const loadUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await getUsers(page);
      sortingUsersList([...isUserList, ...res.data]);
      setIsCountUser(res.total);
      setTotalPages(res.total_pages);
    } catch (error) {
      setPurpose('err');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  useEffect(() => {
    sortingUsersList(isUserList);
    // eslint-disable-next-line
  }, [isSort]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(isUserList));
  }, [isUserList]);

  useEffect(() => {
    if (!isOpenPopup) {
      cleanData();
    }
  }, [isOpenPopup]);

  useEffect(() => {
    if (!isOpenModal) {
      cleanData();
    }
  }, [isOpenModal]);

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
          <div>
            <span>ФИО пользователя</span>
            {/* <div> */}
            {/* <span>{isSort.label}</span>
              <div>
                <i></i>
                <i></i>

              </div>
            </div> */}
            <button className='mainForm__btnSorted' onClick={handleClickSorted}>{isSort.label}</button>
          </div>
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
        handleScroll={handleScroll}
      />
      <CSSTransition
        in={isOpenModal}
        timeout={300}
        classNames='alert'
        unmountOnExit
      >
        <Modal
          handleClickSubmit={isUser ? handleClickEditUser : handleClickAdd}
          setFormattedDate={setFormattedDate}
          setIsOpenModal={setIsOpenModal}
          setIsUserData={setIsUserData}
          setIsUserRole={setIsUserRole}
          setIsGender={setIsGender}
          formattedDate={formattedDate}
          isUserData={isUserData}
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
          title={purpose === 'remove' ? `${isUser?.first_name || ''} ${isUser?.last_name || ''}` : purpose === 'success' ? 'Данные успешно сохранены' : 'Произошла ошибка на сервере'}
          subtitle={purpose === 'remove' ? 'Вы хотите удалить пользователя:' : ''}
          purpose={purpose}
        />
      </CSSTransition>
    </div>
  );
}

export default App;
