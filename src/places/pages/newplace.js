import React, {useCallback, useReducer} from 'react';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import './newplace.css'

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for(const inputId in state.inputs){
                if(inputId === action.inputId){
                    formIsValid = formIsValid && action.isValid;
                }else{
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {value: action.value, isValid: action.isValid}
                },
                isValid: formIsValid
            };
        default:
            return state;
    }
};

const Newplace = () => {

    const [formState, dispatch] = useReducer(formReducer, {
        inputs: {
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
            }
        },
        isValid: false
    });
    // no dependencies, hence this function will not be re-rendered and will be resued.
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({type: 'INPUT_CHANGE', value: value, isValid: isValid, inputId: id})
    }, []);

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