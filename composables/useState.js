import { ref } from 'vue';

/*

STATES

A state is a step in a workflow. Each state can have actions associated with it,
and can be assigned to a user that is either part of your team, or who is a 
stakeholder that requires some visibility.

This means we need:

- A way to create a state, delete a state, update a state
- A way to assign a state to a user
- A way to assign an action to a state

*/