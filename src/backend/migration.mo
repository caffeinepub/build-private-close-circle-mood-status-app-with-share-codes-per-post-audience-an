import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  // Old actor types without avatar field.
  type OldUserProfile = {
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
  };

  type OldActor = {
    profiles : Map.Map<Principal, OldUserProfile>;
  };

  // New types with avatar field explicitly defined.
  type Avatar = {
    #systemAvatar : Text;
    #uploaded : {
      contentType : Text;
      image : [Nat8];
    };
  };

  type NewUserProfile = {
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
    avatar : ?Avatar;
  };

  type NewActor = {
    profiles : Map.Map<Principal, NewUserProfile>;
  };

  // Migration function to transform old state to new state with optional avatar field
  public func run(old : OldActor) : NewActor {
    let newProfiles = old.profiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_id, oldProfile) {
        {
          oldProfile with
          avatar = null : ?Avatar // Set avatar explicitly as null for all migrated records
        };
      }
    );
    { profiles = newProfiles };
  };
};
