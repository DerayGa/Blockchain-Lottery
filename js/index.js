var balance = {};
var lotteryPlayer;

function timestampToString(timestamp) {
  return Date(+(timestamp) * 1000)
}

var logId = 1;
function showLog(msg) {
  $('#log').prepend(`<pre>${logId} - ${msg}</pre><br />`);
  logId++;
}
var logId2 = 1;
function showLog2(msg) {
  $('#log2').prepend(`<pre>${logId2} - ${msg}</pre><br />`);
}

var transactionHashs = []
function ignoreDuplicateEvent(event) {
  var duplicate = true;

  if (transactionHashs.indexOf(event.transactionHash) < 0) {
    duplicate = false;
    transactionHashs.push(event.transactionHash);
  } else {
    // console.log('重複', event);
  }

  return duplicate;
}
var selectedLotteryNumber = [];

function showBall() {
  for(var i = 1 ; i <= 20 ; i++) {
    $(`#ball_${i}`).removeClass('selected');
  }
  selectedLotteryNumber.forEach(function(i){
    $(`#ball_${i}`).addClass('selected');
  });
}

function selectBall(ball) {
  if (selectedLotteryNumber.indexOf(ball) > -1) {
    selectedLotteryNumber.splice(selectedLotteryNumber.indexOf(ball), 1);
    showBall();
    return;
  }
  selectedLotteryNumber.push(ball);
  if (selectedLotteryNumber.length > 5) {
    selectedLotteryNumber.shift();
  }
  showBall();
}

function randomBall() {
  selectedLotteryNumber.length = 0;

  while(selectedLotteryNumber.length < 5) {
    var number = Math.ceil(Math.random(1) * 20);
    if (selectedLotteryNumber.indexOf(number) < 0) {
      selectedLotteryNumber.push(number);
    }
  }
  showBall();
}

function generateLotteryBall() {
  $('#lotteryBall').dblclick(function() {
    randomBall();
  });

  for(var i = 1 ; i <= 20 ; i++) {
    $('#lotteryBall').append(`<div class='ball' id='ball_${i}' onclick='selectBall(${i})'>${i}</div>`)
  }
}

function showDialog(msg) {
  $('#dialog').html(`<p>${msg}</p>`).dialog('open');
}

function getPlayerEther() {
  web3.eth.getBalance(lotteryPlayer,
    function(err, balance) {
      playerEther = balance.toNumber();
      $('#playerEther').html(`乙太幣餘額： ${Number(web3.fromWei(playerEther, 'ether'), 10).toFixed(4)} ether`);
    }
  );
}

function getContractEther(amount) {
  if (!amount) {
    web3.eth.getBalance(lotteryservice.address,
      function(err, balance) {
        $('#contractEther').html(`總下注金額： ${Number(web3.fromWei(balance.toNumber(), 'ether'), 10).toFixed(4)} ether`);
      }
    );
  } else {
    $('#contractEther').html(`總下注金額： ${Number(amount, 10).toFixed(4)} ether`);
  }
}

function contractControl() {
  console.log('進入合約控制');

  var options = [];
  for(var i = 0 ; i < eth.accounts.length ; i++ ) {
    options.push(`<option ${(i == 0) ? 'selected' : ''} value='${eth.accounts[i]}'>${eth.accounts[i]}</option>`);
  }
  lotteryPlayer = eth.accounts[0];
  getPlayerEther();
  getContractEther();

  $('#player')
    .append(options.join(''))
    .selectmenu('destroy')
    .selectmenu({
      change: function( event, ui ) {
        lotteryPlayer = ui.item.value;
        console.log('lotteryPlayer', lotteryPlayer);
        getPlayerEther();
      }
    });

  lotteryservice.BettingSuccess({}, function(err, event) {
    if (!ignoreDuplicateEvent(event)) {
      getPlayerEther();
      showLog(`下注成功
下注者：${event.args.player}
時間：${timestampToString(event.args.timestamp)}
`);
      showLog2(`下注記錄
下注者：${event.args.player}
時間：${timestampToString(event.args.timestamp)}
`);
    }
  });

  lotteryservice.BettingFailed({}, function(err, event) {
    if (!ignoreDuplicateEvent(event)) {
      getPlayerEther();
      showLog(`下注失敗
下注者：${event.args.player}
原因：${event.args.msg}
時間：${timestampToString(event.args.timestamp)}
      `);
    }
  });

  lotteryservice.TotalBetAmount({}, function(err, event) {
    /*showLog(`總下注金額
    $：${event.args.amount}
    `);*/
    getContractEther(event.args.amount);
  });

  lotteryservice.BetLog({}, function(err, event) {
    showLog(`下注記錄
下注者：${event.args.player}
號碼：${event.args.numbers}
時間：${timestampToString(event.args.timestamp)}
    `)
  });

  lotteryservice.NoBetLog({}, function(err, event) {
    showLog(`沒有下注記錄
下注者：${event.args.player}
時間：${timestampToString(event.args.timestamp)}
    `)
  });

  lotteryservice.LotteryNumbers({}, function(err, event) {
    showLog2(`開獎號碼
號碼：${event.args.numbers}
時間：${timestampToString(event.args.timestamp)}
    `)
  });

  lotteryservice.NoWinner({}, function(err, event) {
    showLog(`開獎結束，沒有中獎者
時間：${timestampToString(event.args.timestamp)}
    `)
  });

  lotteryservice.LotteryWinner({}, function(err, event) {
    showLog(`開獎結束，恭喜中獎者
中獎者：${event.args.player}
獎金：${event.args.amount} ether
時間：${timestampToString(event.args.timestamp)}
    `)
  });

  // 綁定事件
  $('#checkMyBet').on('click', function() {
    if (!lotteryPlayer || !lotteryPlayer.length) return;

    console.log('checkMyBetLog', lotteryPlayer);
    lotteryservice.checkMyBetLog({
      from: lotteryPlayer,
      gas: 300000,
    })
  });

  $('#bet').on('click', function() {
    if (!lotteryPlayer || !lotteryPlayer.length) return;
    if (selectedLotteryNumber.length != 5) {
      showDialog('請選擇五個下注號碼')
      return;
    }

    var betValue = web3.toWei(10, 'ether');
    if (playerEther < betValue) {
      betValue = playerEther - 400000;
    }
    selectedLotteryNumber.sort(function(a, b) { return a - b; });
    lotteryservice.betting(selectedLotteryNumber, {
      from: lotteryPlayer,
      value: betValue,
      gas: 300000,
    })
  });

  $('#lottery').on('click', function() {
    lotteryservice.lottery({
      from: contractOwner,
      gas: 300000000,
    })
  });

  $('#cheatLottery').on('click', function() {
    lotteryservice.cheatLottery({
      from: contractOwner,
      gas: 300000000,
    })
  });

  $('#clear').on('click', function() {
    $('#log').empty();
    logId = 1;
  });
}
// 當頁面載入完成時
$(function() {
  $('#player').selectmenu();
  $('#tabs').tabs();

  generateLotteryBall();
  $('#dialog').dialog({
      autoOpen: false,
      show: {
        effect: "puff",
        duration: 500
      },
      hide: {
        effect: "puff",
        duration: 500
      }
    });

  //$('#container').height($(window).height());
});