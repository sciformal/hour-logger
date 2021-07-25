import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { Redirect } from 'react-router';
import Countdown from './Countdown';
import PaymentForm from '../utils/PaymentForm';
import Navbar from '../utils/SciNavbar.js';

class User extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      percent: 30,
      percent2: 25,
      color: '#5a058e',
      color2: '#5a058e',
      redirect: false,
      loaded: false,
      user: {
        hoursWorked: 10,
        hoursRequired: 20,
      },
      paymentPage: 0
    };

    this.changeState = this.changeState.bind(this);
    this.redirect = this.redirect.bind(this);
    this.loadData = this.loadData.bind(this);
    this.togglePage = this.togglePage.bind(this);
    this.otherLink = this.otherLink.bind(this);
    this.getUserData = this.getUserData.bind(this);

    if(props.history.action === 'POP'){
      this.getUserData();
    }
  }

  changeState() {
    const colorMap = ['#c449ed', '#ba88d8', '#5a058e'];
    const value = Math.floor(Math.random() * 100);
    const value2 = Math.floor(Math.random() * 100);
    var num = 0;
    var num2 = 0;


    if (value < 33) {
      num = 1;
    }
    else if (33 < value && value < 66) {
      num = 0;
    }
    else if (value > 66) {
      num = 2;
    }
    if (value2 < 33) {
      num2 = 1;
    }
    else if (33 < value2 && value2 < 66) {
      num2 = 0;
    }
    else if (value2 > 66) {
      num2 = 2;
    }
    const colorPicked = colorMap[num];
    const colorPicked2 = colorMap[num2];

    this.setState({
      percent: value,
      color: colorPicked,
      percent2: value2,
      color2: colorPicked2,
    });
  }

  getUserData(){
    let success = (res) => {
      // runs on success

      console.log(res);
      this.setState({
        user: {
          hoursWorked: 10,
          hoursRequired: 20,
        },
        loaded: true,
        mounted:true
      });
    }

    let failure = () => {
      this.setState({ redirect: true });
    }

    this.loadData(success, failure);
  }

  loadData(accept, reject) {
    axios.get('/api/refresh')
      .then((res) => {
        if (res.data && res.data.userLevel === 2) {
          console.log(res.data);
          accept(res);
        }
        else {
          this.setState({ redirect: true });
        }
      }).catch(() => {
        reject();
      });
  }

  redirect() {
    this.setState({ redirect: true });
  }

  componentDidMount() {
    if (!this.props.location.state) {
      this.getUserData();    
    }
    else{
      this.setState({
        user: {
          hoursWorked: 10,
          hoursRequired: 23,
        },
        loaded: true
      });
    }
  }

  otherLink(){
    return (!this.state.paymentPage)?('Make a Payment'):('View Hours');
  }

  togglePage(self){
    self.setState({
      paymentPage: !self.state.paymentPage
    });
  }

  onCompletePayment(self){
    self.setState({
      user:{
        ...this.state.user,
        firstPayment: 1,
      }
    });
    console.log(self);
  }

  render() {
    // if(!this.state.mounted){
    //   this.getUserData();
    //   return (<div></div>)
    // }
    return (
      (this.state.redirect) ? (
        <Redirect push to={{
          pathname: '/',
        }} />
      ) : (
          (this.state.loaded) ? (
            <div className="App">
              <Navbar link={this.otherLink()} linkAction={() => {this.togglePage(this)}} user={this.state.user} redirect={this.redirect} />
                {(!this.state.paymentPage) ? (
                  <div class="center">
                    <div class="cards-list">

                      <div class="card bg-gradient1 1">
                        <div class="card_title title-white">
                          <p>{this.state.user.hoursWorked} / {this.state.user.hoursRequired}</p>
                        </div>
                        <div class="card_title2 title-white">
                          <p>Regular Hours Completed</p>
                        </div>
                      </div>
                      <div className="col-auto center">
                        <h1 className="AppTitle " fontWeight="700">Sci Formal is in</h1>
                        <Countdown color='#6e6e6e' date={`2019-11-02T09:00:00`} />
                      </div>
                      <div class="card bg-gradient1 4">
                        <div class="card_title title-white">
                          <p>{this.state.user.finalHoursWorked} / {this.state.user.finalHoursRequired}</p>
                        </div>
                        <div class="card_title2 title-white">
                          <p>Final Hours Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ):(
                  <div class="payment center">
                    <PaymentForm complete={this.state.user.firstPayment} onComplete={() => {this.onCompletePayment(this)}}/>
                    <p>Any Questions please email sciformal.finance@engsoc.queensu.ca</p>
                  </div>
                )}
            </div>
          )
            : (
              <div>
              </div>
            )
        )
    );
  }
}

export default User;
