const Migrations = artifacts.require("ConsentManagementSystem");

module.exports = function (deployer) {
  deployer.deploy(Migrations,"testing123","0xDC22e8663785dD65Ee6FB55Ab9D7c0711418de68");
};
