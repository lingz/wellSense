Meteor.Router.add
  "/": "home"
  "/graph": "graph"
  "/admin": "admin"
  "/well/:wellCode": (wellCode)->
    Session.set("activeWell", wellCode)
    return "home"
