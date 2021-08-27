import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
    const { user } = useContext( AuthContext );
    const { loading, data } = useQuery( FETCH_POSTS_QUERY );

    return (
        <Grid columns={3}>
            <Grid.Row>
                <Grid.Column width={16} textAlign="center">
                    <h1>Recent Posts</h1>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                { user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
                { loading ? (
                    <h2>Loading posts...</h2>
                ) : (
                    <Transition.Group duration={1000}>
                        {
                            data && data.getPosts.map( post => (
                                <Grid.Column key={ post.id } style={{marginBottom: '1rem'}}>
                                    <PostCard post={ post } />
                                </Grid.Column>
                            ))

                        }
                    </Transition.Group>
                )}
            </Grid.Row>
        </Grid>
    )
}



export default Home
