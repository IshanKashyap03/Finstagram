import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import useForm from '../../shared/hooks/form-hook';
import './PlaceForm.css'

const Newplace = () => {
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
    },
        false
    );

    const placeSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    };

    return <form className='place-form' onSubmit={placeSubmitHandler}>
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

        <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
    </form>
};

export default Newplace;