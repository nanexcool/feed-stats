#!/usr/bin/env node
var fs = require('fs')
var json2csv = require('json2csv');
var fetch = require('node-fetch')
var Web3 = require('web3')
var web3 = new Web3();

var bots = [
  '0xac8519b3495d8a3e3e44c041521cf7ac3f8f63b3',
  '0x5E90E067242363bE0b4004E1a60b1D877D3D5877',
  '0xe6367a7da2b20ecb94a25ef06f3b551bab2682e6',
  '0x238a3f4c923b75f3ef8ca3473a503073f0530801',
  '0xFbaF3a7eB4Ec2962bd1847687E56aAEE855F5D00',
  '0xb8bb9ef0a74651d141e798856a2575e7e577e9d7',
  '0x00Cf06734732A2749f0b77dbA315Aad3A99906a0',
  '0xA8EB82456ed9bAE55841529888cDE9152468635A',
  '0x0032Ad8fAE086f87ff54699954650354bB51e050',
  '0x005B903dAdfD96229CBa5EB0e5Aa75C578e8F968',
  '0x000Df128EB60a88913F6135a2b83143C452C494e',
  '0xfeEd00AA3F0845AFE52Df9ECFE372549B74C69D2',
  '0x8afbd9c3d794ed8df903b3468f4c4ea85be953fb',
  '0x8de9c5f1ac1d4d02bbfc25fd178f5daa4d5b26dc'
]

dump = x => console.log(JSON.stringify(x, null, 2))
parseInput = x => toEth(x.substr(10,64))
toEth = x => web3.utils.fromWei(web3.utils.toBN(x), 'ether')
toGwei = x => web3.utils.fromWei(web3.utils.toBN(x), 'gwei')

function getData(bot, max) {
  return new Promise((resolve, reject) => {
    var url = `https://api.etherscan.io/api?module=account&action=txlist&address=${bot}&startblock=0&endblock=99999999&page=1&offset=${max}&sort=desc&apikey=N5TICDBVG4MHDS7CGPJ9MHXRYC1Y84963N`
    fetch(url).then(res => res.json()).then(res => {
      if (res.status && res.status === "1") {
        resolve(res.result.filter(x => x.from === bot.toLowerCase()));
      } else {
        reject('Error')
      }
    })
  })
}


writeToFile = (fileName, data) => {
  fs.writeFile(`${fileName}.csv`, data, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
}

getData(bots[0], 100).then(res => {
  var json = []
  res.forEach(tx => {
    var omg = {
      timeStamp: tx.timeStamp,
      blockNumber: tx.blockNumber,
      gasUsed: tx.gasUsed,
      gasPrice: toGwei(tx.gasPrice),
      spent: toEth(tx.gasUsed * tx.gasPrice),
      input: parseInput(tx.input)
    }
    json.push(omg)
  });
  var result = json2csv({
    data: json,
  })
  
  writeToFile('bot1', result)
})

// bots.forEach(bot => {
// });