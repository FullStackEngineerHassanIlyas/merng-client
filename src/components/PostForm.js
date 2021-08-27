import { useMutation } from '@apollo/client';
import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY, CREATE_POST_MUTATION } from '../util/graphql';

function PostForm() {

    const { onSubmit, onChange, values } = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update( proxy, result ) {
            // Creating cache: for updating DOM on
            // New post insert
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });

            let newPosts = [result.data.createPost, ...data.getPosts];
            proxy.writeQuery({ 
                query: FETCH_POSTS_QUERY, 
                data: {
                    getPosts: newPosts
                } 
            });
            values.body = '';
        },
        onError( err ) {
        }
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <div>
            <Form onSubmit={onSubmit}>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi World!"
                        name="body"
                        onChange={onChange}
                        error={ error && {
                            content: error.graphQLErrors[0].message,
                            pointing: 'below'
                        }}
                        value={values.body}
                    />
                    <Button type="submit" color="teal">Submit</Button>
                </Form.Field>
            </Form>
        </div>
    )
}


export default PostForm
