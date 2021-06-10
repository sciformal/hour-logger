import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import engsoc from './img/engsoc-s.png';
import user from './img/user2.png';
import space from './img/space_login_curved.png';
import { Container, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import classie from './classie.js';
import Admin from './Admin.js';
import Manager from  './Manager.js';
import User from './User.js';

const loginPages = [Admin, Manager, User];
const loginImages = [];
/*import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';*/
/*import { library } from '@fontawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fontawesome/react-fontawesome';
import { faIgloo } from '@fontawesome/free-solid-svg-icons';*/

//library.add(faIgloo);

class SignInForm extends Component {

  //type of login in the props
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      user: {},
      loginError: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.redirectPaths = ['/admin',  '/manager', '/user'];
    this.loginNames    = ['Admin', 'Manager', 'User'];
    this.changeCSS();
  }

  componentDidMount(){
    this.changeCSS();
  }

  componentWillMount(){
    this.changeCSS();
  }

  handleChange(e) {
    this.changeCSS();
    let target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  changeCSS() {
    // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
      (function() {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
          return this.replace(rtrim, '');
        };
      })();
    }
    [].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
      // in case the input is already filled..
      if( inputEl.value.trim() !== '' ) {
        classie.add( inputEl.parentNode, 'input--filled' );
      }
      // events:
      inputEl.addEventListener( 'focus', onInputFocus );
      inputEl.addEventListener( 'blur', onInputBlur );
    } );
    function onInputFocus( ev ) {
      classie.add( ev.target.parentNode, 'input--filled' );
    }
    function onInputBlur( ev ) {
      if( ev.target.value.trim() === '' ) {
        classie.remove( ev.target.parentNode, 'input--filled' );
      }
    }
  }

  

  handleSubmit(event) {
    event.preventDefault();

    // const data = {
    //   email: this.state.email,
    //   password: this.state.password,
    //   userLevel: this.props.type
    // }
    // this.setState({
    //   loginError: false,
    //   password: ''
    // });
    let self = this;

    // axios.post('./api/login', data)
    //   .then(res => {
    //     if(res.data.success){
    //       self.setState({loggedIn: true, user: res.data});
    //     }
    //   }).catch(err => {
    //     self.setState({loginError:true});
    //   });
    self.setState({loggedIn: true})
  }

  render() {

    if(this.loginNames[this.props.type]=="Admin" || this.loginNames[this.props.type]=="Manager"){
      return (
        this.state.loggedIn ? (
          <Redirect push to={{
            pathname: this.redirectPaths[this.props.type],
            state: this.state.user
          }}/>
        ) : ( 
  
            <div className="d-md-flex h-md-100 align-items-center">
              <div className="col-md-6 p-0 h-md-100">
                <div className="d-md-flex align-items-center bg-space-admin  h-100 p-5 text-center justify-content-center">
                  <div className="logoarea pt-5 pb-5">
                    
                  </div>
                </div>
              </div>
  
              <div className="col-md-6 p-0 bg-white h-md-100 loginarea">
                <div className="d-md-flex align-items-center h-md-100 p-5 bg-space-input justify-content-center">
                  <div className="FormCenter ">
                    <form onSubmit={this.handleSubmit} className="FormFields">
                      <i className="fas fa-7x fa-user-astronaut astro"></i>
                      <h1 className="AppTitle">Welcome Back</h1>
                      <h4 >{this.loginNames[this.props.type]} Login</h4>
                      <br/>
  
                      <div className="input input--kohana">
                        <input className="input__field input__field--kohana" value={this.state.email} type="text" id="input-3" name="email" onChange={this.handleChange}/>
                        <label className="input__label input__label--kohana" for="input-3">
                          <i className="fas fa-fw fa-crown icon-c icon--kohana"></i>
                          <span className="input__label-content input__label-content--kohana"><i className="fas fa-crown icon-before"></i>&nbsp;&nbsp;&nbsp;&nbsp;Email</span>
                        </label>
                      </div>
                      
                      <div className="input input--kohana">
                        <input className="input__field input__field--kohana" value={this.state.password} type="password" id="input-4" name="password" onChange={this.handleChange}/>
                        <label className="input__label input__label--kohana" for="input-4">
                          <i className="fa fa-fw fa-lock icon icon--kohana"></i>
                          <span className="input__label-content input__label-content--kohana"><i className="fa fa-lock icon-before"></i>&nbsp;&nbsp;&nbsp;&nbsp;Password</span>
                        </label>
                      </div>
                      
                      <br />
                      <div className="FormField">
                        <button type="submit" className="FormField__Button" onClick={this.handleSubmit}>Sign In</button>
                      </div>
                      {this.state.loginError?(<div className='error-message'>Invalid login attempt</div>):(<div><br /><br /></div>)}
                      <br />
  
                    </form>
                  </div>
                </div>
              </div>
  
            </div>
  
          )
  
  
      );
      
    }
    else{
      return (
        this.state.loggedIn ? (
          <Redirect push to={{
            pathname: this.redirectPaths[this.props.type],
            state: this.state.user
          }}/>
        ) : ( 
  
            <div className="d-md-flex h-md-100 align-items-center">
              <div className="col-md-7 p-0 h-md-100">
                <div className="d-md-flex align-items-center bg-space  h-100 p-5 text-center justify-content-center">
                  <div className="logoarea pt-5 pb-5">
                    
                  </div>
                </div>
              </div>
  
              <div className="col-md-5 p-0 bg-white h-md-100 loginarea center">
                <div className="d-md-flex align-items-center h-md-100 p-5 bg-space-input justify-content-center">
                  <div className="FormCenter ">
                    <form onSubmit={this.handleSubmit} className="FormFields">
                      <i className="fas fa-7x fa-user-astronaut astro"></i>
                      <h1 className="AppTitle">Welcome Back</h1>
                      <h4 >{this.loginNames[this.props.type]} Login</h4>
                      <br/>
  
                      <div className="input input--kohana">
                        <input className="input__field input__field--kohana" value={this.state.email} type="text" id="input-3" name="email" onChange={this.handleChange}/>
                        <label className="input__label input__label--kohana" for="input-3">
                          <i className="fas fa-fw fa-crown icon-c icon--kohana"></i>
                          <span className="input__label-content input__label-content--kohana"><i className="fas fa-crown icon-before"></i>&nbsp;&nbsp;&nbsp;&nbsp;Email</span>
                        </label>
                      </div>
                      
                      <div className="input input--kohana">
                        <input className="input__field input__field--kohana" value={this.state.password} type="password" id="input-4" name="password" onChange={this.handleChange}/>
                        <label className="input__label input__label--kohana" for="input-4">
                          <i className="fa fa-fw fa-lock icon icon--kohana"></i>
                          <span className="input__label-content input__label-content--kohana"><i className="fa fa-lock icon-before"></i>&nbsp;&nbsp;&nbsp;&nbsp;Password</span>
                        </label>
                      </div>
                      
                      <div className="FormField">
                        <Link to="/sign-up" className="FormField__Link">Don't have an account?</Link>
                      </div>
                      <div className="FormField">
                        <Link to="/forgot" className="FormField__Link">I can't remember my password</Link>
                      </div>
                      
                      <br />
                      <div className="FormField">
                        <button type="submit" className="FormField__Button" onClick={this.handleSubmit}>Sign In</button>
                      </div>
                      {this.state.loginError?(<div className='error-message'>Invalid login attempt</div>):(<div><br /><br /></div>)}
                      <br />
  
                    </form>
                  </div>
                </div>
              </div>
  
            </div>
  
          )
  
  
      );
      
    }
    

    
  }
}

export default SignInForm;