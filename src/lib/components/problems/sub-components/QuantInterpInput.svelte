<script>
    export let interpretation = {};
    // quantPreds is array specifying the predicate letter, plus the n-place for predicate. Ex: [{letter: 'R', n: 2}]
    export let quantPreds = [];

    $: domain = printDomain(interpretation);
    $: extensions = getExtensions(interpretation);
    
    function printDomain(interp){
        var str = '{';
        for(var i=0; i < interp.domainSize; i++){
            if(i > 0){
                str += ', ';
            }
            str += (i + 1);
        }
        str += '}';
        return str;
    };

    function printPlaceholder(n){
        let str = '';
        for(let i=0; i < n; i++){
            if(i > 0){
                str += ', ';
            }
            str += (i+1);
        }
        return str;
    }

    function getExtensions(interpretation){
        var extensions = {};

        for(var key in quantPreds){
            extensions[quantPreds[key].letter] = [];
        }

        for(var key in interpretation){
            if(key != 'domainSize'){
                var predLetter = key.substr(0,1)
                var extension = key.substr(1);
                var str = '';
                str += extension.substr(0, 1);

                if(extension.length>1){
                    for(var i=1; i < extension.length; i++){
                        str += ', ' + extension.substr(i, 1);
                    }
					str = '<'+str+'>';
				}
                //str += str+', ';
                extensions[predLetter].push({extension: extension, extensionStr: str});
            }
                
        }
        return extensions;
    }

    function incrementDomain(){
        if(interpretation.domainSize < 9){
            interpretation.domainSize = interpretation.domainSize + 1;
        }
        else{
			alert('Domains cannot be bigger than 9.')
		}
    }

    function decrementDomain(){
        if(interpretation.domainSize > 1)
            interpretation.domainSize = interpretation.domainSize - 1;
    }

    function removeExtension(predLetter, extension){
        delete interpretation[predLetter+extension];
        interpretation = interpretation;
    }

    function handleKeyDown(quantPred, e){
        
        if(e.key === 'Enter'){
			var val = e.target.value.replace(/ /g, '');
			var units = val.split(',');
            var extension = '';
			
			//check to make sure the units are within domain of discourse, create extension str
			var inDomain = true;
			for(var i=0; i<units.length; i++){
                extension += units[i];
				if(parseInt(units[i]) > interpretation.domainSize)
					inDomain = false;
			}
            
			//check to make sure they've given the right number of units
			if(units.length != quantPred.n){
				alert('Incorrect number of elements. This predicate attaches to '+quantPred.n+' elements');
			}
			else if(!inDomain){
				alert('Predicates cannot attach to elements outside the domain.');
			}
			else{
			
				//delete value
				e.target.value = '';
				
				//add extension
				interpretation[quantPred.letter+extension] = true;
			
			}
		}
    }

    function handleFocusIn(e){
        e.target.parentElement.querySelector('.save-message').style.display = 'inline-block';
    }
    function handleFocusOut(e){
        e.target.parentElement.querySelector('.save-message').style.display = 'none';
    }

</script>

<style>
    input{
        padding: 3px;
        transition: all 0.15s ease-in-out;
        color: #4D4D4D;

    }

    input:focus {
        outline: 0;
        border-color: #5584EB;
        box-shadow: inset 0 0 0 0.1rem #5584EB;
    }


    .domain-buttons-container{
        position: absolute;
        left: -3.2rem;
        top: -.2rem;
    }

    .domain-button{
        display: inline-block;
        color: #999;
        border: 1px solid rgb(192, 192, 192);
        border-radius: .25rem;
        width: 20px;
        font-size: 12px;
        padding-left: 0;
        padding-right: 0;
        text-align: center;
    }
    .domain-button:hover{
        border-color: rgba(0,0,0,.2);
        cursor: pointer;
        color: #333;
        background-color: #eee;
    }

    .save-message{
        color:#aaa;
        font-size:12px;
        padding-left:15px;
    }
</style>

<div style="margin-left:3.25rem;">
    <div class="relative ml4 mt2 mb3">
        <span class="domain-buttons-container"><button class="domain-button" on:click={decrementDomain}>–</button> <button class="domain-button" on:click={incrementDomain}>+</button> </span>
        Universe = {domain}
    </div>

    {#each quantPreds as quantPred}
        <div class="submission-input-line relative logStr">
            {quantPred.letter} = {'{'}
            {#each extensions[quantPred.letter] as {extension, extensionStr}}
                <a class="extension" on:click={removeExtension(quantPred.letter, extension)}>{extensionStr}</a>,&nbsp;
            {/each}
            <input 
                class="br1 ba b--black-20"
                style="width:{17 * quantPred.n}px" 
                placeholder = {printPlaceholder(quantPred.n)}
                on:keydown={(e) => handleKeyDown(quantPred, e)} 
                on:focusin={(e) => handleFocusIn(e)} 
                on:focusout={(e) => handleFocusOut(e)}/>
            {'}'}
            <span class="save-message sans-serif" style="" hidden>Press 'Enter' to log extension</span>
            
        </div>
    {/each}
</div>