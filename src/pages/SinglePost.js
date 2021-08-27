import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import React, { useContext, useRef, useState } from 'react'
import { Card, Grid, Image, Form, Comment, Header } from 'semantic-ui-react';
import { FETCH_POST_QUERY, SUBMIT_COMMENT_MUTATION } from '../util/graphql';
import LikeButton from '../components/LikeButton';
import CommentButton from '../components/CommentButton';
import DeleteButton from '../components/DeleteButton';
import { AuthContext } from '../context/auth';

function SinglePost( props ) {
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);

    const postId = props.match.params.postId;

    const [ comment, setComment ] = useState('');

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
    });

    const [ submitComment ] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    });

    function deletePostCallback() {
        props.history.push('/');
    }

    let postMarkup;
    
    if (! data ) {
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            floated='right'
                            size='small'
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{ moment( createdAt ).fromNow() }</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likes, likeCount }} />
                                <CommentButton commentCount={commentCount} postId={id} />
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment..."
                                                name="comment"
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button
                                                className="ui button teal"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        <Comment.Group>
                            <Header as='h3' dividing>Comments</Header>
                            {comments.map(comment => (
                                <Comment key={comment.id}>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                                    <Comment.Content>
                                        <Comment.Author as='a'>{comment.username}</Comment.Author>
                                        <Comment.Metadata>
                                            {moment(comment.createdAt).fromNow()}
                                        </Comment.Metadata>
                                        <Comment.Text>{comment.body}</Comment.Text>
                                    </Comment.Content>
                                </Comment>
                            ))}
                        </Comment.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup;
}




export default SinglePost
