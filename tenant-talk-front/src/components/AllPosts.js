import React from 'react';
import Post from './Post.js'

const AllPosts = (props) => {

	return (

        <div >
        {props.posts.map(post => {
        	return <Post edit={props.edit} post={post} replySubmit={props.replySubmit}replies={props.replies}/>
        })}
        </div>
		)
}

export default AllPosts;