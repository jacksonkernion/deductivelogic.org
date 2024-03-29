<script>

  import supabase from "$lib/db";
  import {session} from "$app/stores";
  import { courses } from '$lib/stores.js';

  import Modal from '$lib/jui-components/Modal.svelte';
  import ProblemSetModal from '$lib/components/modal-forms/ProblemSetModal.svelte';
  import CourseModal from "$lib/components/modal-forms/CourseModal.svelte";
  import ManageAccessModal from "$lib/components/modal-forms/ManageAccessModal.svelte";
  import Button from "$lib/components/atoms/Button.svelte"
  import Label from "$lib/components/atoms/Label.svelte"

  export let course = {name: null, slug: null, problemSets:[]};
  export let mode = "dashboard";

  $: defaultNumber = course.problemSets.length + 1;

  let isAdmin = course.admins.includes($session.user.id) ? true : false;
  let isJoined;
  if(!$session.user.guest){
    isJoined = ($session.user.courses.includes(course.id)) ? true : false;
  }

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
      course.problemSets = course.problemSets.filter(pSet => pSet.id !== selectedProblemSet.id);
      selectedProblemSet = null;
    }
  }

  async function publishProblemSet(problemSet, i){
    course.problemSets[i].published = true;
    const res1 = await supabase
      .from('problemSets')
      .update({'published': true})
      .eq('id', problemSet.id);
    if(res1.error){
      alert(res1.error.error_description || res1.error.message);
    }
  }

  async function unpublishProblemSet(problemSet, i){
    course.problemSets[i].published = false;
    const res1 = await supabase
      .from('problemSets')
      .update({'published': false})
      .eq('id', problemSet.id);
    if(res1.error){
      alert(res1.error.error_description || res1.error.message);
    }
  }

  async function joinCourse() {
    isJoined = true;
    $session.user.courses = [...$session.user.courses, course.id];
    const res1 = await supabase
      .from('courses')
      .update({'users': [...course.users, $session.user.id]})
      .eq('id', course.id);
    if(res1.error){
      alert(res1.error.error_description || res1.error.message);
    }
    else{
      $courses = [...$courses, res1.data];
      const res2 = await supabase
        .from('profiles')
        .update({'courses': $session.user.courses})
        .eq('id', $session.user.id);
      if(res2.error){
        alert(res2.error.error_description || res2.error.message);
      }
    }
  }

  async function unjoinCourse() {
    isJoined = false;
    course.users = course.users.filter(userId => userId != $session.user.id);
    $session.user.courses = $session.user.courses.filter(courseId => courseId != course.id);
    const res1 = await supabase
      .from('courses')
      .update({'users': course.users})
      .eq('id', course.id);
    if(res1.error){
      alert(res1.error.error_description || res1.error.message);
    }
    else{
      const res2 = await supabase
        .from('profiles')
        .update({'courses': $session.user.courses})
        .eq('id', $session.user.id);
      if(res2.error){
        alert(res1.error.error_description || res1.error.message);
      }
    }
  }

  function toggleModal() {
    modalShow = !modalShow;
  }

</script>

<div class="mt3 cf bb b--black-40">
  <p class="fl fw5 f5 lh-title mb2 mt3">
      {course.name}
      {#if course.institution}
        <span class="fw4 black-50"> ・ {course.institution}</span>
      {/if}
  </p>
  
  {#if isAdmin}
    <div class="fr mt2">
      <ManageAccessModal userProfiles={course.userProfiles} bind:course />
      <CourseModal mode='edit' {course} bind:updatedCourse={course} />
    </div>
  {:else if mode == "browse" & !$session.user.guest}
    <div class="fr">
        {#if isJoined}
          <Button active=true on:click={unjoinCourse}>Joined</Button>
        {:else}
          <Button on:click={joinCourse}>Join</Button>
        {/if}
      
    </div>
  {/if}
</div>


{#if course.problemSets.length > 0}
  <ul class="list pl0 mh0 mt0">
      {#each course.problemSets as problemSet, i}
          {#if isAdmin || problemSet.published}
            <li class="lh-copy pv2 bb b--black-10 v-mid cf">

                <div class="fl">
                  <a class="dib f6 pv2" href="{course.slug}/pset{problemSet.number}">{problemSet.name}</a> 
                  {#if !problemSet.published}
                    <span class="ml1"></span> <Label>Unpublished</Label>
                  {:else if !$session.user.guest && mode != "browse"}
                  <div class="dib black-50">
                    <p class="dib f6 pv2 ma0"> ・ <span class="dn di-ns">Completed: </span>{problemSet.correctSubmissions}/{problemSet.problemsOrder.length}</p>
                    {#if problemSet.problemsOrder.length > 0 && problemSet.correctSubmissions == problemSet.problemsOrder.length }
                      <div class="icon dib v-mid ph2 green">
                          <ion-icon name="checkmark-outline"></ion-icon>   
                      </div>   
                    {/if}
                  </div>
                  {/if} 
                </div>
                {#if isAdmin}
                  <div class="fr">
                    {#if !problemSet.published}
                      <Button icon="cloud-upload" on:click={publishProblemSet(problemSet, i)}/>
                    {:else}
                    <Button icon="cloud-done" on:click={unpublishProblemSet(problemSet, i)}/>
                    {/if}
                    <Button icon="bar-chart" href="{course.slug}/pset{problemSet.number}/report" />
                    <Button icon="trash" on:click={deleteProblemSetModal(problemSet)}/>
                  </div>
                {/if}

            </li>
          {/if}
      {/each}
  </ul>
{:else}
  <div class="lh-copy pv2 mh0 mv3 ba br2 b--black-10 v-mid cf black-40 bg-near-white tc"><p class="dib f6 fw5 pv2 ma0">No Problem Sets </p></div>
{/if}

{#if isAdmin}
<div class="cf">
  <div class="fr"><ProblemSetModal bind:defaultNumber courseId={course.id}/> </div>
</div>
{/if}


{#if modalShow}

<form on:submit|preventDefault={deleteProblemSet}>
    <Modal title="Delete Problem Set" bind:modalShow confirmText="Delete">
    
        Delete {selectedProblemSet.name}?
    
    </Modal>
</form>

{/if}
