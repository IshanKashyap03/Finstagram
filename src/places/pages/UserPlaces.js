import React, { useEffect, useState } from 'react';
import PlaceList from '../components/PlaceList';
import {useParams} from 'react-router-dom'
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../components/ErrorModal';
import LoadingSpinner from '../components/LoadingSpinner';

const UserPlaces = () => {
    const userId = useParams().userId;  
    const [loadedPlaces, setLoadedPlaces] = useState();
    const {isloading, error, sendRequest, errorHandler} = useHttpClient();
        // will re-render with new data if there is a change in sendRequest.
        useEffect(() => {
            const fetchPlaces = async () => {
                try{
                    const responseData = await sendRequest(`http://localhost:5001/api/places/user/${userId}`);
                    setLoadedPlaces(responseData.places);
                }catch(err){

                }
            }
            fetchPlaces();
        }, [sendRequest, userId]);

    const placeDeleteHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id!==deletedPlaceId));
    };
    

    return <React.Fragment>
        <ErrorModal error={error} onClear={errorHandler}/>
        {isloading && <div className='center'>
        <LoadingSpinner asOverlay/>
        </div>}
        {!isloading && loadedPlaces && <PlaceList items = {loadedPlaces} onDeletePlace = {placeDeleteHandler}/>}
    </React.Fragment>
};

export default UserPlaces;