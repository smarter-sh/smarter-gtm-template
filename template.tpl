___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.


___INFO___

{
  "type": "TAG",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "Smarter Chat",
  "categories": [
    "CHAT",
    "UTILITY"
  ],
  "brand": {
    "id": "github.com_smarter-sh",
    "displayName": "Smarter",
    "thumbnail": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA7UlEQVR42u3b0Q2DMAyEYXbqMN1/EroBomA7d7nfEs/RfYoEJPZxUNRYnd/PeeeJC7wVSFVoO4zu4LIQ08GlIFaHX4agEnwJhGr4EQT18K0ILuFbENzClyK4hi9DiAZwD/8KYZfwjxGiAR4vNFXdCNEAr7aaOMAtBNnQRRgAlG9/M4BLBAAACAaQf/V1fxMAAAAAAAAAAAAAxAKUnAMaHIjU/wsAAMD/CMpH5CMIyvcDZYvFA1whqN8QtSOoX4+VL+4G0I4QezvsBBDfIEGLDAC0ydEoSasszdK0yzMwwcgMQ1OMzTE4yegstW/9AGcWAuGKFRajAAAAAElFTkSuQmCC"
  },
  "description": "Adds a Smarter chatbot to your site: a chat launcher in a corner of the page, or a chat in an element of the page. Smarter is a platform for building and running chatbots; see https://smarter.sh.",
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "TEXT",
    "name": "chatbot",
    "displayName": "Chatbot url",
    "simpleValueType": true,
    "help": "The url of your deployed Smarter LLMClient, e.g. https://support.3141-5926-5359.api.example.com/. Its manifest must allow your site's origin in spec.config.prompt.allowedOrigins.",
    "valueValidators": [
      {
        "type": "NON_EMPTY"
      },
      {
        "type": "REGEX",
        "args": [
          "^https?://[^\\s\"'<>`]+$"
        ],
        "errorMessage": "Enter an http or https url."
      }
    ],
    "alwaysInSummary": true
  },
  {
    "type": "TEXT",
    "name": "apiKey",
    "displayName": "Api key",
    "simpleValueType": true,
    "help": "Only for an LLMClient that requires one. It is written into your pages, where any visitor can read it: use a key dedicated to this site.",
    "valueValidators": [
      {
        "type": "REGEX",
        "args": [
          "^[A-Za-z0-9_.:-]{0,256}$"
        ],
        "errorMessage": "An api key has only letters, digits, and the characters _ . : -"
      }
    ]
  },
  {
    "type": "SELECT",
    "name": "position",
    "displayName": "Launcher position",
    "simpleValueType": true,
    "defaultValue": "bottom-right",
    "selectItems": [
      {
        "value": "bottom-right",
        "displayValue": "Bottom right"
      },
      {
        "value": "bottom-left",
        "displayValue": "Bottom left"
      }
    ],
    "help": "The corner of the page where the chat button is."
  },
  {
    "type": "TEXT",
    "name": "label",
    "displayName": "Launcher label",
    "simpleValueType": true,
    "defaultValue": "Chat",
    "help": "The chat button's name, for screen readers."
  },
  {
    "type": "TEXT",
    "name": "color",
    "displayName": "Launcher color",
    "simpleValueType": true,
    "defaultValue": "#ff5733",
    "help": "The chat button's color, as a hex color, e.g. #ff5733.",
    "valueValidators": [
      {
        "type": "REGEX",
        "args": [
          "^(#[0-9A-Fa-f]{3}|#[0-9A-Fa-f]{6})?$"
        ],
        "errorMessage": "Enter a hex color, e.g. #ff5733."
      }
    ]
  },
  {
    "type": "CHECKBOX",
    "name": "open",
    "checkboxText": "Start with the chat open",
    "simpleValueType": true,
    "defaultValue": false
  },
  {
    "type": "GROUP",
    "name": "advanced",
    "displayName": "Advanced",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "TEXT",
        "name": "target",
        "displayName": "Target element",
        "simpleValueType": true,
        "help": "A css selector of an element of the page, e.g. #support-chat, to put the chat in that element instead of a launcher. Leave it empty for a launcher."
      },
      {
        "type": "TEXT",
        "name": "height",
        "displayName": "Height",
        "simpleValueType": true,
        "help": "The height of the chat (the launcher's panel, or the chat in the target element), as a css length, e.g. 600px or 70vh. Empty: 600px.",
        "valueValidators": [
          {
            "type": "REGEX",
            "args": [
              "^(\\d{1,5}(\\.\\d{1,3})?(px|em|rem|vh|vw|svh|dvh|%))?$"
            ],
            "errorMessage": "Enter a css length, e.g. 600px or 70vh."
          }
        ]
      },
      {
        "type": "TEXT",
        "name": "version",
        "displayName": "Embed script version",
        "simpleValueType": true,
        "defaultValue": "0.9.0",
        "help": "The version of @smarter.sh/ui-chat to load from jsDelivr. The default is the version that this template is tested with. A range, e.g. 0.9, follows its patch releases.",
        "valueValidators": [
          {
            "type": "NON_EMPTY"
          },
          {
            "type": "REGEX",
            "args": [
              "^\\d+(\\.\\d+){0,2}(-[0-9A-Za-z.]+)?$"
            ],
            "errorMessage": "Enter a version, e.g. 0.9.0 or 0.9."
          }
        ]
      }
    ]
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

// Smarter Chat: loads the embed script of @smarter.sh/ui-chat, configured through window.SmarterChatConfig.
// See https://github.com/smarter-sh/smarter-gtm-template/tree/main/doc/adr
const callInWindow = require('callInWindow');
const copyFromWindow = require('copyFromWindow');
const encodeUriComponent = require('encodeUriComponent');
const getType = require('getType');
const injectScript = require('injectScript');
const logToConsole = require('logToConsole');
const queryPermission = require('queryPermission');
const setInWindow = require('setInWindow');

const LOG_PREFIX = '[Smarter Chat]';

// the embed script's options, in its camelCase names. Empty fields are left out, so that the script's defaults apply.
const options = { chatbot: data.chatbot };
const optional = ['apiKey', 'position', 'label', 'color', 'target', 'height'];
for (let i = 0; i < optional.length; i++) {
  const value = data[optional[i]];
  if (value) {
    options[optional[i]] = value;
  }
}
options.mode = data.target ? 'inline' : 'launcher';
if (data.open) {
  options.open = true;
}

const url = 'https://cdn.jsdelivr.net/npm/@smarter.sh/ui-chat@' + encodeUriComponent(data.version || '0.9.0') + '/dist/embed.js';

if (copyFromWindow('SmarterChat.version')) {
  // the embed script has run, e.g. another Smarter Chat tag loaded it, or this is a single-page app's history change.
  callInWindow('SmarterChat.mount', options);
  data.gtmOnSuccess();
} else if (queryPermission('inject_script', url)) {
  // the embed script adds a chat for each of these options when it runs: several tags can add theirs before it loads.
  const existing = copyFromWindow('SmarterChatConfig');
  let configs = [];
  if (getType(existing) === 'array') {
    configs = existing;
  } else if (getType(existing) === 'object') {
    configs = [existing];
  }
  configs.push(options);
  setInWindow('SmarterChatConfig', configs, true);
  // the url is the cache token, so the script is loaded once, however many tags fire.
  injectScript(url, data.gtmOnSuccess, function () {
    logToConsole(LOG_PREFIX, 'could not load', url);
    data.gtmOnFailure();
  }, url);
} else {
  logToConsole(LOG_PREFIX, 'not permitted to load', url);
  data.gtmOnFailure();
}


___WEB_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "logging",
        "versionId": "1"
      },
      "param": [
        {
          "key": "environments",
          "value": {
            "type": 1,
            "string": "debug"
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "inject_script",
        "versionId": "1"
      },
      "param": [
        {
          "key": "urls",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "https://cdn.jsdelivr.net/npm/@smarter.sh/ui-chat@*"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "access_globals",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keys",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "SmarterChatConfig"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": false
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "SmarterChat.version"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": false
                  },
                  {
                    "type": 8,
                    "boolean": false
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "SmarterChat.mount"
                  },
                  {
                    "type": 8,
                    "boolean": false
                  },
                  {
                    "type": 8,
                    "boolean": false
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios:
- name: Loads the embed script, with a launcher's options
  code: |-
    runCode(mockData);
    assertApi('injectScript').wasCalled();
    assertApi('setInWindow').wasCalledWith('SmarterChatConfig', [{
      chatbot: 'https://support.example.com/',
      position: 'bottom-right',
      label: 'Chat',
      color: '#ff5733',
      mode: 'launcher'
    }], true);
    assertApi('callInWindow').wasNotCalled();
    assertApi('gtmOnSuccess').wasCalled();
    assertApi('gtmOnFailure').wasNotCalled();
- name: Loads the version of the embed script that the field names
  code: |-
    mockData.version = '0.9';
    let loaded;
    mock('injectScript', function (url, onSuccess, onFailure, cacheToken) {
      loaded = url;
      assertThat(cacheToken).isEqualTo(url);
      onSuccess();
    });
    runCode(mockData);
    assertThat(loaded).isEqualTo('https://cdn.jsdelivr.net/npm/@smarter.sh/ui-chat@0.9/dist/embed.js');
- name: Loads the default version of the embed script when the field is empty
  code: |-
    // the setup's version is the field's default, which make embed-version keeps the same as the code's.
    const defaultVersion = mockData.version;
    mockData.version = '';
    let loaded;
    mock('injectScript', function (url, onSuccess) {
      loaded = url;
      onSuccess();
    });
    runCode(mockData);
    assertThat(loaded).isEqualTo('https://cdn.jsdelivr.net/npm/@smarter.sh/ui-chat@' + defaultVersion + '/dist/embed.js');
- name: Adds every optional field that is set, and leaves out the empty ones
  code: |-
    mockData.apiKey = 'key-1';
    mockData.open = true;
    mockData.label = '';
    mockData.target = '#support-chat';
    mockData.height = '70vh';
    runCode(mockData);
    assertApi('setInWindow').wasCalledWith('SmarterChatConfig', [{
      chatbot: 'https://support.example.com/',
      apiKey: 'key-1',
      position: 'bottom-right',
      color: '#ff5733',
      target: '#support-chat',
      height: '70vh',
      mode: 'inline',
      open: true
    }], true);
- name: Adds its options to those of a tag that fired before the script loaded
  code: |-
    mock('copyFromWindow', function (key) {
      if (key === 'SmarterChatConfig') {
        return { chatbot: 'https://sales.example.com/' };
      }
      return undefined;
    });
    runCode(mockData);
    assertApi('setInWindow').wasCalledWith('SmarterChatConfig', [
      { chatbot: 'https://sales.example.com/' },
      { chatbot: 'https://support.example.com/', position: 'bottom-right', label: 'Chat', color: '#ff5733', mode: 'launcher' }
    ], true);
- name: Mounts the chat when the embed script has already run
  code: |-
    mock('copyFromWindow', function (key) {
      return key === 'SmarterChat.version' ? '0.9.0' : undefined;
    });
    runCode(mockData);
    assertApi('injectScript').wasNotCalled();
    assertApi('setInWindow').wasNotCalled();
    assertApi('callInWindow').wasCalledWith('SmarterChat.mount', {
      chatbot: 'https://support.example.com/',
      position: 'bottom-right',
      label: 'Chat',
      color: '#ff5733',
      mode: 'launcher'
    });
    assertApi('gtmOnSuccess').wasCalled();
- name: Fails when the script can't be loaded
  code: |-
    mock('injectScript', function (url, onSuccess, onFailure) {
      onFailure();
    });
    runCode(mockData);
    assertApi('gtmOnFailure').wasCalled();
    assertApi('gtmOnSuccess').wasNotCalled();
    assertApi('logToConsole').wasCalled();
- name: Fails when the url isn't permitted
  code: |-
    mock('queryPermission', function () {
      return false;
    });
    runCode(mockData);
    assertApi('injectScript').wasNotCalled();
    assertApi('gtmOnFailure').wasCalled();
setup: |-
  const mockData = {
    chatbot: 'https://support.example.com/',
    apiKey: '',
    position: 'bottom-right',
    label: 'Chat',
    color: '#ff5733',
    open: false,
    target: '',
    height: '',
    version: '0.9.0'
  };


___NOTES___

Smarter Chat for Google Tag Manager: https://github.com/smarter-sh/smarter-gtm-template
Licensed under the Apache License 2.0. The embed script that it loads, @smarter.sh/ui-chat, is AGPL-3.0-or-later.
