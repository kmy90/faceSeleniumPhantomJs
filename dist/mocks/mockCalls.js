"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockCallSendMessageFromFacebook = {
    "endpoint": "https://www.facebook.com/messages/t/820595704755304",
    "steps": [
        {
            "findElement": {
                "tag": "input",
                "attributes": {
                    "id": "email"
                }
            },
            "action": {
                "type": "sendKeys",
                "value": "papeloteeditor@gmail.com"
            }
        },
        {
            "findElement": {
                "tag": "input",
                "attributes": {
                    "id": "pass"
                }
            },
            "action": {
                "type": "sendKeys",
                "value": "1qaz2wsx3edc1234567890"
            }
        },
        {
            "findElement": {
                "tag": "*",
                "attributes": {
                    "id": "loginbutton"
                }
            },
            "action": {
                "type": "click"
            }
        },
        {
            "findElement": false,
            "action": {
                "type": "wait",
                "for": "Title",
                "includes": "Messenger",
                "timeout": 5000
            }
        },
        {
            "findElement": {
                "tag": "input",
                "attributes": {
                    "contenteditable": "true",
                    "role": "combobox"
                }
            },
            "action": {
                "type": "sendKeys",
                "value": "mensaje de prueba",
                "keypress": "ENTER"
            }
        },
        {
            "findElement": false,
            "action": {
                "type": "quit"
            }
        }
    ]
};
