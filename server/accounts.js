Accounts.onCreateUser(function(options, user) {
   let info = options.info;
   user.info = info;
   return user;
});
