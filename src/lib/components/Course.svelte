<script>

  import ProblemSetModal from '$lib/components/modal-forms/ProblemSetModal.svelte';
  import Modal from '$lib/jui-components/Modal.svelte';
  import supabase from "$lib/db";
  import {session} from "$app/stores";
  import { problemSets } from '$lib/stores.js';

  export let course = {name: null, slug: null};
  export let pSets = [];

  $: defaultNumber = pSets.length + 1;

  let isAdmin = course.admins.includes($session.user.id) ? true : false;

  let modalShow;
  let selectedProblemSet;

  function deleteProblemSetModal(problemSet){
    selectedProblemSet = problemSet;
    toggleModal();
  }

  async function deleteProblemSet() {
    const { data, error } = await supabase
      .from('problemSets')
      .delete()
      .match({ id: selectedProblemSet.id });
    toggleModal();
    if(error){
      alert(error.error_description || error.message);
    }
    else{
      $problemSets = $problemSets.filter(pSet => pSet.id !== selectedProblemSet.id);
      selectedProblemSet = null;
    }
  }

  function toggleModal() {
    modalShow = !modalShow;
  } 

</script>

<div class="mt3 cf bb b--black-40">
  <p class="fl fw5 f5 lh-title mb2 mt3">{course.name}</p>
  {#if isAdmin}
    <div class="fr">
      
    </div>
  {/if}
</div>


{#if pSets.length > 0}
  <ul class="list pl0 mh0 mt0">
      {#each pSets as problemSet}
          <li class="lh-copy pv2 bb b--black-10 v-mid cf">
              <div class="fl">
                <a class="dib f6 pv2" href="{course.slug}/pset{problemSet.number}">{problemSet.name}</a>
              </div>
              {#if isAdmin}
              <div class="fr">
                <div class="icon-button ba b--black-10 pa2 dib" on:click={deleteProblemSetModal(problemSet)}>
                    <ion-icon name="trash-outline"></ion-icon>
                </div>
              </div>
              {/if}
          </li>
      {/each}
  </ul>
{:else}
  <div class="lh-copy pv2 mh0 mv3 ba br2 b--black-10 v-mid cf black-40 bg-near-white tc"><p class="dib f6 fw5 pv2 ma0">No Problem Sets </p></div>
{/if}

<div class="cf">
  <div class="fr"><ProblemSetModal bind:defaultNumber courseId={course.id}/> </div>
</div>


{#if modalShow}

<form on:submit|preventDefault={deleteProblemSet}>
    <Modal title="Delete Problem Set" bind:modalShow confirmText="Delete">
    
        Delete {selectedProblemSet.name}?
    
    </Modal>
</form>

{/if}
