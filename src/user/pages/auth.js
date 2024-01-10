import  React, {useState, useContext} from 'react';
import useForm from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE,VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../places/components/ErrorModal';
import LoadingSpinner from '../../places/components/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './auth.css'

const Auth = () => {

    const auth = useContext(AuthContext);
    
    const [isLoginMode, setIsLoginMode] = useState(true);
    const {isloading, error, sendRequest, errorHandler} = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm({
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

    const authSubmitHandler = async event => {
        event.preventDefault();
        
        if(isLoginMode){
            try{
                const responseData = await sendRequest('http://localhost:5001/api/users/login',
                'POST',
                JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                {
                    'Content-type': 'application/json' 
                },
            );
            auth.login(responseData.user.id);
            }catch(err){
                
            }
        }else{
            try{
                //we have the user id in responseData from the backend.
                const responseData = await sendRequest('http://localhost:5001/api/users/signup',
                'POST',
                JSON.stringify({
                    name: formState.inputs.name.value,
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                {
                    'Content-type': 'application/json' 
                },
            );
                //passes the user id
                auth.login(responseData.user.id);
            }catch(err){
            }
        }
    };

    return <React.Fragment>
    <ErrorModal error={error} onClear={errorHandler}/>
    <Card className="authentication">
        {isloading && <LoadingSpinner asOverlay/>}
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
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText = "Please enter a valid password, at least 6 characters."
            onInput = {inputHandler}
            />

            <Button type="submit" disabled={!formState.isValid}>{isLoginMode? 'LOGIN' : 'SIGNUP' }</Button>
        </form>

        <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode? 'SIGNUP' : 'LOGIN'}</Button>
    </Card>
    </React.Fragment>
};

export default Auth;