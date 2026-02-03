import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type StatusPostOld = {
    id : Text;
    author : Principal;
    mood : {
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
    };
    content : Text;
    audience : [Principal];
    createdAt : Time.Time;
  };

  type NewStatusPost = {
    id : Text;
    author : Principal;
    mood : {
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
    };
    content : Text;
    contextTags : ?[Text];
    audience : [Principal];
    createdAt : Time.Time;
  };

  type OldActor = {
    statuses : Map.Map<Text, StatusPostOld>;
    profiles : Map.Map<Principal, {
      name : Text;
      gender : {
        #male;
        #female;
        #nonBinary;
        #other;
      };
      dateOfBirth : Nat;
      showAge : Bool;
      relationshipIntent : {
        #friendship;
        #romantic;
        #both;
      };
      preferences : {
        intent : {
          #friendship;
          #romantic;
          #both;
        };
        gender : {
          #male;
          #female;
          #nonBinary;
          #other;
        };
      };
      shareCode : Text;
      createdAt : Time.Time;
    }>;
    requests : Map.Map<Text, {
      from : Principal;
      to : Principal;
      shareCode : Text;
      createdAt : Time.Time;
    }>;
    notifications : Map.Map<Text, {
      id : Text;
      user : Principal;
      message : Text;
      statusId : ?Text;
      isRead : Bool;
      createdAt : Time.Time;
    }>;
    circles : Map.Map<Principal, List.List<Principal>>;
    journals : Map.Map<Principal, List.List<{ date : Time.Time; content : Text; createdAt : Time.Time }>>;
    DEFAULT_CIRCLE_SIZE_LIMIT : Nat;
  };

  type NewActor = {
    statuses : Map.Map<Text, NewStatusPost>;
    profiles : Map.Map<Principal, {
      name : Text;
      gender : {
        #male;
        #female;
        #nonBinary;
        #other;
      };
      dateOfBirth : Nat;
      showAge : Bool;
      relationshipIntent : {
        #friendship;
        #romantic;
        #both;
      };
      preferences : {
        intent : {
          #friendship;
          #romantic;
          #both;
        };
        gender : {
          #male;
          #female;
          #nonBinary;
          #other;
        };
      };
      shareCode : Text;
      createdAt : Time.Time;
    }>;
    requests : Map.Map<Text, {
      from : Principal;
      to : Principal;
      shareCode : Text;
      createdAt : Time.Time;
    }>;
    notifications : Map.Map<Text, {
      id : Text;
      user : Principal;
      message : Text;
      statusId : ?Text;
      isRead : Bool;
      createdAt : Time.Time;
    }>;
    circles : Map.Map<Principal, List.List<Principal>>;
    journals : Map.Map<Principal, List.List<{ date : Time.Time; content : Text; createdAt : Time.Time }>>;
    DEFAULT_CIRCLE_SIZE_LIMIT : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newStatuses = old.statuses.map<Text, StatusPostOld, NewStatusPost>(
      func(_id, oldPost) {
        {
          oldPost with
          contextTags = null;
        };
      }
    );
    {
      old with statuses = newStatuses;
    };
  };
};
