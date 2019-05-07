
import React from 'react';
import PreviousReply from './PreviousReply'
class Reply extends React.Component{

state = {
		message: ""
	}

onChange = (event) => {
	this.setState({
		[event.target.name]: event.target.value
	})
}

render(){

	return (

        <div> {this.props.postReplies.map(reply => <PreviousReply reply={reply.reply}/>)}
        
        <div className="reply">
        <form onSubmit={(event)=>{this.props.replySubmit(event, this.state, this.props)}}>
        <textarea className="textarea" onChange={this.onChange} 
      name="message" 
      type="textarea" 
      value={this.state.message}
      placeholder="Add Reply"
      ></textarea>
      <button type="submit">reply</button></form>

        </div></div>
		)
}

}

export default Reply;