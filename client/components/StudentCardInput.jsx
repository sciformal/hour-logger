import React,{ Component } from 'react';
import { connect } from "react-redux";



class StudentCardInput extends Component{
    constructor(props){
        super(props);
        this.state = {
            cardInput: '',
            error: false,
            submit: false,
            response: ''
        }
    }
    handleSubmit = e => {
        e.preventDefault();
        var regex = new RegExp('\\d\\d\\d\\d\\d\\d\\d\\d','');
        var studentNumber = this.state.cardInput.match(regex);
        if(studentNumber){
            this.logNumber(studentNumber[0]);
        }else{
            this.setState({error:true});
        }
        this.setState({cardInput:'',submit:true});
    }

    logNumber = async studentNum => {

        var response = await fetch('/log-number',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({
                number:studentNum
            })
        });

        var body = await response.text();
        var jsonBody = JSON.parse(body);

        if(jsonBody.message){
            this.setState({response:jsonBody.message});
        }
        else{
            this.setState({
                response:'Student not found',
                error:true
            });
        }
    }

    saveInput = evt => {
        this.setState({
            cardInput: evt.target.value
        });
    }

    render(){
        console.log(this.props);
        return (
            <div className='student-card-input'>
                <form onSubmit={this.handleSubmit}>
                    <input type='text' name='student-number' onChange={this.saveInput} value={this.state.cardInput}></input>
                    <button type='submit'>Submit</button>
                    <p>{(this.state.submit) ? (this.state.error ? ('Failure'+this.state.response):('Success, Welcome '+this.state.response)):('')}</p>
                </form>
            </div>
        );
    }
} 

const mapStateToProps = (state) => {
    return {
        credentials:state.credentials,
        authenticated:state.authenticated
    }
}


export default connect(mapStateToProps)(StudentCardInput);