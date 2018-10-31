import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import 'tachyons'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'



const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  // componentDidMount() {
  //   fetch('https://ghoulish-vault-81345.herokuapp.com/')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }


  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    const clarifaiFaces = data.outputs[0].data.regions;
    const facesArray = []
    clarifaiFaces.forEach((element) => {
      const clarifaiFace = element.region_info.bounding_box;
      facesArray.push({
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      })
    })
    return facesArray;
  }

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    fetch('https://ghoulish-vault-81345.herokuapp.com/imageurl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://ghoulish-vault-81345.herokuapp.com/image', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }


  render() {
    const { isSignedIn, imageUrl, route, box } = this.state
    return (
      <div className="App">
        {/* <Particles className='particles'
                params={particlesOptions}
              /> */}
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {
          route === 'home'
            ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
            : (
              route === 'signin'
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;




// { 
//   if (this.state.route === 'home') {
//   <div>
//       <Logo />
//       <Rank />
//       <ImageLinkForm
//         onInputChange={this.onInputChange}
//         onButtonSubmit={this.onButtonSubmit} />
//       <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
//   </div>
// } else if (this.state.route === 'signin') {
//     <Signin onRouteChange={this.onRouteChange} />
// } else if (this.state.route === 'signout') {
//   <Signin onRouteChange={this.onRouteChange} />
// } else {
//   <Register onRouteChange={this.onRouteChange}/>
// }
// }


// const particlesOptions = {
//   "particles": {
//     "number": {
//       "value": 30,
//       "density": {
//         "enable": true,
//         "value_area": 800
//       }
//     },
//     "color": {
//       "value": "#ffffff"
//     }
//   }
// }



  // calculateFaceLocation = (data) => {
  //   console.log(data)
  //   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
  //   const image = document.getElementById('inputimage')
  //   const width = Number(image.width)
  //   const height = Number(image.height)
  //   return {
  //     leftCol: clarifaiFace.left_col * width,
  //     topRow: clarifaiFace.top_row * height,
  //     rightCol: width - (clarifaiFace.right_col * width),
  //     bottomRow: height - (clarifaiFace.bottom_row * height)
  //   }
  // }

  // calculateFaceLocation = (data) => {
  //   const image = document.getElementById('inputimage')
  //   const width = Number(image.width)
  //   const height = Number(image.height)

  //   data.outputs[0].data.regions.map(faces => {
  //     const clarifaiFace = faces.region_info.bounding_box
  //     return {
  //       leftCol: clarifaiFace.left_col * width,
  //       topRow: clarifaiFace.top_row * height,
  //       rightCol: width - (clarifaiFace.right_col * width),
  //       bottomRow: height - (clarifaiFace.bottom_row * height)
  //     }
  //   })
  // }