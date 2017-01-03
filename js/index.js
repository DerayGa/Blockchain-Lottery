var web3, eth;
var balance = {};
var weiToEther = 1000000000000000000;

function timestampToString(timestamp) {
  return Date(+(timestamp) * 1000)
}

function showLog(msg) {
  $('#log').prepend(`<pre>${msg}</pre><br />`)
  console.log(msg);
}

// 當頁面載入完成時
$(function() {
  // 連結 enode
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  eth = web3.eth;
  // 放置 web3 deploy 程式碼
  var rentablelockserviceContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"checkTimeout","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"renter","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"endTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"showAccountBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"rent","outputs":[{"name":"","type":"bool"}],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"returnLock","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"unlock","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"locked","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"lock","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"renter","type":"address"},{"indexed":false,"name":"lease","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"Rented","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tryingrenter","type":"address"},{"indexed":false,"name":"renter","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"InUse","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"renter","type":"address"},{"indexed":false,"name":"returneddeposit","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"NormalReturned","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"renter","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"FailureRented","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"renter","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"Timeout","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"renter","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"Locked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"renter","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"Unlocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"renter","type":"address"},{"indexed":false,"name":"balance","type":"uint256"}],"name":"UserBalanceCheck","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"balance","type":"uint256"}],"name":"ServiceBalanceCheck","type":"event"}]);
  var rentablelockservice = rentablelockserviceContract.new(
   {
     from: web3.eth.accounts[0],
     data: '0x60606040526001600260006101000a81548160ff021916908315150217905550662386f26fc1000060035534610000575b5b5b610b13806100416000396000f30060606040523615610097576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806309bbd6a01461009c5780632e88ab0b146100c35780633197cbb61461011257806331e763871461013557806382996d9f14610158578063944e2ba91461017a578063a69df4b514610189578063cf30901214610198578063f83d08ba146101bf575b610000565b34610000576100a96101ce565b604051808215151515815260200191505060405180910390f35b34610000576100d06101f5565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100005761011f61021b565b6040518082815260200191505060405180910390f35b3461000057610142610221565b6040518082815260200191505060405180910390f35b6101606102c3565b604051808215151515815260200191505060405180910390f35b34610000576101876105b1565b005b34610000576101966108a8565b005b34610000576101a56109be565b604051808215151515815260200191505060405180910390f35b34610000576101cc6109d1565b005b60006000600090506001544211156101ed576101e86105b1565b600190505b8091505b5090565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60015481565b60007f2bf40cd2c2c5ebc7390132db6009fc24d272dd05b4ab889fa5dc8bdc16461af0333373ffffffffffffffffffffffffffffffffffffffff1631604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a13373ffffffffffffffffffffffffffffffffffffffff163190505b90565b6000600073ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156103e7577fdb9e809daeb7deb5c5da859b1aea2d6715766ff39b69c8b5d1b1e8dbae82634f33600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1642604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a1600090506105ae565b600034111515610465577fd27cb46adb21283523264bc6c0d5b3d28fda266765c068a63d5808dbed077a2b3342604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a1600090506105ae565b346004819055506003543481156100005704420160018190555033600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f7c9d2ac912c28eb5f87522b3a227c33e0884aa9c28bf987198e395fe62c49138600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600354348115610000570442604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a17fd38ea4677aa48cabe4f0cce0000ea2d3be90d68ba5b9db2e5f01bd1ca53d11603073ffffffffffffffffffffffffffffffffffffffff16316040518082815260200191505060405180910390a15b90565b60003373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561060f57610000565b6000600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600260006101000a81548160ff0219169083151502179055507f9f1ec8c880f76798e7b793325d625e9b60e4082a553c98f42b6cda368dd60008600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1642604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a1600354426001540302600454039050600081101515610816577fae2d043d563b327edf66cc1ffec2c522ee0ec2b0144cb2cef2d9946edd7ef5d5338242604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a13373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051809050600060405180830381858888f1935050505015610811577fd38ea4677aa48cabe4f0cce0000ea2d3be90d68ba5b9db2e5f01bd1ca53d11603073ffffffffffffffffffffffffffffffffffffffff16316040518082815260200191505060405180910390a15b6108a4565b7f48f41610c1ed8e474ea2df3e4c778c8e152b4b5d0f4f91a992a4901a94825661600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1642604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b50565b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561090457610000565b61090c6101ce565b15156109bb576000600260006101000a81548160ff0219169083151502179055507f0f0bc5b519ddefdd8e5f9e6423433aa2b869738de2ae34d58ebc796fc749fa0d600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1642604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b565b600260009054906101000a900460ff1681565b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610a2d57610000565b610a356101ce565b1515610ae4576001600260006101000a81548160ff0219169083151502179055507f9f1ec8c880f76798e7b793325d625e9b60e4082a553c98f42b6cda368dd60008600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1642604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b5600a165627a7a7230582009cddea2010c26f849ede4877c20ed9616c50b883b5a27812ea15d7034d84ea40029', 
     gas: '4700000'
   }, function (e, contract){
      if (e) {
        showLog('錯誤', e);
      }
      if (typeof contract.address !== 'undefined') {
        showLog('RentableLockService 部屬完成!');
        contractControl();
      }
  })
  //--------------------------------
  function updateInfo(id, value) {
    $(id).html([$(id).html().split(' :')[0], value].join(' : '));
  }

  function updateUI() {
    var user = eth.accounts[0];
    $('#account').val(user);
    updateInfo('#locked', '上鎖');
  }

  function contractControl() {
    console.log('進入合約控制');
    updateUI();

    rentablelockservice.showAccountBalance({
      from: eth.accounts[0],
    });

    rentablelockservice.Rented({}, function(err, event) {
      showLog(`租用成功
      當前租用者：${event.args.renter}
      租用時間${timestampToString(event.args.lease)}
      時間：${timestampToString(event.args.timestamp)}
      `)
      updateInfo('#renttime', `${event.args.lease} 秒`);
    });

    rentablelockservice.FailureRented({}, function(err, event) {
      showLog(`租用失敗
      時間：${timestampToString(event.args.timestamp)}
      `);
    });

    rentablelockservice.InUse({}, function(err, event) {
      showLog(`已出租他人
      當前租用者：${event.args.renter}
      時間：${timestampToString(event.args.timestamp)}
      `);
    });

    rentablelockservice.NormalReturned({}, function(err, event) {
      showLog(`歸還成功
      餘額：${+(event.args.returneddeposit) / weiToEther} ether
      時間：${timestampToString(event.args.timestamp)}
      `);

      rentablelockservice.showAccountBalance({
        from: eth.accounts[0],
      });
    });

    rentablelockservice.Timeout({}, function(err, event) {
      showLog(`事件：租用逾時
      時間：${timestampToString(event.args.timestamp)}
      `);

      rentablelockservice.showAccountBalance({
        from: eth.accounts[0],
      });
    });

    rentablelockservice.Locked({}, function(err, event) {
      showLog(`事件：上鎖完成
      時間：${timestampToString(event.args.timestamp)}
      `);
      updateInfo('#locked', '上鎖');
    });

    rentablelockservice.Unlocked({}, function(err, event) {
      showLog(`事件：解鎖完成
      時間：${timestampToString(event.args.timestamp)}
      `);
      updateInfo('#locked', '解鎖');
    });

    rentablelockservice.UserBalanceCheck({}, function(err, event) {
      var balance = +(event.args.balance) / weiToEther;
      showLog(`事件：使用者乙太幣餘額
      帳戶：${event.args.renter}
      餘額：${balance}
      `);
      updateInfo('#renterbalance', balance);
    });

    rentablelockservice.ServiceBalanceCheck({}, function(err, event) {
      var balance = +(event.args.balance) / weiToEther;
      showLog(`事件：合約乙太幣餘額
      餘額：${balance}
      `);
      updateInfo('#rentablelockbalance', balance);
    });

    $('#rent').on('click', function() {
      rentablelockservice.rent({
        from: $('#account').val(),
        value: +($('#deposit').val()) * weiToEther,
      });
    });
    $('#return').on('click', function() {
      rentablelockservice.returnLock({
        from: $('#account').val(),
      });
    });
    $('#lock').on('click', function() {
      rentablelockservice.lock({
        from: $('#account').val(),
      });
    });
    $('#unlock').on('click', function() {
      rentablelockservice.unlock({
        from: $('#account').val(),
      });
    });
  }
});