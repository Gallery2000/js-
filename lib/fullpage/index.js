class FullPage{
    constructor(options){
        const defaultOptions = {
            element:null,
            duration:'1s'
        }
        this.animation = false;
        this.options = Object.assign({},defaultOptions,options);
        this.currentIndex = 0;
        this.checkOptions().initHtml().bindEvent()
    }
    checkOptions(){
        if(!this.options.element){
            throw new Error('element is required');
        }
        return this;
    }
    initHtml(){
        const {element,duration} = this.options;
        element.style.overflow = 'hidden'
        dom.every(element.children,section=>{
            section.style.transition = `transform ${duration}`
        })
        return this;
    }
    bindEvent(){
        const {element} = this.options;
        element.addEventListener('wheel',(e)=>{
            let targetIndex = this.currentIndex+(e.deltaY>0?1:-1);
            this.goToSection(targetIndex).then(()=>{
                this.currentIndex = targetIndex;
            },()=>{})
        })
        dom.onSwipe(element,(e,dir)=>{
            console.log(dir)
            let targetIndex;
            if(dir==='down'){
                targetIndex = this.currentIndex-1;
            }else if(dir==='up'){
                targetIndex = this.currentIndex+1;
            }else{
                return
            }
            this.goToSection(targetIndex).then(()=>{
                this.currentIndex = targetIndex;
            },()=>{})
        })
    }
    goToSection(targetIndex){
        return new Promise((resolve,reject)=>{
            const {element} = this.options;
            if(this.animation){
                reject();
            }else if(targetIndex<0){
                reject();
            }else if(targetIndex>=element.children.length){
                reject();
            }else{
                console.log('123')
                this.animation = true;
                let that = this;
                element.children[0].addEventListener('transitionend',function callback(){
                    this.removeEventListener('transitionend',callback);
                    that.animation = false;
                    resolve();
                })
                dom.every(element.children,section=>{
                    section.style.transform = `translateY(-${targetIndex*100}%)`
                })
            }
        })
    }
}