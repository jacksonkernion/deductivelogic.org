<script>
    import supabase from "$lib/db";
    import {slugify} from "$lib/utils";
    import { courses } from "$lib/stores";
    import { session } from "$app/stores";

    import Input from '$lib/components/atoms/Input.svelte';
    import Modal from '$lib/jui-components/Modal.svelte';
    import Button from "$lib/components/atoms/Button.svelte";

    let user = $session.user;
    
    export let course = {
        name: null,
        slug: null,
        institution: null,
        instructor: null,
        admins: [user.id],
        users: [user.id],
        userProfiles: [user],
        problemSets: [],
        connectives: {
            andSymbol: '∙',
            orSymbol: '∨',
            notSymbol: '–',
            conditionalSymbol: '⊃',
            biconditionalSymbol: '≡',
            andShortcuts: '.',
            orShortcuts: 'v',
            notShortcuts: '-',
            conditionalShortcuts: '>',
            biconditionalShortcuts: '<>'
        }
    };
    export let updatedCourse;
    export let mode = 'create';

    let modalShow, deleteModalShow, deleteName;
    let title = (mode == 'create') ? "Create Course" : "Course Settings";
    let confirmText = (mode == 'create') ? "Create" : "Save";
    let loading = false;

    async function upsertCourse(){
        course.slug = slugify(course.name);

        //filter out userProfiles property
        const filteredCourse = Object.fromEntries(
            Object.entries(course).filter(([key, value]) => (key != 'userProfiles' && key != 'problemSets'))
        );

        try {
            loading = true;
            
            const res1 = await supabase
                .from('courses')
                .upsert(filteredCourse);
            if (res1.error) throw res1.error;
            
            if(res1.data && mode == 'create'){
                course.id = res1.data[0].id;
                $courses = [...$courses, course];
                $session.user.courses = [...$session.user.courses, course.id];
                const res2 = await supabase
                    .from('profiles')
                    .upsert([
                        { id: user.id, courses: $session.user.courses }
                    ]);
                if (res2.error) throw res2.error;
            }
            else{
                updatedCourse = course;
            }

        } catch (error) {
            alert(error.error_description || error.message)
        }
        finally{
            toggleModal();
            loading = false;
            if(mode == 'create')
                course = {name: null, slug: null};
        }
    }

    async function deleteCourse(){

        //should maybe delete course.id from user.courses arrays...

        deleteModalShow = !deleteModalShow;
        if(deleteName == course.name){
            try{

                const res1 = await supabase
                    .from('courses')
                    .delete()
                    .match({ id: course.id });

                if (res1.error) throw res1.error;

                const res2 = await supabase
                    .from('profiles')
                    .update({'courses': user.courses.filter(cId => cId !== course.id)})
                    .eq('id', user.id);

                if (res2.error) throw res2.error;

            } catch (error) {
                alert(error.error_description || error.message);
            } finally{
                $courses = $courses.filter(c => c.id !== course.id);
                $session.user.courses = $session.user.courses.filter(cId => cId !== course.id);
            }
        }   
        else{
            alert("Names did not match. Course was not deleted.");
        }
    }
    

  function toggleModal() {
    modalShow = !modalShow;
  }

  function toggleDeleteModal() {
    modalShow = !modalShow;
    deleteModalShow = !deleteModalShow;
  } 

</script>

{#if mode == 'edit'}
    <Button icon="settings-sharp" on:click={toggleModal}></Button>
{:else}
    <a class="light-silver" on:click={toggleModal}>Create Course...</a>
{/if}


  
{#if modalShow}

<form on:submit|preventDefault={upsertCourse}>
<Modal {title} {confirmText} bind:modalShow>
  
    <div>
        <Input label="Course name" bind:value={course.name}/>
    </div>

    <div class="pt3 mb4">
        <Input label="Institution <span class='normal black-60'>(optional)</span>" bind:value={course.institution}/>
    </div>

    <div class="divider"></div>

    <div class="mv3">

        <p class="f5 mb3">Symbols and Keyboard Shortcuts</p>

        <div class="mb2">
            <label for="andSymbol" class="f6 db fw5">Conjunction</label>
            <select class="w3 mr3 dib f3" name="andSymbol" bind:value={course.connectives.andSymbol}>
                <option value="∙">∙</option>
                <option value="∧">∧</option>
                <option value="&">&</option>
            </select>
            <div class="dib f7">
                <Input bind:value={course.connectives.andShortcuts}/>
            </div>
        </div>
        <div class="mb2">
            <label for="orSymbol" class="f6 fw5 db">Disjunction</label>
            <select class="w3 mr3 dib f3" name="orSymbol" bind:value={course.connectives.orSymbol}>
                <option value="∨">∨</option>
            </select>
            <div class="dib f7">
                <Input bind:value={course.connectives.orShortcuts}/>
            </div>
        </div>
        <div class="mb2">
            <label for="notSymbol" class="f6 fw5 db">Negation</label>
            <select class="w3 mr3 dib f3" name="notSymbol" bind:value={course.connectives.notSymbol}>
                <option value="–">–</option>
                <option value="¬">¬</option>
                <option value="~">~</option>
            </select>
            <div class="dib f7">
                <Input bind:value={course.connectives.notShortcuts}/>
            </div>
        </div>
        <div class="mb2">
            <label for="conditionalSymbol" class="f6 fw5 db">Conditional</label>
            <select class="w3 mr3 dib f3" name="conditionalSymbol" bind:value={course.connectives.conditionalSymbol}>
                <option value="⊃">⊃</option>
                <option value="→">→</option>
            </select>
            <div class="dib f7">
                <Input bind:value={course.connectives.conditionalShortcuts}/>
            </div>
        </div>
        <div>
            <label for="biconditionalSymbol" class="f6 fw5 db">Bionditional</label>
            <select class="w3 mr3 dib f3" name="biconditionalSymbol" bind:value={course.connectives.biconditionalSymbol}>
                <option value="≡">≡</option>
                <option value="↔">↔</option>
            </select>
            <div class="dib f7">
                <Input bind:value={course.connectives.biconditionalShortcuts}/>
            </div>
        </div>
        
    </div>

    <div class="divider"></div>

    {#if mode != 'create'}
        <div class="pt3 mt2">
            <Button on:click={toggleDeleteModal}>Delete course...</Button>
        </div>
    {/if}
  
</Modal>
</form>

{/if}

{#if deleteModalShow}

<form on:submit|preventDefault={deleteCourse}>
<Modal title="Delete Course" confirmText="Delete this course" bind:modalShow={deleteModalShow}>

        <p class="lh-copy f6">Are you absolutely sure you want to delete this course?</p>
        <p class="lh-copy f6">Please type <strong>{course.name}</strong> to confirm.</p>
  
      <div>
        <Input bind:value={deleteName}/>
      </div>
  
</Modal>
</form>

{/if}

