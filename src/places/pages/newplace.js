import React from 'react';
import {useHistory} from 'react-router-dom';
import { useContext } from 'react';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import useForm from '../../shared/hooks/form-hook';
import ErrorModal from '../components/ErrorModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import './PlaceForm.css'

const Newplace = () => {
    const auth = useContext(AuthContext);
    const {isloading, error, sendRequest, errorHandler} = useHttpClient();
    const [formState, inputHandler] = useForm({
        title:{
            value:'',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        description:{
            value:'',
            isValid: false
        },
        image:{
            value: null,
            isValid: false
        }
    },
        false
    );

    const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try{
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('image', formState.inputs.image.value);
            await sendRequest('http://localhost:5001/api/places/', 
            'POST',
            formData,
            {
                Authorization: 'Bearer ' + auth.token
            }
            );
            //redirect user to a different page.
            history.push('/');
        }catch(err){

        }
    };

    return <React.Fragment>
    <ErrorModal error = {error} onClear = {errorHandler}/>
    <form className='place-form' onSubmit={placeSubmitHandler}>
        {isloading && <LoadingSpinner asOverlay/>}
        <Input 
        id="title"
        label="Title" 
        element="input" 
        validators={[VALIDATOR_REQUIRE()]} 
        errorText="Please enter a valid title."
        onInput = {inputHandler}
        />

        <Input 
        id="address"
        label="Address" 
        element="input" 
        validators={[VALIDATOR_REQUIRE()]} 
        errorText="Please enter a valid address."
        onInput = {inputHandler}
        />

        <Input 
        id="description"
        label="Description" 
        element="textarea" 
        validators={[VALIDATOR_MINLENGTH(5)]} 
        errorText="Please enter a valid description (at least 5 characters)."
        onInput = {inputHandler}
        />

        <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image."/>

        <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
    </form>
    </React.Fragment>
};

export default Newplace;