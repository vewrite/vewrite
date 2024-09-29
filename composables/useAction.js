import { ref } from 'vue';

/*

ACTIONS

An action is a thing that happens when a state is entered or exited. This could 
be any number of things, but for now we're going to keep it simple and just try
to target:

- Sending an email to notify a user that the state of a deliverable has changed
- [ FUTURE ] Sending a message to a Slack channel to notify a team that a deliverable has changed
- [ FUTURE ] Sending a message to a Discord channel to notify a team that a deliverable has changed
- [ FUTURE ] Sending a message to a Microsoft Teams channel to notify a team that a deliverable has changed
- [ FUTURE ] Sending a message to a Telegram channel to notify a team that a deliverable has changed
- [ FUTURE ] Sending a message to a WhatsApp channel to notify a team that a deliverable has changed
- [ FUTURE ] Sending a message to a Signal channel to notify a team that a deliverable has changed

Actions themselves will have a variety of propoerties:

- team member to notifiy
- channel to notify
- message to send

This means we need:

- A way to create an action, delete an action, update an action
- A way to run an action
- A way to list all actions

*/  

export function useAction() {


  return {
    
  }
}