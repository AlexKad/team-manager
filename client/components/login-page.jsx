import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

export class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return <div className="login-page">
      <div className="main-block">
        <div className="left-block"><h2>Task manager</h2></div>
        <div className="right-block">
          <LoginForm />
        </div>
      </div>
    </div>;
  }
}

class _LoginForm extends React.Component {
  constructor() {
    super();
    this.state = { email: '', password: '' };
    this.submit = this.submit.bind(this);
    this.validate = this.validate.bind(this);
    this.registerNew = this.registerNew.bind(this);
  }
  validate(cb) {
    var error = '';
    if (this.state.email.length == 0) {
      error = 'Email required';
    } else if (this.state.password.length == 0) {
      error = 'Password required';
    }
    this.setState({ error }, cb);
  }
  submit(e) {
    e.preventDefault();
    this.validate(() => {
      const { email, password, error } = this.state;
      if (error != '') return;
      const { onLoading = () => {} } = this.props;
      onLoading(true);
      Meteor.loginWithPassword(email, password, err => {
        onLoading(false);
        if (err) this.setState({ error: err.reason });
        else this.props.history.push('/dashboard');
      });
    });
  }
  registerNew(){
    this.props.history.push('/registration');
  }

  render() {
    return <form onSubmit={this.submit} className="login-form">
      <input placeholder="email" autoComplete="username email"
        onInput={(e)=> this.setState({ 'email': e.target.value }) } />
      <input placeholder="password" type="password" autoComplete="current-password"
        onInput={(e)=> this.setState({ 'password': e.target.value })} />
      <span className="error">{this.state.error}</span>
      <div className='buttons'>
        <button type="submit" className="submit-btn">Login</button>
        <button type="button" onClick={this.registerNew} className="register-btn">Register</button>
      </div>
    </form>
  }
}

export let LoginForm = withRouter(_LoginForm);
