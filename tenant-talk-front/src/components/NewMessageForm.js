import React from 'react';

class NewMessageForm extends React.Component{

	state= {
		name: "Tenant 1",
		message: "",
		category: ""
	}

onChange = (event) => {
	this.setState({
		[event.target.name]: event.target.value
	})
}


render() {
let tenants = []

this.props.userList.forEach( user => {
  tenants.push(user.name)
} )

const isEditMode = this.props.formType === 'edit';

return(

  <div>
  {isEditMode ? null : <h4>Add a message</h4>}
	
	<form onSubmit={(event)=>{this.props.handleSubmit(event, this.state, this.props)}}>

	<div >
	{isEditMode ? <select name="name" 
	
	value={this.state.name} 
	onChange={this.onChange}><option>{"Select to confirm"}</option>{tenants.map(option => {
		           return <option>{option}</option>
	                }
	               )
                 }            
	</select> : <select name="name" 
	
	value={this.state.name} 
	onChange={this.onChange}>{tenants.map(option => {
		           return <option>{option}</option>
	                }
	               )
                 }            
	</select>}<br/><br/>
	</div>
	<div >
      {isEditMode ? <textarea className="textarea" onChange={this.onChange} 
      name="message" 
      type="textarea" 
      value={this.state.message}
      placeholder={this.props.messageToEdit.message}
      ></textarea> : <textarea id="text" className="textarea" onChange={this.onChange} 
      name="message" 
      type="textarea" 
      value={this.state.message}
      placeholder="Please write your post"
      ></textarea>}</div><br/><br/>
      <div >
      {isEditMode ? <input onChange={this.onChange} 
      className="input-field"
      name="category" 
      type="text" 
      value={this.state.category}
      placeholder={this.props.messageToEdit.category}
      ></input> : <input onChange={this.onChange} 
      className="input-field"
      name="category" 
      type="text" 
      value={this.state.category}
      placeholder="category"
      ></input>}
        <br/><br/>
        {isEditMode ? <button className="button" type="submit">Edit Message</button> : <button className="button" type="submit">Post Message</button>}
      
      </div>
	</form>
  </div>


		)
}
}

export default NewMessageForm;
