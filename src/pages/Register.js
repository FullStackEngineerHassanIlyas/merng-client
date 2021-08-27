import { useMutation } from '@apollo/client';
import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import { REGISTER_USER } from '../util/graphql';
import { useForm } from '../util/hooks';

function Register( props ) {
    const context = useContext(AuthContext);
    const [ errors, setErrors ] = useState({});

    const initialState = {
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    }
    
    const { onChange, onSubmit, values } = useForm(registerUser, initialState);

    const [ addUser, { loading } ] = useMutation(REGISTER_USER, {
        update( _, { data: { register: userData } } ) {
            context.login( userData );
            props.history.push('/');
        },
        onError( err ) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values
    });

    function registerUser() {
        addUser();
    }
    
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={ loading ? 'loading' : '' }>
                <h1>Register</h1>
                <Form.Input label="Username" placeholder="Username..."
                    type="text"
                    error={ errors !== undefined && errors.username && {
                        content: errors.username,
                        pointing: 'below'
                    } }
                    name="username"
                    value={values.username} onChange={onChange} />
                <Form.Input label="Email" placeholder="Email..."
                    type="text"
                    error={ errors !== undefined && errors.email && {
                        content: errors.email,
                        pointing: 'below'
                    } }
                    name="email"
                    value={values.email} onChange={onChange} />
                <Form.Input label="Password" placeholder="Password..."
                    type="password"
                    error={ errors !== undefined && errors.password && {
                        content: errors.password,
                        pointing: 'below'
                    } }
                    name="password"
                    value={values.password} onChange={onChange} />
                <Form.Input label="Confirm Password" placeholder="Confirm Password..."
                    type="password"
                    error={ errors !== undefined && errors.confirmPassword && {
                        content: errors.confirmPassword,
                        pointing: 'below'
                    } }
                    name="confirmPassword"
                    value={values.confirmPassword} onChange={onChange} />
                <Button type="submit" primary>Register</Button>
            </Form>
        </div>
    )
}

export default Register
