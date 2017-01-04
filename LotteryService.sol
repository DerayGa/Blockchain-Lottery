pragma solidity ^0.4.0;

contract LotteryService {
  // 此合約的擁有者
  address public creator;
  uint8 constant etherPerBet = 10;
  uint8 constant minNum = 1;
  uint8 constant maxNum = 10;

  //每一注為5個數字
  struct Bet {
    uint8[5] numbers;
    uint timestamp; //下注時間
    address player;
  }
  // 記錄每個帳號下注的資料 指到一個位置
  mapping (address => uint[]) private players;
  // 記錄每筆下注的資料
  Bet[] private allBets;
  Bet[] private historyBets;
  uint8[] private lotteryNumbers;
  address[] private lotteryWinners;
  uint[] private ids;

  //事件們
  event BettingSuccess(address indexed player, uint timestamp);
  event BettingFailed(address indexed player, string msg, uint timestamp);
  event BetLog(uint8[5] numbers, uint timestamp, address indexed player);
  event NoBetLog(uint timestamp, address indexed player);
  event LotteryNumbers(uint8[] numbers, uint timestamp);
  event TotalBetAmount(uint amount);
  event NoWinner(uint timestamp);
  event LotteryWinner(address indexed player, uint amount, uint timestamp);

  //建構子
  function LotteryService() {
    creator = msg.sender;
  }

  function betting(uint8[5] num) payable {
    if ((msg.value / 1 ether) == etherPerBet) {

      allBets.push(Bet({
        numbers: num,
        timestamp: now,
        player: msg.sender,
      }));
      players[msg.sender].push(allBets.length - 1);

      BettingSuccess(msg.sender, now);
      TotalBetAmount(this.balance / 1 ether);
    } else {
      if ((msg.value / 1 ether) > etherPerBet) {
        BettingFailed(msg.sender, "下注金額過多", now);
      } else {
        BettingFailed(msg.sender, "下注金額不足", now);
      }
      msg.sender.send(msg.value);
    }
  }

  function resetGame() internal{
    lotteryNumbers.length = 0;
    lotteryWinners.length = 0;
  }

  function lottery() {
    // 重置開獎結果
    resetGame();
    // 當前時間點
    uint seed = now;
    // 加上總下注筆數
    seed += allBets.length;
    ids.length = 0;
    // 加上第一筆下注者帳號 & 時間點
    ids.push(0);
    // 加上中間一筆下注者帳號 & 時間點
    ids.push(allBets.length / 2);
    // 加上最後一筆下注者帳號 & 時間點
    ids.push(allBets.length - 1);

    for(uint l = 0 ; l < ids.length; l++) {
      Bet bet = allBets[ids[l]];
      seed += uint16(bet.player);
      seed += bet.timestamp;
    }
    while(lotteryNumbers.length < 5) {
      uint8 number = randomGen(seed);

      bool isDuplicate = false;
      for(uint8 i = 0 ; i < lotteryNumbers.length ; i++){
        if (lotteryNumbers[i] == number) {
            isDuplicate = true;
        }
      }

      seed += number;
      if (!isDuplicate) {
        lotteryNumbers.push(number);
      }
    }

    LotteryNumbers(lotteryNumbers, now);
    findWinner();
  }

  function cheatLottery() {

  }

  function findWinner() internal {
    for (uint i = 0 ; i < allBets.length ; i++){
      Bet bet = allBets[i];
      bool matchAllNumber = true;
      for (uint8 j = 0 ; j < lotteryNumbers.length ; j++) {
        bool matchNumber = false;
        for (uint8 k = 0 ; k < bet.numbers.length ; k++) {
          if (bet.numbers[k] == lotteryNumbers[j]) {
            matchNumber = true;
          }
        }
        matchAllNumber = (matchAllNumber && matchNumber);
      }

      if (matchAllNumber) {
        lotteryWinners.push(bet.player);
      }

      historyBets.push(bet);
    }

    sendMoneyToWinner();
    allBets.length = 0;
  }

  function sendMoneyToWinner() internal {
    var count = historyBets.length;
    if (count == 0) {
      NoWinner(now);
    } else {
      var bonus = (this.balance * 0.99) / count;
      for(var i = 0 ; i < historyBets.length ; i++) {
        historyBets[i].send(bonus);
        LotteryWinner(historyBets[i], bonus, now);
      }
    }
    TotalBetAmount(this.balance / 1 ether);
  }

  function randomGen(uint seed) returns (uint8) {
    return uint8(uint(sha3(block.blockhash(block.number - 1), seed )) % maxNum) + minNum;
  }

  function checkMyBetLog() {
    uint[] bets = players[msg.sender];

    for(var i = 0 ; i < bets.length ; i++){
      Bet bet = allBets[bets[i]];
      BetLog(bet.numbers, bet.timestamp, bet.player);
    }
    if (bets.length == 0) {
      NoBetLog(now, msg.sender);
    }
  }

  function checkAllBetLog() {
    for(var i = 0 ; i < allBets.length ; i++){
      Bet bet = allBets[i];
      BetLog(bet.numbers, bet.timestamp, bet.player);
    }
    if (allBets.length == 0) {
      NoBetLog(now, msg.sender);
    }
  }

  // 結束合約，將餘額轉給建立者
  function remove() {
    if(msg.sender == creator) {
        selfdestruct(creator);
    }
  }
}