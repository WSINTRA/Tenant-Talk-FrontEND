import React from 'react';

class FilterByCat extends React.Component{


render() {

let options = []
this.props.allCategories.forEach(post => {
if (options.indexOf(post.category) === -1) options.push(post.category);
  //Checks if there are duplicate entries for the select options
})

	return (
		<div ><br/>
       	Filter By Category<br/><br/>
	    <select name="name" 
	    
	    value={this.props.category} 
	    onChange={(event) => this.props.onChange(event.target.value)}>
	    <option>All</option>  
	     {options.map(option => {
		           return <option>{option}</option>
	                }
	               )
                 }          
	</select>
		</div>
		)
}
}

export default FilterByCat;