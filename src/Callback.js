import React from "react";

const Callback = props => {
  const { location, auth } = props;

  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  } else {
    throw new Error("Invalid callback URL.");
  }

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
};

export default Callback;
