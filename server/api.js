Meteor.methods({
  canCreatePlayer: function(name) {
    var player = Players.findOne({
      name : name
    });

    if (player) return false;
    else return true;
  },

  createPlayer: function(name, code) {
    var id = Players.insert({
      name : name,
      code : code
    });

    Meteor.call("ensureMission", id);

    return Players.findOne({_id:id});
  },

  createAction: function(desc, creatorId) {
    Actions.insert({
      description : desc,
      creator_id : creatorId
    });
  },

  ensureMission : function(playerId) {
    Meteor.call("getOrCreateCourierMissionForPlayer", playerId);
    Meteor.call("getOrCreateReceiverMissionForPlayer", playerId);
  },

  createNewMission: function() {
    var action = Meteor.call("getUnusedAction");
    var mission_id = Missions.insert({
      action_id : action._id,
      is_completed : false,
      started_at : new Date()
    });

    var mission = Missions.findOne({_id : mission_id});
    Actions.update({_id : action._id}, {
      $set : {
        mission_id : mission._id,
      }
    });

    return mission;
  },

  completeMission: function(id) {
    var mission = Missions.findOne({_id : id});
    Missions.update({_id : id}, {
      $set : {
        is_completed : true,
        completed_on : new Date()
      }
    });
  },

  ////// courier related functionss //////

  getCourierMissionForPlayer: function(playerId) {
    var mission = Missions.findOne({
      courier_id : playerId,
      is_completed : false
    });

    return mission;
  },

  getOrCreateCourierMissionForPlayer: function(playerId) {
    var mission = Meteor.call("getCourierMissionForPlayer", playerId);
    if (mission) return mission;
    else {
      var mission = Meteor.call("getOrCreateMissionNeedingCourierForPlayer", playerId);

      if (mission) {
        Missions.update({_id:mission._id}, {
          $set : {
            courier_id : playerId
          }
        });
        return mission;
      }
    }
  },

  getOrCreateMissionNeedingCourierForPlayer: function(playerId) {
    // get all mission w/ receiver but no courier
    var candidates = Missions.find({
      receiver_id : { $exists : true },
      courier_id : { $exists : false }
    }).fetch();

    var missions = [];
    candidates.forEach(function(candidate) {
      if (candidate.receiver_id == playerId) return;
      else
        missions.push(candidate);
    });

    if (missions.length > 0) {
      return missions[Math.floor(Math.random()*missions.length)];
    }
    else {
      return Meteor.call("createNewMission");
    }

  }, 

  /////// receiver related functions ////

  getReceiverMissionForPlayer: function(playerId) {
    var mission = Missions.findOne({
      receiver_id : playerId,
      is_completed : false
    });

    return mission;
  },

  getOrCreateReceiverMissionForPlayer: function(playerId) {
    var mission = Meteor.call("getReceiverMissionForPlayer", playerId);
    if (mission) return mission;
    else {
      var mission = Meteor.call("getOrCreateMissionNeedingReceiverForPlayer", playerId);

      if (mission) {
        Missions.update({_id:mission._id}, {
          $set : {
            receiver_id : playerId
          }
        });
        return mission;
      }
    }
  },

  getOrCreateMissionNeedingReceiverForPlayer: function(playerId) {
    var candidates = Missions.find({
      courier_id : { $exists : true },
      receiver_id : { $exists : false }
    }).fetch();

    var missions = [];
    candidates.forEach(function(candidate) {
      if (candidate.courier_id == playerId) return;
      else
        missions.push(candidate);
    });

    if (missions.length > 0) {
      return missions[Math.floor(Math.random()*missions.length)];
    }
    else {
      return Meteor.call("createNewMission");
    }
  }, 

  getUnusedAction: function() {
    var actions = Actions.find({
      mission_id : { $exists : false }
    }).fetch();

    var action = actions[Math.floor(Math.random()*actions.length)];
    return action;
  }
});