Router.configure({
  layoutTemplate: 'layout',
//  notFoundTemplate: 'notFound',
//  loadingTemplate: 'loading'
});


subscrbeAll = function() {
}

Router.map(function () {
  this.route('mainMenu', {
    path: '/',
    template: 'mainMenu',
    waitOn: subscrbeAll,
  });

  this.route('existingAgent', {
    path: '/existingAgent',
    template: 'existingAgent',
    waitOn: subscrbeAll
  });

  this.route('newAgent', {
    path: '/newAgent',
    template: 'newAgent',
    waitOn: subscrbeAll
  });

  this.route('setPassword', {
    path: '/setPassword',
    template: 'setPassword',
  });

  this.route('playerHome', {
    path: '/playerHome',
    template: 'playerHome',
  });

  this.route('missions', {
    path: '/missions',
    template: 'missions',
  });

  this.route('players', {
    path: '/players',
    template: 'players',
  });

  this.route('actions', {
    path: '/actions',
    template: 'actions',
  });

  this.route('foundPartner', {
    path: '/foundPartner/:_id',
    template: 'foundPartner',
    data : function() {
      var mission = Missions.findOne(this.params._id);
      return mission;
    }
  });

  this.route('foundPartnerLogin', {
    path: '/foundPartnerLogin',
    template: 'foundPartnerLogin'
  });

  this.route('wrongPartner', {
    path: '/wrongPartner',
    template: 'wrongPartner'
  });

  this.route('completedMission', {
    path: '/completedMission',
    template: 'completedMission'
  });

  this.route('endMission', {
    path: '/endMission',
    template: 'endMission'
  });

  this.route('enterPassword', {
    path: '/enterPassword/:_id',
    template: 'enterPassword',
    data : function() {
      var player = Players.findOne(this.params._id);
      return player;
    }
  });

});


