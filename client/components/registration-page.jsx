
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
    return <div className="login-page registration">
      <div className="main-block">
        <div className="left-block"><h2>Task manager</h2></div>
        <div className="right-block">
          <RegistrationForm onLoading={loading => this._onLoading(loading)} />
        </div>
      </div>
    </div>;
  }
}

class _RegistrationForm extends React.Component {
  constructor() {
    super();
    this.state = { email: '', password: '', confirm: '',
        name: '', error: '' };
    this.saveNew = this.saveNew.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }
  saveNew() {
    this.validate(() => {
      if (this.state.error != '') return;
      let  onLoading = this.props.onLoading || (() => {});
      onLoading(true);
      let info = { name: this.state.name, isAdmin: false}
      let user = {...this.state, username: this.state.email, info };

      Accounts.createUser(user, err => {
        onLoading(false);
        if (err) {
          this.setState({ error: err.reason });
        }
      });
    });
  }
  onCancel(){
    this.props.history.push('/login');
  }
  validate(cb) {
    var error = '';
    if (this.state.name.length == 0) {
      error = 'Full name is required';
    } else if (this.state.email.length == 0) {
      error = 'Email address required';
    } else if (this.state.password.length == 0) {
      error = 'Password required';
    } else if (this.state.confirm != this.state.password) {
      error = 'Password does not match';
    }
    this.setState({ error }, cb);
  }
  inputHandler(e,name){
    this.setState({[name]: e.target.value});
  }
  render() {
    return <div className="registration-block">
      <input placeholder="Full Name"
        onInput={(e)=> this.inputHandler(e,'name')}></input>
      <input placeholder="Email Address"
        onInput={(e)=> this.inputHandler(e,'email')}></input>
      <input type="password" placeholder="Enter Password"
        onInput={(e)=> this.inputHandler(e,'password')}></input>
      <input type="password" placeholder="Confirm Password"
        onInput={(e)=> this.inputHandler(e, 'confirm')}></input>
      <span className="error">{this.state.error}</span>
      <div className="buttons">
        <button className="save-btn" onClick={this.saveNew}>Save</button>
        <button className="cancel" onClick={this.onCancel}>Cancel</button>
      </div>

    </div>
  }
}

export var RegistrationForm = withRouter(_RegistrationForm);
