<template>
  <div id="AddTeamMemberModal">
    <div class="modal-body">
      <Loading v-if="loading" />
      <form class="inner-container" @submit.prevent="addTeamMembers">


        <div class="form-block">
          <!-- Input for new member email -->
          <div class="form-content-full">
            <h4>Add a member with an email address</h4>
            <div class="form-input">
              <label for="email">Email</label>
              <input v-model="member.email" id="email" type="email" placeholder="Email address" />
              <div class="button" @click="addToMembersArray(member.email)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.23233 1.20415C7.23233 0.914077 6.99718 0.678925 6.7071 0.678925C6.41702 0.678925 6.18187 0.914077 6.18187 1.20415V6.62122L0.764822 6.62122C0.474747 6.62122 0.239594 6.85637 0.239594 7.14644C0.239593 7.43652 0.474747 7.67167 0.764822 7.67167L6.18187 7.67167L6.18187 13.0887C6.18187 13.3788 6.41702 13.614 6.7071 13.614C6.99718 13.614 7.23233 13.3788 7.23233 13.0887L7.23233 7.67167L12.6494 7.67167C12.9395 7.67167 13.1746 7.43652 13.1746 7.14645C13.1746 6.85637 12.9395 6.62122 12.6494 6.62122L7.23233 6.62122V1.20415Z" fill="#1759D5"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="form-block">
          <!-- List of team members in teamMembers.members -->
          <div class="form-content-full">
            <h4>Team Members</h4>
            <table>
              <tr v-for="member in teamMembers.members" :key="member">
                <td>{{ member }}</td>
                <td>
                  <div class="button red" @click="removeMemberFromArray(member)">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 6C11.5 6.27614 11.2761 6.5 11 6.5L1 6.5C0.723858 6.5 0.5 6.27614 0.5 6C0.5 5.72386 0.723858 5.5 1 5.5L11 5.5C11.2761 5.5 11.5 5.72386 11.5 6Z" fill="#FF0000"/>
                    </svg>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>

      </form>
          
    </div>
    
    <div class="buttons">
      <button @click="addTeamMembers(teamMembers, teamId)" class="primary wide">Add Team Members</button>
    </div>
  </div>
</template>

<script setup>

import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Loading from '~/components/Loading.vue';

const loading = ref(false);
const router = useRoute();

const teamId = router.params.id;

// TeamMembers composable
import useTeamMembers from '~/composables/useTeamMembers';
const { addTeamMembers } = useTeamMembers();

// Set some sane defaults for the client object
const teamMembers = reactive({
  members: []
})

const member = reactive({
  email: ''
})

function addToMembersArray(email) {
  teamMembers.members.push(email);
}

function removeMemberFromArray(email) {
  teamMembers.members = teamMembers.members.filter(member => member !== email);
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#AddTeamMemberModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;

  .modal-body {
    width: 100%;

    p {
      margin: 0;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;
    border-top: 1px solid rgba($black, 0.1);
    width: 100%;
    padding: $spacing-md;

    .modal-confirmation {
      font-size: $font-size-xs;
      color: $red;
    }
  }
}

</style>