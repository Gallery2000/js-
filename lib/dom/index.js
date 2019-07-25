

let dom = {
    /**
     * @description: 给element添加event并找到与selector匹配的子节点，并调用callback
     * @selector {String} 
     * @return: event element
     */
    on:function(element,eventType,selector,fn){
        element.addEventListener(eventType,function(event){
            let el = event.target;
            //el是点击到的子节点，向上寻找与selector匹配的节点
            while(!el.matches(selector)){
                if(element===el){
                    el = null;
                    break;
                }
                el = el.parentNode;
            }
            el&&fn.call(el,event,el);
        },false)
    },

    /**
     * @description: 返回当前节点所在的index
     * @param {element} 
     * @return: Number
     */
    index:function(element){
        let siblings = element.parentNode.children;
        for(let index=0;index<siblings.length;index++){
            if(siblings[index]===element){
                return index;
            }
        }
        return -1;
    },
    onSwipe:function(element,fn){
        let x0,y0;
        element.addEventListener('touchstart',(e)=>{
            x0 = e.touches[0].clientX;
            y0 = e.touches[0].clientY;
        });
        element.addEventListener('touchmove',(e)=>{
            if(!x0||!y0){
                return;
            }
            let xDiff = e.touches[0].clientX-x0;
            let yDiff = e.touches[0].clientY-y0;
            //横向
            if(Math.abs(xDiff)>Math.abs(yDiff)){
                if(xDiff>0){
                    fn.call(element,e,'right');
                }else{
                    fn.call(element,e,'left');
                }
            }else{
                if(yDiff>0){
                    fn.call(element,e,'down');
                }else{
                    fn.call(element,e,'up');
                }
            }
            x0 = undefined;
            y0 = undefined;
        })
    },
    /**
     * @description: 删除兄弟的class，给自己添加
     * @className {String} 
     * @return: element
     */
    uniqueClass:function(element,className){
        dom.every(element.parentNode.children,el=>{
            el.classList.remove(className);
        })
        element.classList.add(className);
        return element;
    },
    /**
     * @description: 遍历节点
     * @param {type} 
     * @return: elements
     */
    every:function(nodeList,fn){
        for(let i=0;i<nodeList.length;i++){
            fn.call(null,nodeList[i],i);
        }
        return nodeList;
    },
    /**
     * @description: 添加一组或者一个节点
     * @param {type} 
     * @return: 
     */
    append:function(parent,children){
        if(children.length===undefined){
            children = [children];
        }
        for(let i=0;i<children.length;i++){
            parent.appendChild(children[i])
        }
        return parent;
    },
    /**
     * @description: 字符串html中添加 节点
     * @html {String} 
     * @return: 
     */
    create:function(html,children){
        var template = document.createElement('template');
        template.innerHTML = html.trim();
        let node = template.content.firstChild;
        if(children){
            dom.append(node,children);
        }
        return node;
    },
    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    prepend:function(parent,children){
        if(children.length===undefined){
            children = [children];
        }
        for(let i=children.length-1;i>=0;i--){
            if(parent.firstChild){
                parent.insertBefore(children[i],parent.firstChild);
            }else{
                parent.appendChild(parent.firstChild);
            }
        }
        return parent;
    },
    removeChildren:function(element){
        while(element.hasChildNodes()){
            element.removeChild(element.lastChild);
        }
        return element;
    },
    dispatchEvent:function(element,eventType,detail){
        let event = new CustomEvent(eventType,{detail});
        element.dispatchEvent(event);
        return this;
    }
}