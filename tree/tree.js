let tree_state = {};
/**
  Toggles the necessary aria- attributes' values on the elements
  to handle showing and hiding them.
  @param {HTMLElement} element The toggle element controlling the visibility.
  @param {Boolean} show Whether to show or hide the target.
*/
function toggleElement(element, show) {
    var target = document.getElementById(element.getAttribute('aria-controls'));
  
    if (target) {
      element.setAttribute('aria-expanded', show);
      target.setAttribute('aria-hidden', !show);
    }
  }
  
  /**
    Attaches event listeners for the list tree toggle.
    @param {HTMLElement} listTreeToggle The list tree toggle element.
  */
  function setupListTreeToggle(listTreeToggle) {
    listTreeToggle.addEventListener('click', function(event) {
      event.preventDefault();
      var expand = this.getAttribute('aria-expanded') === 'true' ? false : true;
      tree_state[event.target.id] = expand;
      toggleElement(listTreeToggle, expand);
    });
  }


  function buildNode(name, id, parent, children, attribute, attribute2, action, action2){
    let childHTML = '';
    children.forEach((child)=>{
        let actionCmd = name == 'Virtual Machines' ? action2 + '(\'' + child.id + '\')' : '';
        let suffix = name == 'Virtual Machines' ? ' - ' + child.status.substring(15) : '';
        childHTML += '<li id="node_'+child.id+'" class="p-list-tree__item '+(name == 'Virtual Machines' ? 'clickable' : '')+'" role="treeitem" onclick="'+actionCmd+'">' + child[attribute] + (attribute2 ? ' - ' + child[attribute2] : '') + suffix +'</li>';
    })
    let html = `
    <li class="p-list-tree__item p-list-tree__item--group" role="treeitem">
      <span>
        <button class="p-list-tree__toggle" id="sub-${id}-btn" aria-controls="sub-${id}" aria-expanded="${tree_state[id] == null ? name == 'Images' || name =='Machine Types' ? 'false' : 'true' : tree_state[id]}" onclick="${action}()">&nbsp;</button>
      
        <span class="folder" onclick="${action}()">${name}</span>
      </span>
      <ul class="p-list-tree" role="group" id="sub-${id}" aria-hidden="${tree_state[id] == null ? name == 'Images' || name =='Machine Types' ? 'true' : 'false' : !tree_state[id]}" aria-labelledby="sub-${id}-btn">
        ${childHTML}
      </ul>
    </li>`;
    parent.innerHTML += html;
}

function buildNestedNode(name, id, parent, pools, action){
    let outerHTML = `<li class="p-list-tree__item p-list-tree__item--group" role="treeitem">
        <button class="p-list-tree__toggle" id="sub-${id}-btn" aria-controls="sub-${id}" aria-expanded="true">&nbsp;</button>
        <span class="folder" onclick="showPools()">${name}</span>
        <ul class="p-list-tree" role="group" id="sub-${id}" aria-hidden="false" aria-labelledby="sub-${id}-btn">`;
    pools.forEach((pool, index)=>{
        let childHTML = '';
        pool.machines.forEach((machine)=>{
            let actionCmd = action + '(\'' + machine.id + '\')';
            childHTML += '<li class="p-list-tree__item clickable" role="treeitem" onclick="'+actionCmd+'">' +  machine.id + ' - ' + machine.status.substring(15) +'</li>';
        })


        let image = images.images.find((image)=>image.id==pool.imageId)
        let machineType = machine_types.machineTypes.find((machine_type)=>machine_type.id==pool.machineTypeId)
        
        let nameStr = image.stack.replace('osx-', '') + ' - ' + machineType.name.replace('g2-', '') + '(' + pool.machines.length + ')';
        let html = `
       <li class="p-list-tree__item p-list-tree__item--group" role="treeitem">
                <button class="p-list-tree__toggle" id="sub-${id+index+1}-btn" aria-controls="sub-${id+index+1}" aria-expanded="${tree_state[(id+index+1)] == null ? true : tree_state[(id+index+1)]}" >&nbsp;</button>
                <span class="folder" onclick="showPool('${pool.id}')">${nameStr}</span>
                <ul class="p-list-tree" role="group" id="sub-${id+index+1}" aria-hidden="${tree_state[(id+index+1)] == null ? false : tree_state[(id+index+1)]}" aria-labelledby="sub-${id+index+1}-btn">
                    ${childHTML}
                </ul>
                </li>`;

        outerHTML += html; 
    })

    outerHTML += '</ul></li>';

    parent.innerHTML += outerHTML;
}