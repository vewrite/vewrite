<template>
  <button class="button clear">
    <!-- {{ deliverable }} -->
      <!-- {{ user.identities[0].id }} -->
    <!-- <Avatar :deliverable="user.identities[0].id" /> -->
  </button>
</template>

<script setup>

// const props = defineProps(['deliverable', 'user']);

/* 

  I'm going to need:

  - To know which deliverable this is for
  - What state the deliverable is in (so I can check which role I need)
  - Which team is selected for the project
    - Users and their roles in the project

  Then I need to show:

  - Auto-assignent of deliverables if there is only one person of that role in the project's selected team
  - Manual assignment of deliverables if there are multiple people of that role in the project's selected team
    - Once assignment happens, we can perform the action assigned to this state

*/



</script>