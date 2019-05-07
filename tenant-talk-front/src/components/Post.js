import React, { Component }  from 'react';
import Reply from './Reply'
import NewMessageForm from './NewMessageForm'
class Post extends Component {

state ={
replyClicked: false,
editClicked: false
}

handleReplyClick = () => {
//when clicked, change clicked to true
this.setState({ replyClicked: !this.state.replyClicked });
};

handleEditClick = () => {
//when clicked, change clicked to true
this.setState({ editClicked: !this.state.editClicked });
console.log(this.state.editClicked)
};


render() {
const PostReplies=() => {     
let reply = this.props.replies.filter(reply => reply.post.id === this.props.post.id)
if(reply){
return reply}
else {
return {reply:{
	           message:"No Replies"
	          }
	    }
     }
}
let users = []
users.push(this.props.post.user)

return (

	<div>
	<h2>{this.props.post.user.name} says<img className="speechImg" alt="speechBubbleImage"src="http://www.stickpng.com/assets/images/58adf251e612507e27bd3c32.png" /></h2>
	<h3>{this.props.post.message}</h3>

	<div className="extra content">

	{this.state.editClicked ? <NewMessageForm messageToEdit={this.props.post} formType="edit" handleSubmit={this.props.edit} userList={users}/> : null}
		
		<button onClick={this.handleEditClick} name="edit">
        {this.state.editClicked ? "Return" : "Edit"}
		</button>
		{this.state.replyClicked ? <Reply postId={this.props.post.id} userId={this.props.post.user.id} replySubmit={this.props.replySubmit} postReplies={PostReplies()} /> : null}
		
		<button onClick={this.handleReplyClick} name="reply" >
		{this.state.replyClicked ? "Less" : "More"}</button>
	</div></div>
	)
	}
	}
	export default Post;