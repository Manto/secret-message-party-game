Template.missions.helpers({
  missions : function() {
    return Missions.find({
      is_completed : false
    });
  },
});


Template.players.helpers({
  players : function() {
    return Players.find({}, {
      sort : { name : 1 }
    });
  },
});

Template.actions.helpers({
  actions : function() {
    return Actions.find();
  },
});


Template.playerAdminItem.helpers({
  couriers_completed : function() {
    return Missions.find({
      is_completed : true,
      courier_id : this._id
    }).count();
  },
  receivers_completed : function() {
    return Missions.find({
      is_completed : true,
      receiver_id : this._id
    }).count();
  },
});

Template.actions.events({
  'click #createActionBtn' : function(e) {
    Meteor.call("createAction", $("#createAction").val());

    $("#createAction").val('');
  }
})