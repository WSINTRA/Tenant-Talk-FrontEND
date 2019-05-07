import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Component, useRef, useEffect } from 'react'
import { apply, Canvas, useRender, useThree } from 'react-three-fiber'
import { useSprings, a } from 'react-spring/three'
import * as resources from './resources/index'
import './styles.css'
import './App.css';
import AllPosts from './components/AllPosts'
import NewMessageForm from './components/NewMessageForm'
import FilterByCat from './components/FilterByCat'
import TenTalk from './TenTalk.png'
/////THREE-JS
apply(resources)
const number = 30
const colors = ['#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff']
const random = () => {
  const r = Math.random()
  return {
    position: [30 - Math.random() * 60, 30 - Math.random() * 60, 0],
    color: colors[Math.round(Math.random() * (colors.length - 1))],
    scale: [1 + r * 10, 1 + r * 10, 1],
    rotation: [0, 0, THREE.Math.degToRad(Math.round(Math.random()) * 45)]
  }
}

function Content() {
  const { viewport } = useThree()
  const aspect = viewport.width / 6
  const [springs, set] = useSprings(number, i => ({ from: random(), ...random(), config: { mass: 20, tension: 500, friction: 200 } }))
  useEffect(() => void setInterval(() => set(i => ({ ...random(), delay: i * 50 })), 4000), [])
  return springs.map(({ color, ...props }, index) => (
    <a.mesh key={index} {...props}>
      <planeBufferGeometry attach="geometry" args={[0.1 + Math.random() * aspect, 0.1 + Math.random() * aspect]} />
      <a.meshPhongMaterial attach="material" color={color} />
    </a.mesh>
  ))
}

function Effect() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useRender(() => composer.current.render(), true)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <waterPass attachArray="passes" factor={1} />
      <shaderPass attachArray="passes" args={[resources.FXAAShader]} material-uniforms-resolution-value={[1 / size.width, 1 / size.height]} renderToScreen />
    </effectComposer>
  )
}
//END OF THREE-JS /////////////////
class App extends Component {
state = {
allUsers: [],
allPosts: [],
allReplies: [],
formType: "New message",
replyId: "",
filter: "All"
}

componentDidMount() { //Fetch all the data the app will use
  
  let users = "http://localhost:3050/users"
  let posts = "http://localhost:3050/posts"
  let replies = "http://localhost:3050/post_replies"
    Promise.all([fetch(users), fetch(posts), fetch(replies)])

      .then(([res1, res2, res3]) => { 
         return Promise.all([res1.json(), res2.json(), res3.json()]) 
      })
      .then(([res1, res2, res3]) => {
        // set state in here
        this.setState({
             allUsers: res1,
             allPosts: res2,
             allReplies: res3
        })
      });
}

newReply (event, newReply, props){ //function to deal with a Post reply
  event.preventDefault()
  
  let userId = props.userId
  let postId = props.postId
  let message = newReply.message
  let updatedPosts = this.state.allReplies.slice()

  fetch("http://localhost:3050/replies", {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  body: JSON.stringify( {'message':message, 'user_id':userId  })
})
.then(res => res.json())
.then(data => {

fetch("http://localhost:3050/post_replies", { //add the new reply to a Post by ID
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  body: JSON.stringify( {'post_id':postId, 'reply_id':data.id  })
})
.then(res => res.json())
.then(data => {
  //Could also do [...this.state.allReplies, data]
  updatedPosts.push(data)
  this.setState({
    allReplies: updatedPosts
  })

 }) 
})
}

handleEdit (event, edit, props) {  //When NewMessageForm is type edit, this function is called
  event.preventDefault()
  let updatedPosts = this.state.allPosts.slice()
  for (var i = 0; i < updatedPosts.length; i++) {
    if(updatedPosts[i].id === props.messageToEdit.id){
      updatedPosts.splice(i, 1)
    }
  } //Removes the old essage from state
  if (edit.message === "" || edit.category === ""){
    alert("Make sure you fill in all values");
  }
  let message = edit.message
  let userId = props.messageToEdit.user.id
  let category = edit.category
  let messageId = props.messageToEdit.id
 
  fetch(`http://localhost:3050/posts/${messageId}`, {
  method: "PATCH",
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  body: JSON.stringify( {user_id:userId, 'message':message, 'category':category  })
})
.then(res => res.json())
.then(data => {
 updatedPosts.unshift(data)
 this.setState({
  allPosts:updatedPosts //Updates state with the new message
 })
})
}



handleSubmit (event, newPost, props) { //When NewMessageForm is type NewMessage this function runs
event.preventDefault()
let updatedPosts = this.state.allPosts.slice()
console.log(event.value, newPost)
let userId = this.state.allUsers.find(user => user.name === newPost.name)
console.log(userId.name)
let message = newPost.message
let category = newPost.category
//need a user_id a message and a category for the post
//Submit this new message to the database
fetch("http://localhost:3050/posts", {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  body: JSON.stringify( {user_id:userId.id, 'message':message, 'category':category  })
})
.then(res => res.json())
.then(data => {
 updatedPosts.unshift(data)
 this.setState({
  allPosts:updatedPosts
 })
})
}


//Pass the filter all categories
//Build a filter method,
//Needs a word from the filter component
//Then that word has to be used in the filter method for the list of rendered Posts

filterChange(category) {
  this.setState({
    filter: category
  })
}


render () {

const filterBy =(filter) => {
  if(filter === "All") {
    return this.state.allPosts
  }
return this.state.allPosts.filter(post => post.category === filter)
}

  return (
     
      <div class="main" style={{ color: '#172717' }}>
      <Canvas style={{ background: '#A2CCB6' }} camera={{ position: [0, 0, 30] }}>
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.5} position={[300, 300, 4000]} />
        <Effect />
        <Content />
      </Canvas>
      
      <div className="image-left">
      <img alt="Tenant talk logo" src={TenTalk} height="102" width="840"/></div>
      <div className="posts-left" id="style-1">
      <AllPosts edit={this.handleEdit.bind(this)} posts={filterBy(this.state.filter)} replySubmit={this.newReply.bind(this)} replies={this.state.allReplies}/>
       </div>
       <div className="posts-right">
          <FilterByCat onChange={this.filterChange.bind(this)} category={this.state.filter} allCategories={this.state.allPosts}/>
      
            <NewMessageForm formType={this.state.formType} handleSubmit={this.handleSubmit.bind(this)} userList={this.state.allUsers}/>
            </div>
    </div> 
   
    
   
    
  
    
  );
}
}
export default App;
