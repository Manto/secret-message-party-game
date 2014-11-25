Template.mainMenu.events({
  'click #existingAgentBtn' : function(e) {
    document.location = '/existingAgent';
  },
  'click #newAgentBtn' : function(e) {
    document.location = '/newAgent';
  }
});

Template.newAgent.rendered = function() {
  amplify.store('currentPlayer', null);
}

///

Template.newAgent.rendered = function() {
  amplify.store('createPlayerName', null);
};

Template.newAgent.events({
  'click #submitName' : function(e) {
    var name = $("#nameInput").val();
    if (name) {
      Meteor.call("canCreatePlayer", name, function(err, result) {
        if (result) {
          amplify.store("createPlayerName", name);
          document.location = '/setPassword';
        }
        else {
          $("#errorMsg").removeClass('hidden');
          $("#errorMsg").html("that name has been taken");
        }
      });
    }
  },

  'click #backBtn' : function(e) {
    document.location = '/';
  }
});

Template.setPassword.helpers({
  name : function() {
    return amplify.store("createPlayerName");
  },

  'click #backBtn' : function(e) {
    document.location = '/newAgent';
  },
});

updateSetPasswordNextBtn = function() {
  var code = $("#passCode").val();

  if (code) {
    $("#nextBtn").removeClass("hidden");
  }
  else {
    $("#nextBtn").addClass("hidden");      
  }
}

Template.setPassword.events({
  'keypress #passCode' : function(e) {
    updateSetPasswordNextBtn();
  },

  'change #passCode' : function(e) {
    updateSetPasswordNextBtn();
  },

  'click #nextBtn' : function(e) {
    var name = amplify.store("createPlayerName");
    var code = $("#passCode").val();

    Meteor.call("createPlayer", name, code, function(err, result) {
      if (result) {
        amplify.store('currentPlayer', result);
        document.location = '/playerHome';
      }
      else {
        document.location = '/';
      }
    });
  },
});

Template.setPassword.rendered = function() {
  var name = amplify.store("createPlayerName");
  if (!name)
    document.location = '/';

  $("#nextBtn").addClass("hidden");
}

////

Template.existingAgent.helpers({
  players: function() {
    return Players.find({}, {
      sort : { name : -1 }
    });
  }
});

Template.existingAgent.events({
  'click #backBtn' : function(e) {
    document.location = '/';
  },
});

Template.playerItem.events({
  'click .player-name' : function(e) {
    var id = e.currentTarget.id;
    var player = Players.findOne({_id : id});
    amplify.store('currentPlayer', player);

    document.location = '/enterPassword/' + id;
  }
});

/////

Template.enterPassword.events({
  'keypress #passCode' : function(e) {
    updateSetPasswordNextBtn();
  },

  'change #passCode' : function(e) {
    updateSetPasswordNextBtn();
  },

  'click #backBtn' : function(e) {
    document.location = '/existingAgent';
  },

  'click #nextBtn' : function(e) {
    var player = amplify.store("currentPlayer");
    var code = $("#passCode").val();

    if (player.code == code) {
      document.location = '/playerHome';
    }
    else {
      $("#errorMessage").html("wrong passcode");
    }
  },
});

////

Template.playerHome.rendered = function() {
  amplify.store("currentMission", null);
  amplify.store("currentPartner", null);
  var player = amplify.store("currentPlayer");
  Meteor.call("ensureMission", player._id);
}

Template.playerHome.helpers({
  name : function() {
    return amplify.store('currentPlayer').name;
  },

  courier_mission : function() {
    var player = amplify.store("currentPlayer");
    var mission = Missions.findOne({
      courier_id : player._id,
      is_completed : false
    });

    return mission;
  },

  receiver_mission : function() {
    var player = amplify.store("currentPlayer");
    var mission = Missions.findOne({
      receiver_id : player._id,
      is_completed : false
    });



    return mission;
  },
});

Template.playerHome.events({
  'click #backBtn' : function(e) {
    amplify.store('currentPlayer', null);
    document.location = '/';
  } 
});

Template.courierMission.helpers({
  action_description : function() {
    if (!this._id) return;
    var action = Actions.findOne({
      mission_id : this._id
    });
    return action.description;
  }
});

Template.receiverMission.events({
  'click #foundPartnerBtn' : function(e) {
    amplify.store("currentMission", this);
    document.location = '/foundPartner/' + this._id;
  }
})

Template.receiverMission.helpers({
  action_description : function() {
    if (!this._id) return;
    var action = Actions.findOne({
      mission_id : this._id
    });
    return action.description;
  }
})

////

Template.foundPartner.helpers({
  players : function() {
    var player = amplify.store('currentPlayer');
    var list = [];
    var players = Players.find({}).fetch();

    players.forEach(function(d) {
      if (d._id != player._id)
        list.push(d);
    });

    return list;
  },
});

Template.playerItem2.events({
  'click .player-name-2' : function(e) {
    var id = e.currentTarget.id;
    var player = Players.findOne({_id : id});
    var mission = amplify.store('currentMission');
    amplify.store('currentPartner',player);

    document.location = '/foundPartnerLogin';
  }
})

Template.foundPartner.events({
  'click #backBtn' : function(e) {
    document.location = '/playerHome';
  }
});

Template.foundPartnerLogin.helpers({
  name : function() {
    var player = amplify.store('currentPartner');
    return player.name;
  },  
});

Template.foundPartnerLogin.events({
  'click #backBtn' : function(e) {
    var mission = amplify.store('currentMission');
    document.location = '/foundPartner/' + mission._id;
  },

  'click #nextBtn' : function(e) {
    var mission = amplify.store('currentMission');
    var player = amplify.store('currentPartner');
    console.log(player);
    if ($("#passCode").val() == player.code) {
      if (mission.courier_id == player._id) {
        Meteor.call("completeMission", mission._id, function(err, result) {
          document.location = '/completedMission';
        });
      }
      else {
        document.location = '/wrongPartner';
      }
    }
    else {
      $("#errorMessage").html("wrong passcode");
    }
  },
});

////

Template.wrongPartner.events({
  'click #returnBtn' : function(e) {
    document.location = '/playerHome';
  }
})

/////

Template.completedMission.helpers({
  player_name : function() {
    var player = amplify.store('currentPlayer');
    return player.name;
  },

  partner_name : function() {
    var player = amplify.store('currentPartner');
    return player.name;
  }
});

Template.completedMission.events({
  'click #createActionBtn' : function(e) {
    var player = amplify.store('currentPlayer');
    Meteor.call("createAction", $("#createAction").val(), player._id, function(err, result) {
      document.location = '/endMission';
    });
  }
});

///


Template.endMission.events({
  'click #returnBtn' : function(e) {
    document.location = '/playerHome';
  }
});