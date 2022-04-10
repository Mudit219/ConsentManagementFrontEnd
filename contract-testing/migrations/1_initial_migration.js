const Migrations = artifacts.require("ConsentManagementSystem");

module.exports = function (deployer) {
  deployer.deploy(Migrations,"testing123");
};
