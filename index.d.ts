declare class LgRemote {
  constructor(address?: string);

  // Scan for devices on localhost
  discover(deviceName?: string): Promise<void>;

  requestPairingKey(): Promise<void>;

  // Pair with TV and save the pairing key to file
  pair(pairingKey: string): Promise<void>;

  // Send command key to the TV
  commandKey(key: number): Promise<void>;

  get keyCodes(): {
    Power: 1;
    Number0: 2;
    Number1: 3;
    Number2: 4;
    Number3: 5;
    Number4: 6;
    Number5: 7;
    Number6: 8;
    Number7: 9;
    Number8: 10;
    Number9: 11;
    Up: 12;
    Down: 13;
    Left: 14;
    Right: 15;
    Ok: 20;
    HomeMenu: 21;
    MenuKey: 22;
    PreviousKey: 23;
    VolumeUp: 24;
    VolumeDown: 25;
    Mute: 26;
    ChannelUp: 27;
    ChannelDown: 28;
    Blue: 29;
    Green: 30;
    Red: 31;
    Yellow: 32;
    Play: 33;
    Pause: 34;
    Stop: 35;
    Fastforward: 36;
    Rewind: 37;
    SkipForward: 38;
    SkipBackward: 39;
    Record: 40;
    RecordingList: 41;
    Repeat: 42;
    LiveTV: 43;
    EPG: 44;
    CurrentProgramInformation: 45;
    AspectRatio: 46;
    ExternalInput: 47;
    PIPSecondaryVideo: 48;
    ShowChangeSubtitle: 49;
    Programlist: 50;
    TeleText: 51;
    Mark: 52;
    _3DVideo: 400;
    _3DLR: 401;
    Dash: 402;
    PreviousChannel: 403;
    FavoriteChannel: 404;
    Quickmenu: 405;
    TextOption: 406;
    AudioDescription: 407;
    NetCastkey: 408;
    Energysaving: 409;
    AVmode: 410;
    SIMPLINK: 411;
    Exit: 412;
    ReservationProgramsList: 413;
    PIPchannelUP: 414;
    PIPchannelDOWN: 415;
    PrimarySecondaryVideo: 416;
    MyApps: 417;
  };
}

export = LgRemote;
