#! /usr/bin/env node
/*
 * interactivekill
 * https://github.com/0xmtn/interactivekill
 *
 * Copyright (c) 2015 Metin Emenullahi
 * Licensed under the MIT license.
 */


var readline = require("readline");
var exec = require("child_process").exec;


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var arguments = process.argv.slice(2);
var process_name = arguments[0];
var __GREPPED = [];
exec("./lib/parse_ps.sh " + process_name, function(err, stdout, stderr){
  if(err !== null){
    console.log("execerror: " + err);
  }


  stdout = stdout.substring(0,((stdout.length)-1));
  stdout = stdout.replace(/pid:/g, '"pid":')
  stdout = stdout.replace(/line:/g, '"line":')
  stdout = stdout.replace(/\n/g, ""); 
  stdout = stdout.replace("},]", "}]");


  stdout = JSON.parse(stdout);
  __GREPPED = stdout;
  for(var i=0; i< stdout.length; i++){
    if(stdout[i].line.indexOf("grep") > -1){
      continue;
    }
    if(stdout[i].line.indexOf("ikill") > -1){
      continue;
    }
    if(stdout[i].line.indexOf("parse_ps.sh") > -1){
      continue;
    }
    console.log(i+". "+stdout[i].pid+ " | " + stdout[i].line);
  }

  ask_question("WaitForPidId", "Please type the id of a process you want to kill: ", function(ans){
    ans = ans.toString().trim();
    ans = parseInt(ans);

    exec("./lib/kill.sh " + __GREPPED[ans].pid, function(err2, stdout2, stderr2){
      if(err2 !== null){
        console.log("execerror: " + err2);
      }

      console.log("Process killed successfully");
      process.exit();
    });
  });

});

function inRange(x, y){
  return x >= 0 && x <= y;
}

function ask_question(ques_type, question, _clb){
  if(ques_type === "Confirmation"){
    rl.question(question, function(ans){
      ans = ans.toString().trim();
      if(ans != "y" && ans != "n"){
        ask_question(ques_type, question, _clb);
      }
      else{
        _clb(ans);
      }
    });
  }
  else if(ques_type === "WaitForPidId"){
    rl.question(question, function(ans){
      ans = ans.toString().trim();
      ans = parseInt(ans);
      if(!(inRange(ans, __GREPPED.length-1) )){
        ask_question(ques_type, question, _clb);
      }
      else{
        _clb(ans);
      }

    });
  }
}



