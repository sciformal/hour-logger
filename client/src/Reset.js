import React, { Component } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import engsoc from './img/engsoc-s.png';
import user from './img/user2.png';
import space from './img/space_login_curved.png';
import { Container, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import classie from './classie.js';
import verify from './utils/input-helper.js'

class Reset extends Component {

  //type of login in the props
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      verifyPassword: '',
      success: 0,
      error: 0,
      message: '',
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeCSS();
  }

  componentDidMount(){
    this.changeCSS();
  }

  componentWillMount(){
    this.changeCSS();
  }

  getMessage(){
    if(this.state.error){
        return (<div className="error-message"><p>{this.state.message}</p></div>)
    }
    else if(this.state.success){
        return (<div className="success-message"><p>{this.state.message}</p></div>)
    }
    else{
        return (<div><br /><br /></div>)
    }
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
    if(!this.state.submitted){
        if(this.state.password == this.state.verifyPassword){
            if(verify.password(this.state.password)){
                this.setState({
                    submitted: true
                });
                let url = window.location.pathname;
                axios.post(url, {pswd: this.state.password})
                .then(res => {
                    if(res.data.success){
                        this.setState({
                            error: 0,
                            submitted: false,
                            success: 1,
                            message: res.data.message
                        });
                    }
                    else{
                        this.setState({
                            submitted: false,
                            success: 0,
                            error: 1,
                            message: res.data.message
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    this.setState({error: 1, success: 0, submitted: false, message:'Submission error'});
                    alert(err);
                });
            }
            else{
                alert('Come on, put in a better password');
            }
        }
        else{
            alert('Passwords do not match!');
        }
    }
  }

  render() {
      return (
            <div className="d-md-flex h-md-100 align-items-center">
              <div className="col-md-4 p-0 h-md-100">
                <div className="d-md-flex align-items-center bg-space-admin  h-100 p-5 text-center justify-content-center">
                  <div className="logoarea pt-5 pb-5">
                    
                  </div>
                </div>
              </div>
              {(this.state.success)?(
                <div className="col-md-8 p-0 bg-white h-md-100 loginarea">
                <div className="d-md-flex align-items-center h-md-100 p-5 bg-space-input justify-content-center">
                  <div className="FormCenter ">
                    <i className="fas fa-7x fa-user-astronaut astro"></i>
                    <h1 className="AppTitle">Success!</h1>
                    <h4 >{this.state.message}</h4>
                    <br/>
                    <div className="FormField">
                    <Link to="/" className="FormField__Link"><h5>Go to sign in</h5></Link>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
              ):(
              <div className="col-md-8 p-0 bg-white h-md-100 loginarea">
                <div className="d-md-flex align-items-center h-md-100 p-5 bg-space-input justify-content-center">
                  <div className="FormCenter ">
                    <form onSubmit={this.handleSubmit} className="FormFields">
                      <i className="fas fa-7x fa-user-astronaut astro"></i>
                      <h2 className="AppTitle">Reset Password</h2>
                      <h4 >Enter Your New</h4>
                      <h4> Password Below: </h4>
                      <br/>
                      <div className="input input--kohana">
                        <input className="input__field input__field--kohana center" value={this.state.password} type="password" id="input-1" name="password" onChange={this.handleChange}/>
                        <label className="input__label input__label--kohana" for="input-3">
                          <i className="fas fa-fw fa-lock icon-c icon--kohana"></i>
                          <span className="input__label-content input__label-content--kohana"><i className="fas fa-crown icon-before"></i>&nbsp;&nbsp;&nbsp;&nbsp;Password</span>
                        </label>
                      </div>
                      <div className="input input--kohana">
                        <input className="input__field input__field--kohana center" value={this.state.verifyPassword} type="password" id="input-2" name="verifyPassword" onChange={this.handleChange}/>
                        <label className="input__label input__label--kohana" for="input-3">
                          <i className="fas fa-fw fa-lock icon-c icon--kohana"></i>
                          <span className="input__label-content input__label-content--kohana"><i className="fas fa-crown icon-before"></i>&nbsp;&nbsp;&nbsp;&nbsp;Verify Password</span>
                        </label>
                      </div>
                      <br />
                      <div className="FormField">
                        {(this.state.submitted)?(<button type="submit" className="FormField__Button">Change Pending</button>):(<button type="submit" className="FormField__Button" onClick={this.handleSubmit}>Change Password</button>)}
                      </div>
                      {this.getMessage()}
                      <br />
                    </form>
                  </div>
                </div>
              </div>
            )}
            </div>
        );
    }
}

export default Reset;