import React, {useEffect, useState, useContext} from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import {useParams} from 'react-router-dom'
import useForm from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../components/ErrorModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {useHistory} from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css'

const UpdatePlace = () => {
    const {isloading, error, sendRequest, errorHandler} = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const history = useHistory();
    const auth = useContext(AuthContext);
    const placeId = useParams().placeId;

    const [ formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);

    useEffect(() => {
            const fetchPlace = async () => {
            try{
                const responseData = await sendRequest(`http://localhost:5001/api/places/${placeId}`);
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true);
            }catch(err){

            }
        };
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);



    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        try{
            await sendRequest(`http://localhost:5001/api/places/${placeId}`,
            'PATCH',
            JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value,
            }),
            {
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            }
            );
            history.push('/' + auth.userId + '/places');
        }catch(err){

        }
        
    };

    if(isloading){
        return <div className='center'>
            <LoadingSpinner/>
        </div>
    }

    if(!loadedPlace && !error){
        return <div className='center'>
            <Card>
                <h2>Could not find place!</h2>
            </Card>
           
        </div>
    }
    return <React.Fragment>
    <ErrorModal error={error} onClear = {errorHandler}/>
    {!isloading && loadedPlace && <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
        <Input 
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText = "Please enter a valid title."
        onInput = {inputHandler}
        initialValue={loadedPlace.title}
        initialValid={true}
        />

        <Input 
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText = "Please enter a valid description (at least 5 characters)."
        onInput = {inputHandler}
        initialValue={loadedPlace.description}
        initialValid={true}
        />

        <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>}
    </React.Fragment>
};

export default UpdatePlace;