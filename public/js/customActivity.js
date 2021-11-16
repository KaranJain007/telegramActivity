define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';
    console.log("in the custom activity ");
    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Create SMS Message", "key": "step1" },
        { "label": "Choose Chat id destination ", "key": "step2" },
        { "label": "Summary ", "key": "step3" }
    ];
    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    }

  function initialize(data) {
        console.log("Initializing data data: "+ JSON.stringify(data));
        if (data) {
            payload = data;
        }    

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
         );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log('Has In arguments: '+JSON.stringify(inArguments));

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                if (key === 'accountSid') {
                    $('#accountSID').val(val);
                    console.log('in the accountsid if ');
                }

                if (key === 'authToken') {
                    $('#authToken').val(val);
                    console.log('in the auth token  ');
                }

                // if (key === 'messagingService') {
                //     $('#messagingService').val(val);
                // }

                if (key === 'body') {
                    $('#messageBody').val(val);
                    console.log('in the message body ');
                }                                                               

            })
        });
        console.log('hello');
        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });

    }

    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log("Tokens function: "+JSON.stringify(tokens));
        //authTokens = tokens;
    }

    function onGetEndpoints (endpoints) {
         //Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: "+JSON.stringify(endpoints));
    }
    
            function onClickedNext(){
        if((currentStep.key)=='step1')
        {
            console.log('in the step 1 if ');
            connection.trigger('nextStep');

        }else if (currentStep.key == 'step2'){
            connection.trigger('ready');
            connection.trigger('nextstep');

        } else if (currentStep.key == 'step3' && steps[3].active == false ){
            save();
        } else {
            connection.trigger('nextstep');
        }
    }

  
    function onClickedBack (){
        connection.trigger('prevStep');

    }                   

    function onGotoStep(step){
        showStep(step);
        connection.trigger('ready');

    }

 /*   function showStep(step, stepIndex) {
        console.log('in the showstep function ');
        if (stepIndex && !step) {
            step = steps[stepIndex-1];
        }

        currentStep = step;
        $('.step').hide();
        
        switch(currentStep.key) {
            case 'step1':
                $('#step1').show();
                console.log("---------------------------------------------------------------------------------------------------------------->This is step 1");
                 connection.trigger('updateButton', {
                  button: 'next',
                     text: 'next',
                  visible: true
                    //enabled: Boolean(getMessage())
                });
                break;
                case 'step2':
                    $('#step2').show();
                    console.log("---------------------------------------------------------------------------------------------------------------->This is step 2");
                  /*  connection.trigger('updateButton', {
                        button: 'back',
                        visible: true
                    });
                        connection.trigger('updateButton', {
                        button: 'next',
                        text: 'next',
                        visible: true
                    });
                    break;
                    case 'step3':
                $('#step3').show();
                console.log("---------------------------------------------------------------------------------------------------------------->This is step 3");
    }                   connection.trigger('updateButton', {
                     button: 'back',
                     visible: true
                });
                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'Done',
                    visible: true
                });
                break;
            }*/
            function save() {

                var accountSid = $('#accountSid').val();
                var authToken = $('#authToken').val();
            //    var messagingService = $('#messagingService').val();
                var body = $('#messageBody').val();
               // console.log("in the save option "+ body);
                
                payload['arguments'].execute.inArguments = [{
                    "accountSid": accountSid,
                    "authToken": authToken,
            //        "messagingService": messagingService,
                    "body": body,
                    "to": "{{Contact.Attribute.telegramActivity.chatid}}" ,//<----This should map to your data extension name and phone number column
                   
                }];       
                payload['metaData'].isConfigured = true;
                console.log("Payload on SAVE function: "+JSON.stringify(payload));
                connection.trigger('updateActivity', payload);
        
            } 

});

// //function sendMessageFor (token, channel) {
//     console.log('in the function of sendmessage for ')
//     const baseUrl = `https://api.telegram.org/bot${token}`

//     return message => {
//     const urlParams = querystring.stringify({
//         chat_id: channel,
//         text: 'hello i am bot hit by journey builder',
//         parse_mode: 'HTML'
//     })

//     return sendRequest(`${baseUrl}/sendMessage?${urlParams}`)
//     }
// }-->