import React from 'react';
import { Popup, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function CommentButton( { commentCount, postId } ) {
    return (
        <Popup
            content="Comments"
            inverted
            trigger={
                <Button labelPosition="right" as={Link} to={`/posts/${postId}`}>
                    <Button basic color='blue' icon="comments" />
                    <Label basic color="blue" pointing="left">
                        {commentCount}
                    </Label>
                </Button>
            }
        />
    )
}

export default CommentButton
