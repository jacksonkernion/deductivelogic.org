<script>

    import Button from '$lib/components/atoms/Button.svelte'
    import { clickOutside } from '$lib/jui-components/clickOutside.js';
    import { trapFocus } from "$lib/jui-components/trapFocus";

    export let size = "medium";
    export let title = "";
    export let confirmText = "Confirm";
    export let cancelText = "Cancel";
  
    
    
    export let modalShow = false;
  
    function switchModalVisibility() {
      modalShow = !modalShow;
    }
  
    function handleClickOutside(event) {
      switchModalVisibility();
    }
  
    function handleCancelClick() {
      switchModalVisibility();
    }
  
    function handleCloseClick() {
      switchModalVisibility();
    }
  
    let trigger = 'Escape';
  
    function handleKeydown(e) {
      if (e.key == trigger) {
        switchModalVisibility();
      }
    }
  
  </script>

<style>

  /* Component */
  .c-modal-context {
  display: flex;
  height: 100%;
  left: 0;
  opacity: 0;
  position: fixed;
  top: 0;
  transform: translateY(-4rem) scale(0.98);
  visibility: hidden;
  width: 100%;
  z-index: 40;
  align-items: center;
  justify-content: center;

}
.c-modal-context.c-modal-context--visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    transition-delay: 0s;
    visibility: visible;
  }

.c-modal {
  filter: drop-shadow(0 0 1rem rgba(0, 0, 0, 0.2));
  border-radius: 0.4rem;
  display: flex;
  flex-direction: column;
  margin: auto;
  width: calc(100% - 8rem);
  z-index: 50;
}

/* Parts */


.c-modal__push {
  /* @media (min-width: 768px) {
    flex: 1 0 auto;
  }
  */
  flex: 1 0 auto;
}


.c-modal__header,
.c-modal__body,
.c-modal__footer {
  background-color: #FFF;
}

.c-modal__header {
  border-radius: 0.4rem 0.4rem 0 0;
}

.c-modal__header--bordered,
.c-modal__footer--bordered {
  border-bottom: .1rem solid rgba(0,0,0,.2);
}

.c-modal__body {
  flex: 1 1 auto;
  overflow: auto;
  max-height: calc(100vh - 8rem);
  padding: 1.5rem;
}

.c-modal__body--no-padding {
  padding: 0;
}

.c-modal__header--no-padding {
  padding-top: 0;
  padding-bottom: 0;
}

.c-modal__footer {
  border-radius: 0 0 0.4rem 0.4rem;
  border-top: .1rem solid rgba(0,0,0,.05);
  padding-top: .5rem;

}

.c-modal__header,
.c-modal__footer {
  flex: 0 0 auto;
}

.c-modal__content {
  flex: 1 1 auto;
  overflow: auto;
  padding: 2.4rem;
}

/* Sizes */

.c-modal--large {
  width: 88rem;
}

.c-modal--medium {
  width: 36rem;
}

.c-modal--small {
  width: 44rem;
}

/*
.c-modal--fullscreen {
  height: calc(100% - #{$c-modal-padding-horizontal * 2});
  max-height: none;
  max-width: none;
  width: calc(100% - #{$c-modal-padding-horizontal * 2});
}

.c-modal--fullwidth {
  max-width: 66rem;
  width: calc(100% - #{$c-modal-padding-horizontal * 2});
}

*/

.c-modal--height-auto {
  height: auto;
}

  /* Backdrop */

  .c-modal-backdrop {
  background: rgba(102, 102, 102, 0.4);
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  visibility: hidden;
  z-index: 30;
  }
  .c-modal-backdrop.c-modal-backdrop--visible {
    opacity: 1;
    transition-delay: 0s;
    visibility: visible;
  }

  /* The 'toolbar' header */

  .c-toolbar {
    width: 100%;
    height: 3rem;
    padding: 0 1.5rem;
  }
</style>

  
  <svelte:window on:keydown={handleKeydown}/>

<div class="c-modal-context c-modal-context--visible black">
  <div class="c-modal-backdrop c-modal-backdrop--visible"></div>
  <div
    class="c-modal c-modal--{size}"
    use:trapFocus
    role="dialog"
    use:clickOutside
    on:click_outside={handleClickOutside}
  >
    <div class="c-modal__push"></div>
    <div class="c-modal__header c-modal__header--bordered">
      <div class="c-toolbar">
        <div class="fl">
          <p class="fw5 f5">{title}</p>
        </div>
        <div class="fr mt2">
          <Button icon="close-outline" on:click={handleCloseClick} />
        </div>
      </div>
    </div>
  
    <div class="c-modal__body">
        <slot></slot>
    </div>

    
    <div class="c-modal__footer">
      <div class="c-toolbar">
          <div class="tr f6">
              <a class="mr2" on:click={handleCancelClick}>{cancelText}</a> 
              <Button on:submit type="submit">{confirmText}</Button>
          </div>
        </div>
    </div>
    
    <div class="c-modal__push"></div>
  </div>
</div>
  