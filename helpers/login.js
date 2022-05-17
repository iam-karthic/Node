const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const {
  ENV, REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
  COGNITO_USER_POOL_ID, COGNITO_APP_CLIENT_ID,
} = process.env;

if (ENV === 'local' || ENV === 'dev') {
  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: REGION,
  });
} else {
  AWS.config.update({ REGION });
}

const login = async (req, res) => {
  const { userName, password } = req.body;
  const poolData = {
    UserPoolId: COGNITO_USER_POOL_ID,
    ClientId: COGNITO_APP_CLIENT_ID,
  };

  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: userName,
    Password: password,
  });

  const userData = {
    Username: userName,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess(result) {
      res.status(200).json({
        idToken: result.getIdToken().getJwtToken(),
        accessToken: result.getAccessToken().getJwtToken(),
      });
    },
    onFailure(err) {
      res.status(400).json(err);
    },
  });
};

module.exports = login;
