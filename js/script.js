/**
     * @description 开始游戏
     * */ 
 var game = new Game();
 console.log(game,"game")
 function start(){
     game.init("canvasContent");
 }

 function selectChange(){
     game.selectChange();
 } 
 function submit(){
     game.submit();
 }
 /**
  * @description 重新开始
  * */ 
 function reStart(){
     // sdArr=[];
     game.reStart();
 }