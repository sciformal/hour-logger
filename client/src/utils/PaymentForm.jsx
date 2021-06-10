import React, {Component} from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

class PaymentForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      complete : props.complete
    }

    this.paymentCompleted = this.paymentCompleted.bind(this);
  }

  paymentCompleted(){
    this.props.onComplete();
    this.setState({complete: 1});
  }

  render() { // pk_test_nbQ9lK9IYk4N7looSOezebAx
    return (
      (this.state.complete) ? (
        <h2>Purchase Complete</h2> 
      ) : (
        <StripeProvider apiKey="pk_test_nbQ9lK9IYk4N7looSOezebAx"/*pk_live_Do2TZVeCWHyplaJOL7hVqWW1"*/>
          <div>
            <h2>Enter Your Payment Information Below</h2>
            <Elements>
              <CheckoutForm onComplete={this.paymentCompleted} />
            </Elements>
          </div>
        </StripeProvider>
      )
    );
  }
}

export default PaymentForm;