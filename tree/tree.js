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
      toggleElement(listTreeToggle, expand);
    });
  }


  function buildNode(name, id, parent, children, attribute, attribute2, action){
    let childHTML = '';
    children.forEach((child)=>{
        childHTML += '<li class="p-list-tree__item" role="treeitem">' + child[attribute] + (attribute2 ? ' - ' + child[attribute2] : '') +'</li>';
    })
    let html = `
    <li class="p-list-tree__item p-list-tree__item--group" role="treeitem">
      <button class="p-list-tree__toggle" id="sub-${id}-btn" aria-controls="sub-${id}" aria-expanded="true" onclick="${action}()">${name}</button>
      <ul class="p-list-tree" role="group" id="sub-${id}" aria-hidden="false" aria-labelledby="sub-${id}-btn">
        ${childHTML}
      </ul>
    </li>`;
    parent.innerHTML += html;
}

function buildNestedNode(name, id, parent, children){
    let outerHTML = `<li class="p-list-tree__item p-list-tree__item--group" role="treeitem">
        <button class="p-list-tree__toggle" id="sub-${id}-btn" aria-controls="sub-${id}" aria-expanded="true" onclick="showPools()">${name}</button>
        <ul class="p-list-tree" role="group" id="sub-${id}" aria-hidden="false" aria-labelledby="sub-${id}-btn">`;
    children.forEach((child, index)=>{
        let childHTML = '';
        child.machines.forEach((machine)=>{
            childHTML += '<li class="p-list-tree__item" role="treeitem">' +  machine.id + ' - ' + machine.status.substring(15) +'</li>';
        })

        let html = `
       <li class="p-list-tree__item p-list-tree__item--group" role="treeitem">
                <button class="p-list-tree__toggle" id="sub-${id+index+1}-btn" aria-controls="sub-${id+index+1}" aria-expanded="false" onclick="showPool('${child.id}')">${child.id} - ${child.imageId.replace('osx-', '')} - ${child.machineTypeId.replace('g2-', '')} (${child.machines.length})</button>
                <ul class="p-list-tree" role="group" id="sub-${id+index+1}" aria-hidden="true" aria-labelledby="sub-${id+index+1}-btn">
                    ${childHTML}
                </ul>
                </li>`;

        outerHTML += html; 
    })

    outerHTML += '</ul></li>';

    parent.innerHTML += outerHTML;
}