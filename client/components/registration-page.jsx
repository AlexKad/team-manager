
import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { withRouter } from 'react-router';

export class RegistrationPage extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  _onLoading(loading) {
    this.setState({ loading }, () => {
      if (this.state.loading === false && Meteor.userId()) {
        this.props.history.push('/page/dashboard');
      }
    });
  }
  render() {
    return <div className="registration-panel">
        <h3>Register a New Account</h3>
        <RegistrationForm onLoading={loading => this._onLoading(loading)} />
      </div>
  }
}

class _RegistrationForm extends React.Component {
  constructor() {
    super();
    this.state = { email: '', password: '', confirm: '',
        first: '', last: '', error: '' };
    this.submit = this.submit.bind(this);
  }
  submit() {
    if (this.state.error != '') return;
    let username = this.state.email;
    let profile = {};
    profile.name = { first: this.state.first, last: this.state.last };
    let user = {...this.state, username, profile};
    var onLoading = this.props.onLoading || (() => {});

    onLoading(true);
    Accounts.createUser(user, err => {
      onLoading(false);
      if (err) {
        this.setState({ error: err.reason });
      }
    });
  }
  validate() {
    var error = '';
    if (this.state.first.length == 0) {
      error = 'First name required';
    } else if (this.state.last.length == 0) {
      error = 'Last name required';
    } else if (this.state.email.length == 0) {
      error = 'Email address required';
    } else if (this.state.password.length == 0) {
      error = 'Password required';
    } else if (this.state.confirm != this.state.password) {
      error = 'Password does not match';
    }
    if (error != this.state.error) this.setState({ error });
  }
  inputHandler(e,name){
    this.setState({[name]: e.target.value});
  }
  render() {
    return <div>
      <input placeholder="First Name"
        onInput={(e)=> this.inputHandler(e,'first')}></input>
      <input placeholder="Last Name"
        onInput={(e)=> this.inputHandler(e,'last')}></input>
      <input placeholder="Email Address"
        onInput={(e)=> this.inputHandler(e,'email')}></input>
      <input type="password" placeholder="Enter Password"
        onInput={(e)=> this.inputHandler(e,'password')}></input>
      <input type="password" placeholder="Confirm Password"
        onInput={(e)=> this.inputHandler(e, 'confirm')}></input>
      <span>{this.state.error}</span>
      <button onClick={this.submit}>Submit</button>
    </div>
  }
}

export var RegistrationForm = withRouter(_RegistrationForm);
