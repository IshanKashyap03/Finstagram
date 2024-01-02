import  React, {useState, useContext} from 'react';
import useForm from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE,VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext } from '../../shared/context/auth-context';
import './auth.css'

const Auth = () => {

    const auth = useContext(AuthContext);
    
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [ formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const switchModeHandler= () => {
        if(!isLoginMode){
            setFormData({
                ...formState.inputs,
                name: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        }else{
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
        auth.login();
    }

    return <Card className="authentication">
        <h2>Login Required</h2>
        <form className='place-form' onSubmit={authSubmitHandler}>
            {!isLoginMode && 
            <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE]}
            errorText="Please enter a name."
            onInput = {inputHandler}
            />
            }
            <Input 
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText = "Please enter a valid email address."
            onInput = {inputHandler}
            />

            <Input 
            id="password"
            element="input"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText = "Please enter a valid password, at least 5 characters."
            onInput = {inputHandler}
            />

            <Button type="submit" disabled={!formState.isValid}>{isLoginMode? 'LOGIN' : 'SIGNUP' }</Button>
        </form>

        <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode? 'SIGNUP' : 'LOGIN'}</Button>
    </Card>
};

export default Auth;