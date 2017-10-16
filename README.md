# LG Smart TV Remote Control - NodeJS


Remote control for 1st-gen LG Smart TV (2013-2014 models). Based on https://github.com/migueljteixeira/nodejs-lgtvRemoteControl

## Usage

Require the module

    var LgRemote = require('lgsmarttvremote');
Connect to a known IP address or hostname:

    var lgremote = new LgRemote('ip_address');
Discover the TV over SSDP:

    var lgremote = new LgRemote();
    lgremote.discover();
Obtain a pairing code code from your TV on first use:

    lgremote.requestPairingKey();
Pairing code should be displayed on screen now. Use it to pair:

    lgremote.pair('123456');
The pairing code is persisted in a JSON file and has to be entered once.

Send remote button press:

    lgremote.commandKey(lgremote.keyCodes.Ok);

## Limitations and todos

### Discovery

Currently the SSDP discovery code assumes you have only one LG Smart TV on your LAN.
If more than one are present, only the first one will be discovered.

The SSDP response SERVER header contains a server name which can be used to match a name specified during discovery, if anyone wants to look into that.

### IP change detection

Ideally a network controller like this one should implement both an event listener to handle a possible change of TV's IP address, and notify the TV of the controller's address changes.
This is not implemented right now. The client will lose connectivity in case of TV's address change and you'll have to rediscover it.
[Refer to official documentation here](http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FIP+Address+Change+Notification+Controller+Host.htm).

### Consume other API methods

The TV API also supports some other methods, like sending mouse pointer events, changing channels, querying the channel list and capturing screenshots. Implementing them in the client will be very straightforward, use the commandKey method as reference and adjust the UDAP request type and body according to the API documentation.

### Turning the TV on

You **can not** turn the TV on using the API or any other method of access over the network such as Wake On Lan.

As far as I can tell, the only ways of turning it on are 
* IR - either using a TV remote or any other IR-enabled device (an IR blaster dongle, a smartphone, a smart home hub, etc.)
* HDMI CEC - you can send wake and shutdown commands over HDMI using any compatible hardware, such as Raspberry PI or a USB CEC adapter

## LG API documentation

http://developer.lgappstv.com/TV_HELP/index.jsp?topic=%2Flge.tvsdk.references.book%2Fhtml%2FUDAP%2FUDAP%2FLG+UDAP+2+0+Protocol+Specifications.htm