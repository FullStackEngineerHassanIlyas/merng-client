import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { Button, Confirm, Modal, Icon, Header, Popup } from 'semantic-ui-react'
import { DELETE_POST_MUTATION, DELETE_COMMENT_MUTATION, FETCH_POSTS_QUERY } from '../util/graphql';

function DeleteButton({ postId, commentId, callback }) {
    const [confirmeOpen, setConfirmOpen] = useState(false);
    const [postDeleted, setPostDeleted] = useState({ deleted: false, msg: ''});

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [ deletePostOrCommentMutation ] = useMutation(mutation, {
        update( proxy, { data: { deletePost: deleted } } ) {
            setConfirmOpen(false);
            if ( ! commentId ) {
                setPostDeleted({
                    deleted: true,
                    msg: deleted
                });
                // Remove from cache
                const posts = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                let updatedPosts = posts.getPosts.filter( post => post.id !== postId );
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: updatedPosts
                    }
                });
            }

            if ( callback ) callback();
            
        },
        variables: { postId, commentId }
    });
    return (
        <>
            <Popup
                inverted
                content={commentId ? 'Delete comment' : 'Delete post'}
                trigger={
                    <Button
                        color="red"
                        icon="trash"
                        floated="right"
                        onClick={() => setConfirmOpen(true)}
                    />
                }
            />
            <Confirm 
                header="This action can not be undone."
                cancelButton='No'
                confirmButton="Yes"
                open={confirmeOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrCommentMutation}
            />
            <Modal
                closeIcon
                basic
                open={postDeleted.deleted}
                onClose={(e) => {
                    setPostDeleted({
                        deleted: false,
                        msg: ''
                    });
                }}
                size='small'
                closeOnDocumentClick={true}
            >
                <Header icon>
                    <Icon name='trash' />
                    {postDeleted.msg}
                </Header>
            </Modal>
        </>
            
    )
}


export default DeleteButton
