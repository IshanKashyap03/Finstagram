import React , {useEffect, useState}from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../places/components/ErrorModal';
import LoadingSpinner from '../../places/components/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
    const {isloading, error, sendRequest, errorHandler} = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();
    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const responseData = await sendRequest('http://localhost:5001/api/users/');
                setLoadedUsers(responseData.users);
            }catch(err){
            }
        };
        fetchUsers();
    }, [sendRequest]);

    return <React.Fragment>
        <ErrorModal error={error} onClear={errorHandler}/>
        {isloading && <div className='center'>
            <LoadingSpinner/>
            </div>
        }
          {!isloading && loadedUsers && <UsersList items={loadedUsers}/>}
    </React.Fragment>
  
};

export default Users;