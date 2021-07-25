import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import '../styles/App.css';
import logo from '../img/gear.png';
import Navbar from '../utils/SciNavbar.js';

class Manager extends Component {
  constructor(props, context){
    super(props, context);

    this.state = {
      errorCount: 0,
      response: '',
      responseToPost: '',
      cardError:false,
      cardInput: '',
      user: null,
      loaded: false,
      redirect: false,
      finalHours: 0,
      regularHours: 0
    };

    this.loadData = this.loadData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.redirect     = this.redirect.bind(this);
    this.hourTypeHandler = this.hourTypeHandler.bind(this);
  }

  loadData(accept, reject) {

    axios.get('/api/refresh')
        .then((res) => {
          if(res.data && res.data.userLevel === 1){
            accept(res);
          }
          else{
            // throw 'Bad Response, Contact Support';
          }
      }).catch((err) => {
        reject();
      });
  }

  redirect(){
    this.setState({redirect: true});
  }

  componentDidMount() {

    let success = (res) =>{
      // runs on success
      this.setState({
        users: res.data.data,
        loaded: true
      });
    }

    let failure = () => {
      this.setState({redirect: true});
    }

    if(!this.props.location.state){
      this.loadData(success, failure);
    }else{
      this.setState({
        users: this.props.location.state.data,
        loaded: true
      });
    }
  }

  handleSubmit(e){
    e.preventDefault();
    var regex = new RegExp('\\d\\d\\d\\d\\d\\d\\d\\d','');
    var studentNumber = this.state.cardInput.match(regex);
    if(studentNumber){
      var location = this.state.location;
      if(location === 'Warehouse' || location === 'Grant Hall'){
        var finalHours = this.state.finalHours;
        var regularHours = this.state.regularHours;
        if((finalHours && !regularHours) || (!finalHours && regularHours)){
          this.setState({
            cardInput: '',
            cardError: false
          });
          this.logNumber(studentNumber[0], location, finalHours);
        }
        else{
          this.setState({
            cardInput: '',
            cardError:true,
            responseToPost: 'Please select one hour type'
          });
        }
      }
      else{
        this.setState({
          cardInput: '',
          cardError:true,
          responseToPost: 'Please select location'
        });
      }
    }
    else{
      this.setState({
        cardInput: '',
        cardError:true,
        responseToPost: 'Unable to read card'
      });
    }
  };

  logNumber(studentNumber, location, final){
    this.setState({responseToPost: null});

    let body = {
      user: studentNumber,
      location: location,
      final: final
    }

    axios.post('/api/log-number', body)
      .then((res) => {
        this.setState({
          responseToPost: res.data.message,
          cardError: res.data.error
        });
      }).catch((err) => {alert('Try logging in again or contact IT manager.');});
  }

  hourTypeHandler(e){
    if(e.target.name === 'regularHours')
      this.setState({
        regularHours: !this.state.regularHours,
        finalHours: 0
      });
    else
      this.setState({
        regularHours: 0,
        finalHours: !this.state.finalHours
      })
  }

  displayMessage = () => {
    if(this.state.responseToPost !== '' && this.state.responseToPost !== null){
      if(this.state.cardError){
        return(
          <div className='error-message'>
            <p>
              {this.state.responseToPost.split('??').map(line => {
                return (<span>{line}<br /></span>);
              })}
            </p>
          </div>)
      } 
      else{
        return(
        <div className='success-message'>{/*this.state.responseToPost.error ? 'error-message':'success-message'*/}
          <p>
            <b>
              {this.state.responseToPost.split('??').map(line => {
                return (<span>{line}<br /></span>);
              })}
            </b>
          </p>
        </div>)
      }
    }
  }

  render() {
    return (
      (this.state.redirect)?(
        <Redirect push to={{
          pathname: '/login-manager',
        }}/>
      ):(
        (this.state.loaded)?(
          <div className="App">
          <Navbar user={this.state.admin} redirect={this.redirect} /> {/* Our Special imported navbar with logout functionality */}
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Swipe Student Card to Start/Stop Tracking Hours
              </p>
              
            </header>
            <p>{this.state.response}</p>
            <form className='center-manager' onSubmit={this.handleSubmit}>
              <div>
                <p>
                  <strong>Click in the input field then swipe card:</strong>
                </p>
                <input
                  type="text"
                  value={this.state.cardInput}
                  onChange={e => this.setState({ cardInput: e.target.value })}
                />
                <br />
                <br />
                Location:&nbsp;
                <select onChange={e => this.setState({location: e.target.value})}>
                  <option>Choose One</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Grant Hall">Grant</option>
                </select>
              </div>
              <div className='inline'>
                Hour Type: regular&nbsp;
                <input onClick={this.hourTypeHandler} checked={this.state.regularHours} type='checkbox' name='regularHours'/>
                &nbsp;or final&nbsp;
                <input onClick={this.hourTypeHandler} checked={this.state.finalHours} type='checkbox' name='finalHours' />
              </div>
            </form>
            {this.displayMessage()}
          </div>
        ):(
          <div>
        </div>
        )
      )
    );
  }
}

export default Manager;
