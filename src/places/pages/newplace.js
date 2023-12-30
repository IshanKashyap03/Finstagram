import React from 'react';
import Input from '../../shared/components/FormElements/Input';
import './newplace.css'

const newplace = () => {
    return <form className='place-form'>
        <Input type="text" label="Title" element="input"/>
    </form>
};

export default newplace;