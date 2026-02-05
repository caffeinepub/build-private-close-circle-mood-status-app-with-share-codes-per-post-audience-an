import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat32 "mo:core/Nat32";
import Char "mo:core/Char";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
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
  };

  module Mood {
    public func toText(mood : Mood) : Text {
      switch (mood) {
        case (#happy) { "Happy" };
        case (#sad) { "Sad" };
        case (#stressed) { "Stressed" };
        case (#excited) { "Excited" };
        case (#neutral) { "Neutral" };
        case (#anxious) { "Anxious" };
        case (#content) { "Content" };
        case (#angry) { "Angry" };
        case (#relaxed) { "Relaxed" };
        case (#motivate) { "Motivated" };
        case (#tired) { "Tired" };
        case (#bore) { "Bored" };
        case (#hopeful) { "Hopeful" };
        case (#frustrate) { "Frustrated" };
        case (#grateful) { "Grateful" };
        case (#calm) { "Calm" };
        case (#nervous) { "Nervous" };
        case (#satisfy) { "Satisfied" };
        case (#disappoint) { "Disappointed" };
        case (#optimistic) { "Optimistic" };
        case (#confident) { "Confident" };
        case (#lonely) { "Lonely" };
        case (#shy) { "Shy" };
        case (#fear) { "Fearful" };
        case (#curious) { "Curious" };
        case (#inspiration) { "Inspired" };
        case (#overwhelm) { "Overwhelmed" };
        case (#embarrass) { "Embarrassed" };
        case (#guilty) { "Guilty" };
        case (#apathetic) { "Apathetic" };
        case (#secure) { "Secure" };
        case (#unsafe) { "Unsafe" };
        case (#courage) { "Courageous" };
        case (#ashamed) { "Ashamed" };
        case (#relieved) { "Relieved" };
        case (#triumph) { "Triumphant" };
        case (#disgust) { "Disgusted" };
        case (#joy) { "Joyful" };
        case (#worry) { "Worried" };
        case (#melancholy) { "Melancholy" };
        case (#humbled) { "Humbled" };
        case (#zen) { "Zen" };
        case (#passionate) { "Passionate" };
        case (#indifferen) { "Indifferent" };
        case (#irritate) { "Irritated" };
      };
    };
  };

  type Gender = {
    #male;
    #female;
    #nonBinary;
    #other;
  };

  module Gender {
    public func toText(gender : Gender) : Text {
      switch (gender) {
        case (#male) { "Male" };
        case (#female) { "Female" };
        case (#nonBinary) { "Non-Binary" };
        case (#other) { "Other" };
      };
    };
  };

  type RelationshipIntent = {
    #friendship;
    #romantic;
    #both;
  };

  module RelationshipIntent {
    public func toText(intent : RelationshipIntent) : Text {
      switch (intent) {
        case (#friendship) { "Friendship" };
        case (#romantic) { "Romantic" };
        case (#both) { "Both" };
      };
    };
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

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      switch (Text.compare(a.name, b.name)) {
        case (#equal) { Text.compare(a.shareCode, b.shareCode) };
        case (other) { other };
      };
    };

    public func compareByCreatedAt(a : UserProfile, b : UserProfile) : Order.Order {
      if (a.createdAt >= b.createdAt) { #greater } else { #less };
    };
  };

  type JoinRequest = {
    from : Principal;
    to : Principal;
    shareCode : Text;
    createdAt : Time.Time;
  };

  module JoinRequest {
    public func compare(a : JoinRequest, b : JoinRequest) : Order.Order {
      if (a.createdAt >= b.createdAt) { #greater } else { #less };
    };
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

  module Notification {
    public func compare(a : Notification, b : Notification) : Order.Order {
      if (a.createdAt >= b.createdAt) { #greater } else { #less };
    };
  };

  type StatusPost = {
    id : Text;
    author : Principal;
    mood : Mood;
    content : Text;
    contextTags : ?[Text];
    audience : [Principal];
    createdAt : Time.Time;
  };

  module StatusPost {
    public func compare(a : StatusPost, b : StatusPost) : Order.Order {
      if (a.createdAt >= b.createdAt) { #greater } else { #less };
    };
  };

  type JournalEntry = {
    date : Time.Time;
    content : Text;
    createdAt : Time.Time;
  };

  module JournalEntry {
    public func compare(a : JournalEntry, b : JournalEntry) : Order.Order {
      if (a.date < b.date) { #less } else { #greater };
    };
  };

  type SafePeopleList = {
    people : [Principal];
  };

  type SilentSignal = {
    id : Text;
    author : Principal;
    mood : Mood;
    content : Text;
    audience : [Principal];
    createdAt : Time.Time;
  };

  func generateRandomShareCode() : Text {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".toArray();
    let code = Array.tabulate(
      6,
      func(i) {
        let digit = Nat32.fromNat(i) % 36;
        chars[digit.toNat()];
      },
    );
    code.toText();
  };

  let profiles = Map.empty<Principal, UserProfile>();
  let requests = Map.empty<Text, JoinRequest>();
  let notifications = Map.empty<Text, Notification>();
  let circles = Map.empty<Principal, List.List<Principal>>();
  let statuses = Map.empty<Text, StatusPost>();
  let journals = Map.empty<Principal, List.List<JournalEntry>>();
  let safePeople = Map.empty<Principal, SafePeopleList>();
  let silentSignals = Map.empty<Text, SilentSignal>();

  let DEFAULT_CIRCLE_SIZE_LIMIT = 10;
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func contains(list : [Principal], member : Principal) : Bool {
    for (m in list.values()) {
      if (m == member) { return true };
    };
    false;
  };

  func sanitizeStatusForViewer(status : StatusPost, viewer : Principal) : StatusPost {
    if (status.author == viewer) {
      status;
    } else {
      {
        status with contextTags = null;
      };
    };
  };

  func isCircleConnection(caller : Principal, person : Principal) : Bool {
    switch (circles.get(caller)) {
      case (?circle) {
        if (circle.contains(person)) {
          return true;
        };
      };
      case (null) {};
    };

    switch (circles.get(person)) {
      case (?circle) {
        if (circle.contains(caller)) {
          return true;
        };
      };
      case (null) {};
    };

    false;
  };

  func getAllCircleConnections(user : Principal) : [Principal] {
    var connections = List.empty<Principal>();

    switch (circles.get(user)) {
      case (?circle) {
        for (member in circle.toArray().values()) {
          if (member != user and not connections.contains(member)) {
            connections.add(member);
          };
        };
      };
      case (null) {};
    };

    for ((owner, circle) in circles.entries()) {
      if (owner != user and circle.contains(user)) {
        if (not connections.contains(owner)) {
          connections.add(owner);
        };
        for (member in circle.toArray().values()) {
          if (member != user and not connections.contains(member)) {
            connections.add(member);
          };
        };
      };
    };

    connections.toArray();
  };

  func hasPendingJoinRequestFrom(circleOwner : Principal, requester : Principal) : Bool {
    let ownerProfile = switch (profiles.get(circleOwner)) {
      case (?profile) { profile };
      case (null) { return false };
    };
    let key = ownerProfile.shareCode.concat(requester.toText());
    switch (requests.get(key)) {
      case (?request) {
        request.to == circleOwner and request.from == requester;
      };
      case (null) { false };
    };
  };

  func hasProfile(user : Principal) : Bool {
    switch (profiles.get(user)) {
      case (?_) { true };
      case (null) { false };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller == user) {
      return profiles.get(user);
    };
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return profiles.get(user);
    };
    if (isInCircleId(caller, user) or isInCircleId(user, caller)) {
      return profiles.get(user);
    };
    if (hasPendingJoinRequestFrom(caller, user)) {
      return profiles.get(user);
    };
    Runtime.trap("Unauthorized: Can only view profiles of circle members or pending requesters");
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let shareCode = if (profile.shareCode == "") {
      generateRandomShareCode();
    } else {
      profile.shareCode;
    };

    let entry : UserProfile = {
      profile with
      shareCode;
      createdAt = Time.now();
    };
    profiles.add(caller, entry);
  };

  public shared ({ caller }) func uploadAvatar(avatar : UploadedAvatar) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload avatars");
    };

    if (avatar.contentType != "image/png" and avatar.contentType != "image/jpeg") {
      Runtime.trap("Invalid content type. Only PNG and JPEG images are supported");
    };

    let maxSizeBytes = 1000 * 1024;
    if (avatar.image.size() > maxSizeBytes) {
      Runtime.trap("Image size exceeds the maximum allowed size of 1000KB.");
    };

    let currentProfile = switch (profiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User not found") };
    };

    let updatedProfile : UserProfile = {
      currentProfile with avatar = ?(#uploaded avatar);
    };

    profiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func selectSystemAvatar(avatarId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can select system avatars");
    };

    let currentProfile = switch (profiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User not found") };
    };

    let updatedProfile : UserProfile = {
      currentProfile with avatar = ?(#systemAvatar avatarId);
    };

    profiles.add(caller, updatedProfile);
  };

  type PendingRequestWithProfile = {
    request : JoinRequest;
    profile : UserProfile;
  };

  public query ({ caller }) func getUnprocessedJoinRequests() : async [PendingRequestWithProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view join requests");
    };

    let current = getProfileFromCaller(caller);

    let pendingRequests = requests.values().toArray().filter(
      func(r) {
        r.to == caller and r.shareCode == current.shareCode and not isInCircleId(caller, r.from);
      }
    ).sort();

    let grouped = pendingRequests.map(
      func(request) {
        switch (profiles.get(request.from)) {
          case (?profile) {
            ?{ request; profile };
          };
          case (null) { null };
        };
      }
    );

    grouped.filterMap(func(x) { x });
  };

  public shared ({ caller }) func updateProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update a profile");
    };

    let entry : UserProfile = {
      profile with
      shareCode = profile.shareCode;
      createdAt = Time.now();
    };
    profiles.add(caller, entry);
  };

  public query ({ caller }) func viewProfile(id : Principal) : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (id == caller) {
      return getProfileFromCaller(id);
    };
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return getProfileFromCaller(id);
    };
    if (isInCircleId(id, caller) or isInCircleId(caller, id)) {
      return getProfileFromCaller(id);
    };
    if (hasPendingJoinRequestFrom(caller, id)) {
      return getProfileFromCaller(id);
    };
    Runtime.trap("Unauthorized: Can only view your own profile, profiles of circle members, or pending requesters");
  };

  public query ({ caller }) func getShareCodeByPrincipal(principal : Principal) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access share codes");
    };
    if (principal != caller) {
      Runtime.trap("Unauthorized: Cannot fetch share code for others");
    };
    getProfileFromCaller(principal).shareCode;
  };

  public shared ({ caller }) func updateShareCode(code : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update share codes");
    };
    let profile = getProfileFromCaller(caller);
    let newCode = code;
    let updatedProfile : UserProfile = {
      profile with shareCode = newCode
    };
    profiles.add(caller, updatedProfile);
    newCode;
  };

  func isInCircleId(id : Principal, potentialMember : Principal) : Bool {
    let circle = circles.get(id);
    switch (circle) {
      case (null) { false };
      case (?circle) { circle.contains(potentialMember) };
    };
  };

  public shared ({ caller }) func joinCircleFromShareCode(code : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join circles");
    };
    if (not hasProfile(caller)) {
      Runtime.trap("Unauthorized: You must create a profile before joining circles");
    };

    let target = getProfileByShareCode(code);
    if (target.0 == caller) {
      Runtime.trap("You cannot join your own circle");
    };
    if (isInCircleId(target.0, caller)) {
      Runtime.trap("You are already in the circle of " # target.1.name # "!");
    };
    let key = code.concat(caller.toText());
    let request : JoinRequest = {
      from = caller;
      to = target.0;
      shareCode = code;
      createdAt = Time.now();
    };
    requests.add(key, request);

    let requesterProfile = getProfileFromCaller(caller);

    let notificationId = key # "_" # Time.now().toText();
    let notification : Notification = {
      id = notificationId;
      user = target.0;
      message = requesterProfile.name # " has requested to join your Circle.";
      statusId = null;
      isRead = false;
      createdAt = Time.now();
      requesterName = ?requesterProfile.name;
    };
    notifications.add(notificationId, notification);
  };

  public shared ({ caller }) func acceptJoinRequest(from : Principal, code : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept join requests");
    };
    let profile = getProfileFromCaller(caller);
    if (profile.shareCode != code) {
      Runtime.trap("Unauthorized: Invalid share code - you can only accept requests for your own circle");
    };
    let key = code.concat(from.toText());
    switch (requests.get(key)) {
      case (null) { Runtime.trap("No join request found from this user.") };
      case (?request) {
        if (request.to != caller) {
          Runtime.trap("Unauthorized: This request is not for your circle");
        };
        let circle = switch (circles.get(caller)) {
          case (null) {
            let l = List.empty<Principal>();
            l.add(caller);
            l;
          };
          case (?c) { c };
        };
        if (circle.size() >= DEFAULT_CIRCLE_SIZE_LIMIT) {
          Runtime.trap("Circle size limit reached.");
        };
        circle.add(from);
        circles.add(caller, circle);

        requests.remove(key);
      };
    };
  };

  public shared ({ caller }) func declineJoinRequest(user : Principal, code : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can decline join requests");
    };
    let profile = getProfileFromCaller(caller);
    if (profile.shareCode != code) {
      Runtime.trap("Unauthorized: Invalid share code - you can only decline requests for your own circle");
    };
    let key = code.concat(user.toText());
    switch (requests.get(key)) {
      case (null) { Runtime.trap("No join request found from this user.") };
      case (?request) {
        if (request.to != caller) {
          Runtime.trap("Unauthorized: This request is not for your circle");
        };
        requests.remove(key);
      };
    };
  };

  public shared ({ caller }) func removeCircleMember(member : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove circle members");
    };
    let circle = circles.get(caller);
    switch (circle) {
      case (null) { Runtime.trap("Circle is empty") };
      case (?circle) {
        if (circle.contains(member)) {
          let filteredMembers = circle.toArray().filter(func(m) { m != member });
          let newCircle = List.fromArray(filteredMembers);
          circles.add(caller, newCircle);
        } else {
          Runtime.trap("Member not found in your circle");
        };
      };
    };
  };

  public shared ({ caller }) func postStatus(status : StatusPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post statuses");
    };
    if (not hasProfile(caller)) {
      Runtime.trap("Unauthorized: You must create a profile before posting statuses");
    };

    let filtered = status.audience.filter(func(a) { a != caller });
    let enhancedAudience = [caller].concat(filtered);

    let isSelfOnly = enhancedAudience.size() == 1 and enhancedAudience[0] == caller;

    if (isSelfOnly) {
    } else {
      let callerCircle = circles.get(caller);
      switch (callerCircle) {
        case (null) {
          Runtime.trap("Circle must exist to post for audience other than yourself");
        };
        case (?circle) {
          for (recipient in enhancedAudience.values()) {
            if (recipient != caller and not circle.contains(recipient)) {
              Runtime.trap("Unauthorized: All audience members must be in your circle");
            };
          };
        };
      };
    };

    let id = caller.toText() # "-" # Time.now().toText();
    statuses.add(id, {
      id;
      author = caller;
      mood = status.mood;
      content = status.content;
      contextTags = status.contextTags;
      audience = enhancedAudience;
      createdAt = Time.now();
    });

    for (recipient in enhancedAudience.values()) {
      if (recipient != caller) {
        let notificationId = id # recipient.toText();
        notifications.add(notificationId, {
          id = notificationId;
          user = recipient;
          message = "You have been added to the audience of a new post. Please check it with status id '" # id # "'!";
          statusId = ?id;
          isRead = false;
          createdAt = Time.now();
          requesterName = null;
        });
      };
    };
  };

  type FeedItem = {
    #status : StatusPost;
    #silentSignal : SilentSignal;
  };

  public query ({ caller }) func getFeed() : async [FeedItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view the feed");
    };

    let statusFeed : [FeedItem] = statuses.values().toArray().filter(
      func(status) {
        status.author == caller or contains(status.audience, caller);
      }
    ).map(
      func(status) {
        #status(sanitizeStatusForViewer(status, caller));
      }
    );

    let signalFeed : [FeedItem] = silentSignals.values().toArray().filter(
      func(signal) {
        signal.author == caller or contains(signal.audience, caller);
      }
    ).map(
      func(signal) { #silentSignal(signal) }
    );

    let combinedFeed = statusFeed.concat(signalFeed);

    combinedFeed.sort(
      func(a, b) {
        let aCreatedAt = switch (a) {
          case (#status(s)) { s.createdAt };
          case (#silentSignal(sig)) { sig.createdAt };
        };
        let bCreatedAt = switch (b) {
          case (#status(s)) { s.createdAt };
          case (#silentSignal(sig)) { sig.createdAt };
        };
        if (aCreatedAt > bCreatedAt) { #less } else { #greater };
      }
    );
  };

  public query ({ caller }) func getNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };
    notifications.values().toArray().filter(
      func(notification) {
        notification.user == caller;
      }
    ).sort();
  };

  public shared ({ caller }) func markNotificationAsRead(notificationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };
    switch (notifications.get(notificationId)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?notification) {
        if (notification.user != caller) {
          Runtime.trap("Unauthorized: Can only mark your own notifications as read");
        };
        let updatedNotification : Notification = {
          notification with isRead = true
        };
        notifications.add(notificationId, updatedNotification);
      };
    };
  };

  public query ({ caller }) func getCircleMembers() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view circle members");
    };
    switch (circles.get(caller)) {
      case (null) { [] };
      case (?circle) { circle.toArray() };
    };
  };

  public query ({ caller }) func getStatus(statusId : Text) : async ?StatusPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view statuses");
    };
    switch (statuses.get(statusId)) {
      case (null) { null };
      case (?status) {
        if (status.author == caller or contains(status.audience, caller)) {
          ?sanitizeStatusForViewer(status, caller);
        } else {
          Runtime.trap("Unauthorized: You are not in the audience for this status");
        };
      };
    };
  };

  func getProfileFromCaller(id : Principal) : UserProfile {
    switch (profiles.get(id)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };
  };

  func getNameFromCaller(id : Principal) : Text {
    switch (profiles.get(id)) {
      case (null) { "Unknown user" };
      case (?profile) { profile.name };
    };
  };

  func getProfileByShareCode(code : Text) : (Principal, UserProfile) {
    let filteredProfiles = profiles.entries().toArray().filter(
      func((_, v)) { v.shareCode == code }
    );
    if (filteredProfiles.size() == 0) {
      Runtime.trap(
        "User not found for share code " # code
      );
    };
    filteredProfiles[0];
  };

  public shared ({ caller }) func createOrUpdateJournalEntry(content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create journal entries");
    };

    let today = Time.now();
    let newEntry : JournalEntry = {
      date = today;
      content;
      createdAt = Time.now();
    };

    let entries = switch (journals.get(caller)) {
      case (null) {
        let list = List.empty<JournalEntry>();
        list.add(newEntry);
        list;
      };
      case (?existing) {
        existing.filter(func(entry) { entry.date != today });
      };
    };

    let listEntries = switch (journals.get(caller)) {
      case (null) {
        let list = List.empty<JournalEntry>();
        list.add(newEntry);
        list;
      };
      case (?existing) {
        entries.add(newEntry);
        entries;
      };
    };
    journals.add(caller, listEntries);
  };

  public query ({ caller }) func getJournalEntry(date : Time.Time) : async ?JournalEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access journals");
    };
    switch (journals.get(caller)) {
      case (null) { null };
      case (?entries) {
        entries.find(
          func(entry) { entry.date == date }
        );
      };
    };
  };

  public query ({ caller }) func getAllJournalEntries() : async [JournalEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access journals");
    };
    switch (journals.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.toArray().sort() };
    };
  };

  public shared ({ caller }) func deleteJournalEntry(date : Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete journal entries");
    };
    let entries = switch (journals.get(caller)) {
      case (null) { Runtime.trap("No journal entries found") };
      case (?entries) { entries };
    };
    let matchingEntry = entries.find(
      func(entry) { entry.date == date }
    );
    switch (matchingEntry) {
      case (null) { Runtime.trap("No journal entry found for this date") };
      case (?_) {
        let filteredEntries = entries.filter(func(entry) { entry.date != date });
        journals.add(caller, filteredEntries);
      };
    };
  };

  public query ({ caller }) func getEntriesByRange(startDate : Time.Time, endDate : Time.Time) : async [JournalEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access journals");
    };
    switch (journals.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.toArray().filter(
          func(entry) { entry.date >= startDate and entry.date <= endDate }
        );
      };
    };
  };

  public query ({ caller }) func getSafePeople() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Safe People lists");
    };
    switch (safePeople.get(caller)) {
      case (null) { [] };
      case (?list) { list.people };
    };
  };

  public shared ({ caller }) func setSafePerson(person : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set Safe People");
    };
    if (person == caller) {
      Runtime.trap("You cannot set yourself as a Safe Person");
    };

    if (not isCircleConnection(caller, person)) {
      Runtime.trap("Unauthorized: Can only set Safe People from your circle connections");
    };

    var currentList : [Principal] = switch (safePeople.get(caller)) {
      case (null) { [] };
      case (?existing) { existing.people };
    };

    if (currentList.size() >= 2) {
      Runtime.trap("Safe People list can only contain up to 2 people");
    };

    for (p in currentList.values()) {
      if (p == person) {
        Runtime.trap("This person is already set as safe person");
      };
    };

    currentList := currentList.concat([person]);
    safePeople.add(caller, {
      people = currentList;
    });
  };

  public shared ({ caller }) func unsetSafePerson(person : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unset Safe People");
    };
    var currentList : [Principal] = switch (safePeople.get(caller)) {
      case (null) { [] };
      case (?existing) { existing.people };
    };
    currentList := currentList.filter(
      func(p) { p != person }
    );
    safePeople.add(caller, {
      people = currentList;
    });
  };

  public query ({ caller }) func getEligibleSafePeopleCandidates() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve Safe People candidates");
    };
    getAllCircleConnections(caller);
  };

  public shared ({ caller }) func postSilentSignal(mood : Mood, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post silent signals");
    };
    if (not hasProfile(caller)) {
      Runtime.trap("Unauthorized: You must create a profile before posting silent signals");
    };

    let signalId = caller.toText() # "-" # Time.now().toText();
    let audience = switch (safePeople.get(caller)) {
      case (null) { [caller] };
      case (?list) {
        if (list.people.isEmpty()) {
          [caller];
        } else {
          for (person in list.people.values()) {
            if (not isCircleConnection(caller, person)) {
              Runtime.trap("Unauthorized: Safe People list contains invalid circle connections");
            };
          };
          list.people;
        };
      };
    };

    let newSignal : SilentSignal = {
      id = signalId;
      author = caller;
      mood;
      content;
      audience;
      createdAt = Time.now();
    };

    silentSignals.add(signalId, newSignal);
  };

  public query ({ caller }) func getSilentSignals() : async [SilentSignal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view silent signals");
    };
    let visibleSignals = silentSignals.values().toArray().filter(
      func(signal) { contains(signal.audience, caller) }
    );
    visibleSignals.sort(
      func(a, b) { if (a.createdAt < b.createdAt) { #greater } else #less }
    );
  };

  public query ({ caller }) func getOwnSilentSignals() : async [SilentSignal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their own signals");
    };

    let userSignals = silentSignals.values().toArray().filter(
      func(signal) { signal.author == caller }
    );

    userSignals.sort(
      func(a, b) { if (a.createdAt < b.createdAt) { #greater } else #less }
    );
  };
};
