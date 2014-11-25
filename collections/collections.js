Players = new Mongo.Collection('players');
// name
// missions_completed

Missions = new Mongo.Collection('missions');
// started_at
// ended_at
// is_completed
// action_id
// prev_mission_id
// next_mission_id
// courier_id
// receiver_id

Actions = new Mongo.Collection('actions');
// mission_id
// description
