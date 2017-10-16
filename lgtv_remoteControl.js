var fs = require("fs");
var builder = require("xmlbuilder");
var fetch = require("node-fetch");
var xml2js = require("xml2js");
var pairingKey = require("./pairingKey.json");

var Client = require("node-ssdp").Client;

class LgRemote {
  constructor(address) {
    this.address = address;
    this.pairingKey = pairingKey;

    function udapRequest(action, body) {
      return (action === "command" ? authorizifiedFetch : fetch)(
        `http://${this.address}:8080/udap/api/${action}`,
        {
          method: "POST",
          body: builder.create(body),
          headers: { "Content-Type": "text/xml; charset=utf-8" }
        }
      );
    }
    udapRequest = udapRequest.bind(this);

    function authorizifiedFetch(url, options) {
      return fetch(url, options).then(response => {
        if (response.status === 401) {
          this.sessionId = undefined;
          ensurePairing();
          return fetch(url, options).then(response => response);
        } else return response;
      });
    }
    authorizifiedFetch = authorizifiedFetch.bind(this);

    // Pair host with TV
    function requestPairing() {
      return udapRequest("pairing", {
        auth: { type: "AuthReq", value: this.pairingKey }
      })
        .then(response => response.text())
        .then(text =>
          xml2js.parseString(
            text,
            (err, result) => (this.sessionId = ~~result.envelope.session[0])
          )
        );
    }
    requestPairing = requestPairing.bind(this);

    function ensurePairing() {
      if (!this.sessionId) {
        if (!this.pairingKey)
          throw new Error(
            "No pairing key found. Call requestPairingKey() to obtain one and pair(pairingKey) to store it."
          );
        else requestPairing(this.pairingKey);
      }
    }
    ensurePairing = ensurePairing.bind(this);

    this.requestPairingKey = () =>
      udapRequest("pairing", { auth: { type: "AuthKeyReq" } });

    this.pair = pairingKey => {
      this.pairingKey = pairingKey;
      fs.writeFileSync("pairingKey.json", JSON.stringify(pairingKey));
      return requestPairing();
    };

    // Handle command key to be sent to TV
    this.commandKey = key =>
      udapRequest("command", {
        command: {
          session: this.sessionId,
          type: "HandleKeyInput",
          value: key
        }
      });
  }

  // Scan for devices on localhost
  discover() {
    var ssdpClient = new Client();
    var promise = new Promise((resolve, reject) =>
      ssdpClient.on("response", (headers, statusCode, rinfo) => {
        console.log({ headers: headers, statusCode: statusCode, rinfo: rinfo });
        this.address = rinfo.address;
        resolve();
      })
    );
    ssdpClient.search("udap:rootservice");
    return promise;
  }

  get keyCodes() {
    return {
      Power: 1,
      Number0: 2,
      Number1: 3,
      Number2: 4,
      Number3: 5,
      Number4: 6,
      Number5: 7,
      Number6: 8,
      Number7: 9,
      Number8: 10,
      Number9: 11,
      Up: 12,
      Down: 13,
      Left: 14,
      Right: 15,
      Ok: 20,
      HomeMenu: 21,
      MenuKey: 22,
      PreviousKey: 23,
      VolumeUp: 24,
      VolumeDown: 25,
      Mute: 26,
      ChannelUp: 27,
      ChannelDown: 28,
      Blue: 29,
      Green: 30,
      Red: 31,
      Yellow: 32,
      Play: 33,
      Pause: 34,
      Stop: 35,
      Fastforward: 36,
      Rewind: 37,
      SkipForward: 38,
      SkipBackward: 39,
      Record: 40,
      RecordingList: 41,
      Repeat: 42,
      LiveTV: 43,
      EPG: 44,
      CurrentProgramInformation: 45,
      AspectRatio: 46,
      ExternalInput: 47,
      PIPSecondaryVideo: 48,
      ShowChangeSubtitle: 49,
      Programlist: 50,
      TeleText: 51,
      Mark: 52,
      _3DVideo: 400,
      _3DLR: 401,
      Dash: 402,
      PreviousChannel: 403,
      FavoriteChannel: 404,
      Quickmenu: 405,
      TextOption: 406,
      AudioDescription: 407,
      NetCastkey: 408,
      Energysaving: 409,
      AVmode: 410,
      SIMPLINK: 411,
      Exit: 412,
      ReservationProgramsList: 413,
      PIPchannelUP: 414,
      PIPchannelDOWN: 415,
      PrimarySecondaryVideo: 416,
      MyApps: 417
    };
  }
}

module.exports = LgRemote;
