import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import axios from 'axios';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    }
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    if(!this.state.submitted){
      this.setState({submitted: true});
      let {token} = await this.props.stripe.createToken({name: this.props.fname});
      if(token){
        axios.post('/api/payment', { id:token.id }).then(response => {
          this.setState({submitted: false});
          if (response.data.error)
            alert('Please Contact IT.\nError: ' + response.data.error);
          else
            this.props.onComplete();
        }).catch((err) => {
          this.setState({
            submitted: false
          });
          alert(err);
        });
      }
      else{
        this.setState({submitted: false});
        alert('not a valid card');
      }
    }
  }

  render() {
    return (
      <div className="checkout">
          <p>Would you like to complete the purchase?</p>
          <CardElement />
          {(this.state.submitted)?(<button class="FormField__Button">Purchase Processing</button>):(<button class="FormField__Button" onClick={this.submit}>Purchase $103.92</button>)}
          <p>$100 ticket downpayment + $3.92 stripe fee</p>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);