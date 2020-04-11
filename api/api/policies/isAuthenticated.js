/**
 * isAuthenticated
 *
 */

const jwt = require("express-jwt"); // NEW
const jwksRsa = require("jwks-rsa"); // NEW

const authConfig = {
  domain: "smirkyisms.eu.auth0.com",
  audience: "api.smirkyisms.com"
};

const checkJwt = jwt({
  // Provide a signing key based on the key identifier in the header and the signing keys provided by your Auth0 JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  // Validate the audience (Identifier) and the issuer (Domain).
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

module.exports = checkJwt;