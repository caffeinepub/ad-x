import Array "mo:core/Array";
import Bool "mo:core/Bool";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module AdPreferences {
    public type CategoryCount = {
      category : Text;
      count : Nat;
    };

    public func compareByCount(a : CategoryCount, b : CategoryCount) : Order.Order {
      switch (Nat.compare(a.count, b.count)) {
        case (#equal) { Text.compare(a.category, b.category) };
        case (order) { order };
      };
    };
  };

  public type ConsentSettings = {
    shareInterests : Bool;
    shareAge : Bool;
    shareLocation : Bool;
  };

  public type Demographics = {
    ageRange : Text;
    location : Text;
  };

  public type UserProfile = {
    interests : [Text];
    consent : ConsentSettings;
    demographics : Demographics;
  };

  public type CompanyProfile = {
    name : Text;
    productCategory : Text;
  };

  public type BuyingIntentAnswer = {
    question : Text;
    answer : Text;
  };

  public type BuyingIntent = {
    category : Text;
    subcategory : Text;
    answers : [BuyingIntentAnswer];
    timestamp : Int;
  };

  public type AdminDashboardStats = {
    totalUsers : Nat;
    totalCompanies : Nat;
    totalBuyingIntents : Nat;
    interestBreakdown : [AdPreferences.CategoryCount];
    intentCategoryBreakdown : [AdPreferences.CategoryCount];
  };

  public type CompanyEntry = {
    principal : Text;
    profile : CompanyProfile;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let companyProfiles = Map.empty<Principal, CompanyProfile>();
  let buyingIntents = Map.empty<Principal, List.List<BuyingIntent>>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func ensureUserRegistered(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (null) {
        accessControlState.userRoles.add(caller, #user);
      };
      case (?_) {};
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      if (caller != user) {
        Runtime.trap("Unauthorized: Can only view your own profile");
      };
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    ensureUserRegistered(caller);
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCompanyProfile(company : Principal) : async ?CompanyProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      if (caller != company) {
        Runtime.trap("Unauthorized: Can only view your own company profile");
      };
    };
    companyProfiles.get(company);
  };

  public shared ({ caller }) func saveCompanyProfile(profile : CompanyProfile) : async () {
    ensureUserRegistered(caller);
    companyProfiles.add(caller, profile);
  };

  func categoryHasInterest(interests : [Text], category : Text) : Bool {
    interests.any(func(x) { x == category });
  };

  func shouldCountProfile(profile : UserProfile, category : Text) : Bool {
    profile.consent.shareInterests and categoryHasInterest(profile.interests, category);
  };

  public query ({ caller }) func getAudienceCountCategory(category : Text) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    userProfiles.values().toArray().map(func(profile) { shouldCountProfile(profile, category) }).filter(func(x) { x }).size();
  };

  public query ({ caller }) func getAllCategoryCounts() : async [AdPreferences.CategoryCount] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let categories = List.empty<Text>();
    companyProfiles.values().toArray().forEach(func(profile) { categories.add(profile.productCategory) });
    let categoriesArray = categories.toArray();
    let categoriesWithCounts = categoriesArray.map(
      func(category) {
        {
          category;
          count = userProfiles.values().toArray().map(
            func(profile) { shouldCountProfile(profile, category) }
          ).filter(func(x) { x }).size();
        };
      }
    );
    categoriesWithCounts.sort(AdPreferences.compareByCount);
  };

  // Admin-only: get full dashboard stats
  public query ({ caller }) func getAdminDashboardStats() : async AdminDashboardStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };

    let allInterests = ["Technology", "Fashion", "Food & Dining", "Travel", "Sports", "Health & Wellness", "Finance", "Gaming", "Home & Living", "Beauty & Skincare"];

    let interestBreakdown = allInterests.map(func(cat) {
      let count = userProfiles.values().toArray().filter(func(p) { categoryHasInterest(p.interests, cat) }).size();
      { category = cat; count };
    });

    // Count buying intents per category
    let intentCounts = Map.empty<Text, Nat>();
    var totalIntents = 0;
    buyingIntents.values().toArray().forEach(func(intentList) {
      intentList.toArray().forEach(func(intent) {
        totalIntents += 1;
        let current = switch (intentCounts.get(intent.category)) {
          case (null) { 0 };
          case (?n) { n };
        };
        intentCounts.add(intent.category, current + 1);
      });
    });

    let intentBreakdown = intentCounts.entries().toArray().map(func((cat, count)) {
      { category = cat; count };
    });

    {
      totalUsers = userProfiles.size();
      totalCompanies = companyProfiles.size();
      totalBuyingIntents = totalIntents;
      interestBreakdown;
      intentCategoryBreakdown = intentBreakdown;
    };
  };

  // Admin-only: get all company entries
  public query ({ caller }) func getAdminAllCompanies() : async [CompanyEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };
    companyProfiles.entries().toArray().map(func((p, profile)) {
      { principal = p.toText(); profile };
    });
  };

  // Buying Intent functions
  public shared ({ caller }) func saveBuyingIntent(category : Text, subcategory : Text, answers : [BuyingIntentAnswer]) : async () {
    ensureUserRegistered(caller);
    let intent : BuyingIntent = {
      category;
      subcategory;
      answers;
      timestamp = Time.now();
    };
    let existing = switch (buyingIntents.get(caller)) {
      case (null) { List.empty<BuyingIntent>() };
      case (?list) { list };
    };
    existing.add(intent);
    buyingIntents.add(caller, existing);
  };

  public query ({ caller }) func getCallerBuyingIntents() : async [BuyingIntent] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    switch (buyingIntents.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };
};
