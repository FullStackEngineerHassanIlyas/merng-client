import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button, Label, Popup, Modal, Icon, Header } from 'semantic-ui-react';
import { LIKE_POST_MUTATION } from '../util/graphql';


function LikeButton({ user, post: { id, likeCount, likes } }) {
    const [liked, setLiked] = useState(false);
    const [error, setError] = useState({
        error: false,
        msg: ''
    });
    useEffect(() => {
        if ( user && likes.find(like => like.username === user.username )) {
            setLiked(true);
        } else setLiked(false);
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        onError( err ) {
            setError( {
                error: true,
                msg: err.graphQLErrors[0].message
            } );
        },
        variables: { postId: id }
    });

    const likeButton = user ? (
        liked ? (
            <Button color='teal' icon="heart"/>
        ) : (
            <Button color='teal' icon="heart" basic/>
        )
    ) : (
        <Button as={Link} color='teal' icon="heart" to="/login" basic />
    )

    return (
        <>
            <Popup
                content={liked ? 'Liked' : 'Like'}
                inverted
                trigger={
                    <Button as="div" labelPosition="right" onClick={likePost}>
                        {likeButton}
                        <Label as="a" basic color="teal" pointing="left">
                            {likeCount}
                        </Label>
                    </Button>
                }
            />
            <Modal 
                closeIcon
                basic
                open={error.error}
                onClose={() => {
                    setError({
                        error: false,
                        msg: ''
                    })
                }}
            >
                <Header icon>
                    <Icon name='times circle outline' />
                    {error.msg}
                </Header>
            </Modal>
        </>
    )
}

export default LikeButton
