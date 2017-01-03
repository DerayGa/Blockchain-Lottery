# 如何部屬智能合約
* 先開一個enode挖礦
```
geth --networkid 16888 --port 30303 --nodiscover --maxpeers 25 --nat "any" --rpc --rpccorsdomain "*" --rpcapi "eth,net,web3,debug" --mine --minerthreads 2 --autodag
```
* 再連enode
```
geth attach
```
# 如何unlock帳號？
依照上述步驟，進入geth的console環境
接著輸入
```
personal.listAccounts
```
查看使用者清單
然後
```
personal.unlockAccount(addr, passwd, duration)
```
addr輸入使用者的帳號，密碼就是創立帳號時的密碼，duration是解鎖的時間長度 單位秒
範例
```
personal.unlockAccount("0x0a11ad755ab817660017a0b626a21c98c76f6aca", "*****", 9999999);
```

或使用 testprc
安裝
```
npm install -g node-gyp ethereumjs-testrpc
```
啟動
testrpc 就可以開啟 rpc-server，
然後也可以藉由 geth attach http://localhost:8545 來進入控制
# 如何開啟本地端的web3
* 若上述步驟成功，開啟
http://localhost:8545/
應該可以看到JSON訊息
{"jsonrpc":"2.0","error":{"code":-32600,"message":"EOF"}}

* 開啟browser-solidiy
在右上角的tab切換到Envirment那一個
然後將環境設定在「Web3 Provider」
接著部屬的合約就會在enode上跑

* 解鎖帳號後，按下「create」（紅色按鈕），等待挖抗時間，即可將智能合約部屬上區塊鏈。

* 複製「Web3 deploy」區塊內的程式碼貼到web3的init中，即可讓web3跟智能合約互動。

* 執行 http-server ./ 在web3 的目錄
http://localhost:8080/
可以執行本地端的應用程式
