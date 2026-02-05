import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  type NewActor = {
    directedInteractions : Map.Map<Principal, Map.Map<Principal, Nat>>;
  };

  public func run(old : {}) : NewActor {
    { directedInteractions = Map.empty<Principal, Map.Map<Principal, Nat>>() };
  };
};
