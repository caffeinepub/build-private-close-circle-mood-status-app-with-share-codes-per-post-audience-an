import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type OldMood = {
    #happy;
    #sad;
    #stressed;
    #excited;
    #neutral;
    #anxious;
    #content;
    #angry;
    #relaxed;
    #motivate;
    #tired;
    #bore;
    #hopeful;
    #frustrate;
    #grateful;
    #calm;
    #nervous;
    #satisfy;
    #disappoint;
    #optimistic;
    #confident;
    #lonely;
    #shy;
    #fear;
    #curious;
    #inspiration;
    #overwhelm;
    #embarrass;
    #guilty;
    #apathetic;
    #secure;
    #unsafe;
    #courage;
    #ashamed;
    #relieved;
    #triumph;
    #disgust;
    #joy;
    #worry;
    #melancholy;
    #humbled;
    #zen;
    #passionate;
    #indifferen;
    #irritate;
    #hungry;
    #starving;
    #craving;
  };

  type Mood = {
    #happy;
    #sad;
    #stressed;
    #excited;
    #neutral;
    #anxious;
    #content;
    #angry;
    #relaxed;
    #motivate;
    #tired;
    #bore;
    #hopeful;
    #frustrate;
    #grateful;
    #calm;
    #nervous;
    #satisfy;
    #disappoint;
    #optimistic;
    #confident;
    #lonely;
    #shy;
    #fear;
    #curious;
    #inspiration;
    #overwhelm;
    #embarrass;
    #guilty;
    #apathetic;
    #secure;
    #unsafe;
    #courage;
    #ashamed;
    #relieved;
    #triumph;
    #disgust;
    #joy;
    #worry;
    #melancholy;
    #humbled;
    #zen;
    #passionate;
    #indifferen;
    #irritate;
    #hungry;
    #starving;
    #craving;
    #thirsty;
    #dehydrated;
    #sleepy;
    #wired;
    #sore;
    #bloated;
    #overheated;
    #cold;
    #headache;
    #nauseous;
    #lightheaded;
    #restless;
  };

  type Gender = {
    #male;
    #female;
    #nonBinary;
    #other;
  };

  type RelationshipIntent = {
    #friendship;
    #romantic;
    #both;
  };

  type Preferences = {
    intent : RelationshipIntent;
    gender : Gender;
  };

  type Avatar = {
    #systemAvatar : Text;
    #uploaded : UploadedAvatar;
  };

  type UploadedAvatar = {
    contentType : Text;
    image : [Nat8];
  };

  type UserProfile = {
    name : Text;
    gender : Gender;
    dateOfBirth : Nat;
    showAge : Bool;
    relationshipIntent : RelationshipIntent;
    preferences : Preferences;
    shareCode : Text;
    createdAt : Time.Time;
    avatar : ?Avatar;
  };

  type JoinRequest = {
    from : Principal;
    to : Principal;
    shareCode : Text;
    createdAt : Time.Time;
  };

  type Notification = {
    id : Text;
    user : Principal;
    message : Text;
    statusId : ?Text;
    isRead : Bool;
    createdAt : Time.Time;
    requesterName : ?Text;
  };

  type StatusPost = {
    id : Text;
    author : Principal;
    mood : OldMood;
    content : Text;
    contextTags : ?[Text];
    audience : [Principal];
    createdAt : Time.Time;
  };

  type JournalEntry = {
    date : Time.Time;
    content : Text;
    createdAt : Time.Time;
  };

  type SafePeopleList = {
    people : [Principal];
  };

  type SilentSignal = {
    id : Text;
    author : Principal;
    mood : OldMood;
    content : Text;
    audience : [Principal];
    createdAt : Time.Time;
  };

  type OldActor = {
    profiles : Map.Map<Principal, UserProfile>;
    requests : Map.Map<Text, JoinRequest>;
    notifications : Map.Map<Text, Notification>;
    circles : Map.Map<Principal, List.List<Principal>>;
    memberCircles : Map.Map<Principal, List.List<Principal>>;
    statuses : Map.Map<Text, StatusPost>;
    journals : Map.Map<Principal, List.List<JournalEntry>>;
    safePeople : Map.Map<Principal, SafePeopleList>;
    silentSignals : Map.Map<Text, SilentSignal>;
    pulseScores : Map.Map<Principal, Nat>;
    directedInteractions : Map.Map<Principal, Map.Map<Principal, Nat>>;
  };

  type NewStatusPost = {
    id : Text;
    author : Principal;
    mood : Mood;
    content : Text;
    contextTags : ?[Text];
    audience : [Principal];
    createdAt : Time.Time;
  };

  type NewSilentSignal = {
    id : Text;
    author : Principal;
    mood : Mood;
    content : Text;
    audience : [Principal];
    createdAt : Time.Time;
  };

  type NewActor = {
    profiles : Map.Map<Principal, UserProfile>;
    requests : Map.Map<Text, JoinRequest>;
    notifications : Map.Map<Text, Notification>;
    circles : Map.Map<Principal, List.List<Principal>>;
    memberCircles : Map.Map<Principal, List.List<Principal>>;
    statuses : Map.Map<Text, NewStatusPost>;
    journals : Map.Map<Principal, List.List<JournalEntry>>;
    safePeople : Map.Map<Principal, SafePeopleList>;
    silentSignals : Map.Map<Text, NewSilentSignal>;
    pulseScores : Map.Map<Principal, Nat>;
    directedInteractions : Map.Map<Principal, Map.Map<Principal, Nat>>;
  };

  func convertMood(oldMood : OldMood) : Mood {
    switch (oldMood) {
      case (#happy) { #happy };
      case (#sad) { #sad };
      case (#stressed) { #stressed };
      case (#excited) { #excited };
      case (#neutral) { #neutral };
      case (#anxious) { #anxious };
      case (#content) { #content };
      case (#angry) { #angry };
      case (#relaxed) { #relaxed };
      case (#motivate) { #motivate };
      case (#tired) { #tired };
      case (#bore) { #bore };
      case (#hopeful) { #hopeful };
      case (#frustrate) { #frustrate };
      case (#grateful) { #grateful };
      case (#calm) { #calm };
      case (#nervous) { #nervous };
      case (#satisfy) { #satisfy };
      case (#disappoint) { #disappoint };
      case (#optimistic) { #optimistic };
      case (#confident) { #confident };
      case (#lonely) { #lonely };
      case (#shy) { #shy };
      case (#fear) { #fear };
      case (#curious) { #curious };
      case (#inspiration) { #inspiration };
      case (#overwhelm) { #overwhelm };
      case (#embarrass) { #embarrass };
      case (#guilty) { #guilty };
      case (#apathetic) { #apathetic };
      case (#secure) { #secure };
      case (#unsafe) { #unsafe };
      case (#courage) { #courage };
      case (#ashamed) { #ashamed };
      case (#relieved) { #relieved };
      case (#triumph) { #triumph };
      case (#disgust) { #disgust };
      case (#joy) { #joy };
      case (#worry) { #worry };
      case (#melancholy) { #melancholy };
      case (#humbled) { #humbled };
      case (#zen) { #zen };
      case (#passionate) { #passionate };
      case (#indifferen) { #indifferen };
      case (#irritate) { #irritate };
      case (#hungry) { #hungry };
      case (#starving) { #starving };
      case (#craving) { #craving };
    };
  };

  public func run(old : OldActor) : NewActor {
    let newStatuses = old.statuses.map<Text, StatusPost, NewStatusPost>(
      func(_id, status) {
        { status with mood = convertMood(status.mood) };
      }
    );

    let newSilentSignals = old.silentSignals.map<Text, SilentSignal, NewSilentSignal>(
      func(_id, signal) {
        { signal with mood = convertMood(signal.mood) };
      }
    );

    {
      old with
      statuses = newStatuses;
      silentSignals = newSilentSignals;
    };
  };
};
