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

  render() {
    return <form onSubmit={this.submit} className="login-form">
      <input placeholder="email" autoComplete="username email"
        onInput={(e)=> this.setState({ 'email': e.target.value }) } />
      <input placeholder="password" type="password" autoComplete="current-password"
        onInput={(e)=> this.setState({ 'password': e.target.value })} />
      <div className="login-error">{this.state.error}</div>
      <div>
        <input type="submit" value="Login" className="submit-btn"/>
        <button className="register-btn">Register</button>
      </div>
      {/* { <Link to="/registration" className="registration-link">Create new account</Link> } */}
    </form>
  }
}

export let LoginForm = withRouter(_LoginForm);
