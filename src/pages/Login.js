import { useMutation } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import { LOGIN_USER } from '../util/graphql';
import { useForm } from '../util/hooks';


function Login(props) {
    const context = useContext( AuthContext );
    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(LoginUserCallback, {
        username: '',
        password: ''
    });
   
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update( _, { data: { login: userData } } ) {
            context.login( userData );
            props.history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values
    });
    function LoginUserCallback() {
        loginUser();
    }
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Login</h1>
                <Form.Input label="Username" placeholder="Username..."
                    type="text"
                    error={errors !== undefined && errors.username && {
                        content: errors.username,
                        pointing: 'below'
                    }}
                    name="username"
                    value={values.username} onChange={onChange} />
                <Form.Input label="Password" placeholder="Password..."
                    type="password"
                    error={errors !== undefined && errors.password && {
                        content: errors.password,
                        pointing: 'below'
                    }}
                    name="password"
                    value={values.password} onChange={onChange} />
                <Button type="submit" primary>Login</Button>
            </Form>
        </div>
    )
}



export default Login;
