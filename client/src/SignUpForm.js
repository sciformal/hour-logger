import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import space from './img/space_login.png';
import user from './img/user2.png';
import classie from './classie.js';
import { Container, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import verifyInput from './utils/input-helper.js';

class SignUpForm extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      loggedIn: false,
      email: '',
      pswd: '',
      cpswd: '',
      fname: '',
      lname: '',
      stu_no: '',
      location: '',
      userType: '',
      showLocation: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.changeCSS();
  }

  componentDidMount() {
    this.changeCSS();
  }

  handleChange(e) {
    this.changeCSS();
    let target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    let stateObj = {
      [name]: value
    }

    if (target.name === "userType") {
      if (target.value === "intern150" || target.value === "intern300" || target.value === "exempt") {
        stateObj.showLocation = true;
      }
      else {
        stateObj.showLocation = false;
      }
    }

    this.setState(stateObj);
  }

  changeCSS() {
    // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
      (function () {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function () {
          return this.replace(rtrim, '');
        };
      })();
    }
    [].slice.call(document.querySelectorAll('input.input__field')).forEach(function (inputEl) {
      // in case the input is already filled..
      if (inputEl.value.trim() !== '') {
        classie.add(inputEl.parentNode, 'input--filled');
      }
      // events:
      inputEl.addEventListener('focus', onInputFocus);
      inputEl.addEventListener('blur', onInputBlur);
    });
    function onInputFocus(ev) {
      classie.add(ev.target.parentNode, 'input--filled');
    }
    function onInputBlur(ev) {
      if (ev.target.value.trim() === '') {
        classie.remove(ev.target.parentNode, 'input--filled');
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const state = this.state;

    if (state.pswd === state.cpswd) {
      const data = {
        email: state.email,
        pswd: state.pswd,
        fname: state.fname,
        lname: state.lname,
        stu_no: state.stu_no,
        userType: state.userType
      }

      if (state.userType === "intern150" || state.userType === "intern300" || state.userType === "exempt") {
        data.location = state.location;
      }
      else {
        data.location = "Kingston, ON";
      }
      if (verifyInput.email(data.email)) {
        if (verifyInput.studentNum(data.stu_no)) {
          if (verifyInput.password(data.pswd)) {
            if (verifyInput.word(data.fname) && verifyInput.word(data.lname)) {
              if(data.userType === "intern150" || data.userType === "intern300" || data.userType === "exempt" || data.userType === "student" || data.userType === "guest" || data.userType === "intern"){
                if (verifyInput.str(data.location)) {
                let self = this;
                axios.post('./api/register', data)
                  .then(res => {
                    self.setState({ loggedIn: true, user: res.data });
                  }).catch((err) => {
                    alert(err);
                  });
                  }
                else {
                  alert('Please fill in location field.');
                }
              }
              else{
                alert('Please select a user type.');
              }
            }
            else {
              alert('Please enter in your name (without spaces).');
            }
          }
          else {
            alert('Password not long enough.');
          }
        }
        else {
          alert('Please enter valid student number.');
        }
      }
      else {
        alert('Please enter valid email.');
      }
    }
    else {
      alert('Passwords do not match, Please try again.');
    }
  }



  render() {
    return (
      this.state.loggedIn ? (
        <Redirect push to={{
          pathname: '/user',
          state: this.state.user
        }} />
      ) : (<div className="d-md-flex h-md-100 align-items-center">
        <div className="col-md-5 p-0 h-md-100">
          <div className="d-md-flex align-items-center bg-space  h-100 p-5 text-center justify-content-center">
            <div className="logoarea pt-5 pb-5">

            </div>
          </div>
        </div>

        <div className="col-md-7 p-0 bg-white h-md-100 loginarea">
          <div className="d-md-flex bg-space-input align-items-center h-md-100 p-5 justify-content-center">
            <div className="FormCenter">
              <i className="fas fa-5x fa-user-astronaught icon icon--kohana"></i>

              <form onSubmit={this.handleSubmit} className="FormFields align-items-center">
                <i className="fas fa-7x fa-user-astronaut astro"></i>

                <h1 className="AppTitle">Create Account</h1>
                


                <div className="form-row">
                <div className="col-auto input input--kohana">
                  <input className="input__field input__field--kohana" value={this.state.fname} type="text" id="fname" name="fname" onChange={this.handleChange} />
                  <label className="input__label input__label--kohana" for="input-1">
                    <i className="fa fa-fw fa-user icon icon--kohana"></i>
                    <span className="input__label-content input__label-content--kohana"><i className="fa fa-user"></i>&nbsp;&nbsp;&nbsp;&nbsp;First Name</span>
                  </label>
                </div>

                <div className="col-auto input input--kohana">
                  <input className="input__field input__field--kohana" value={this.state.lname} type="text" id="lname" name="lname" onChange={this.handleChange} />
                  <label className="input__label input__label--kohana" for="input-2">
                    <i className="fa fa-fw fa-user icon icon--kohana"></i>
                    <span className="input__label-content input__label-content--kohana"><i className="fa fa-user"></i>&nbsp;&nbsp;&nbsp;&nbsp;Last Name</span>
                  </label>
                </div>

                </div>
                
                <div className="form-row">
                <div className="col-auto input input--kohana">
                  <input className="input__field input__field--kohana" value={this.state.email} type="text" id="email" name="email" onChange={this.handleChange} />
                  <label className="input__label input__label--kohana" for="input-3">
                    <i className="fas fa-fw fa-paper-plane icon icon--kohana"></i>
                    <span className="input__label-content input__label-content--kohana"><i className="fas fa-paper-plane"></i>&nbsp;&nbsp;&nbsp;&nbsp;Email</span>
                  </label>
                </div>
                
                <div className="col-auto input input--kohana">
                  <input className="input__field input__field--kohana" value={this.state.stu_no} type="text" id="stu_no" name="stu_no" onChange={this.handleChange} />
                  <label className="input__label input__label--kohana" for="input-4">
                    <i className="fas fa-fw fa-crown icon-c icon--kohana"></i>
                    <span className="input__label-content input__label-content--kohana"><i className="fas fa-crown"></i>&nbsp;&nbsp;&nbsp;&nbsp;Student Number</span>
                  </label>
                </div>
                
                </div>
                <div className="form-row">
                {/*<div className="input input--kohana">
                  <input className="input__field input__field--kohana" type="text" id="stu_no" name="stu_no" />
                  <label className="input__label input__label--kohana" for="input-3">
                    <i className="fas fa-fw fa-crown icon-c icon--kohana"></i>
                    <span className="input__label-content input__label-content--kohana"><i className="fas fa-crown"></i>&nbsp;&nbsp;&nbsp;&nbsp;Internship/Student</span>
                  </label>
      </div>*/}
                
                <div className="col-auto input input--kohana">
                  <input className="input__field input__field--kohana" value={this.state.pswd} type="password" id="pswd" name="pswd" onChange={this.handleChange} />
                  <label className="input__label input__label--kohana" for="input-5">
                    <i className="fa fa-fw fa-lock icon icon--kohana"></i>
                    <span className="input__label-content input__label-content--kohana"><i className="fa fa-lock"></i>&nbsp;&nbsp;&nbsp;&nbsp;Password</span>
                  </label>
                </div>
                <div className="col-auto input input--kohana">
                  <input className="input__field input__field--kohana" value={this.state.cpswd} type="password" id="cpswd" name="cpswd" onChange={this.handleChange} />
                  <label className="input__label input__label--kohana" for="input-6">
                    <i className="fa fa-fw fa-lock icon icon--kohana"></i>
                    <span className="input__label-content input__label-content--kohana"><i className="fa fa-lock"></i>&nbsp;&nbsp;&nbsp;&nbsp;Confirm Password</span>
                  </label>
                </div>
                </div>
                <div className="form-row">
                  <div className="">
                    <div className="input col-auto drop input--kohana">
                  
                      <select className="input__field input__field--kohana" id="userType" name="userType" onChange={this.handleChange}>
                      
                        <option>User Type</option>
                        <option value="student">Regular Attendee</option>
                        <option value="guest">Guest</option>
                        <option value="intern">Internship in Kingston</option>
                        <option value="intern150">Internship within 150km</option>
                        <option value="intern300">Internship within 300km</option>
                        <option value="exempt">Internship over 300km</option>
                      
                        
                      </select>
                    </div>
                  </div>
                  

                  {this.state.showLocation ? (
                  <div className="col-auto input input--kohana">
                    <input className="input__field input__field--kohana" type="text" id="location" name="location" onChange={this.handleChange} />
                    <label className="input__label input__label--kohana" for="input-8">
                      <i className="fa fa-fw fa-map-marker-alt icon icon--kohana"></i>
                      <span className="input__label-content input__label-content--kohana"><i className="fa fa-user"></i>&nbsp;&nbsp;&nbsp;&nbsp;City, Province</span>
                    </label>
                  </div>) : (<div><br /><br /><br /></div>)}

                  </div>
                  {/*@TODO Finish adding the options 
                        student:{
                            final: 10,
                            regular: 18
                        },
                        guest:{
                            final: 6,
                            regular: 6
                        },
                        intern:{
                            final: 0,
                            regular: 20,
                        },
                        intern150:{
                            final: 0,
                            regular: 15
                        },
                        intern300: {
                            final: 0,
                            regular: 10
                        },
                        exempt: {
                            final: 0,
                            regular: 0
                        }
                  */}
                  
                  
                  
                
                
                

                <div className="FormField">
                  <Link to="/" className="FormField__Link">I'm already a member</Link>
                </div>
                <br />
                <div className="FormField">
                  <button type="submit" className="FormField__Button" onClick={this.handleSubmit}>Sign Up</button>
                </div>

              </form>
            </div>

          </div>
        </div>

      </div>)
    );
  }
}

export default SignUpForm;
