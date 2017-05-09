process.env.DEBUG = 'actions-on-google:*';

const ActionsSdkAssistant = require('actions-on-google').ActionsSdkAssistant;

var NextBus = require('./src/nextbus').NextBus;

/*var agency = "ttc",
    routeTag = "509",
    stopTag = "632";

var nBus = new NextBus(agency);

//nBus.routeConfig(routeTag).then(console.log);
nBus.predictions(routeTag,stopTag).then(function(obj){
  console.log("The next TTC vehicles at your stop will arrive in ");
  for(let p of obj.direction.prediction){
    console.log(p.minutes + ",");
  }
  console.log(" minutes");
});*/

exports.predictions = (req, res) => {
  const assistant = new ActionsSdkAssistant({ request: req, response: res });

  function mainIntent(assistant) {
    console.log('mainIntent');
    let inputPrompt = assistant.buildInputPrompt(true, '<speak>Hi! <break time="1"/> ' +
      'I can tell you the next vehicles arriving at your stop for route 509. ' +
      'Say a stop number, like 613.</speak>',
      ['I didn\'t hear a number', 'If you\'re still there, what\'s the number?', 'What is the number?']);
    assistant.ask(inputPrompt);
  }

  function rawInput(assistant) {
    console.log('rawInput');
    if (assistant.getRawInput() === 'bye') {
      assistant.tell('Goodbye!');
    } else {
      var nBus = new NextBus("ttc");
      nBus.predictions(509, assistant.getRawInput()).then(function (obj) {
        var minutes = "";
        for (let p of obj.direction.prediction) {
          minutes += p.minutes + ",";
        }
        let inputPrompt = assistant.buildInputPrompt(true, '<speak>The next TTC vehicles at your stop will arrive in ' +
          minutes + ' minutes. </speak>',
          ['I didn\'t hear a number', 'If you\'re still there, what\'s the number?', 'What is the number?']);
        assistant.ask(inputPrompt);
      });


    }
  }

  let actionMap = new Map();
  actionMap.set(assistant.StandardIntents.MAIN, mainIntent);
  actionMap.set(assistant.StandardIntents.TEXT, rawInput);

  assistant.handleRequest(actionMap);
}


