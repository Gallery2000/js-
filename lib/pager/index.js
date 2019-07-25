class Pager{
    constructor(options){
        let defaultOptions = {
            element:null,
            buttonCount:10,
            currentPage:1,
            totalPage:10,
            template:{
                number:'<span>%page%</span>',
                prev:'<button>上一页</button>',
                next:'<button>下一页</button>',
                first:'<button>首页</button>',
                last:'<button>尾页</button>'
            }
        }
        this.domRefs = {};
        this.options = Object.assign({},defaultOptions,options);
        this.currentPage = parseInt(this.options.currentPage,10)||1;
        this.optionsCheck().initHtml().bindEvents();
    }
    bindEvents(){
        dom.on(this.options.element,'click','.pageNumbers>li',(e,el)=>{
            this.goToPage(parseInt(el.dataset.page));
        })
        this.domRefs.first.addEventListener('click',()=>{
            this.goToPage(1);
        },false);
        this.domRefs.last.addEventListener('click',()=>{
            this.goToPage(this.options.totalPage);
        },false);
        this.domRefs.prev.addEventListener('click',()=>{
            this.goToPage(this.currentPage-1);
        },false);
        this.domRefs.next.addEventListener('click',()=>{
            this.goToPage(this.currentPage+1);
        },false);
    }
    goToPage(page){
        if(!page||page===this.currentPage||page>this.options.totalPage){
            return;
        }
        this.currentPage = page;
        this.options.element.dispatchEvent(new CustomEvent('pageChange',{detail:page}));
        this.rerender();
    }
    optionsCheck(){
        if(!this.options.element){
            throw new Error('element is required');
        }
        return this;
    }
    rerender(){
        this.checkButton();
        let newNumbers = this.createNumber()
        let oldNumbers = this.domRefs.numbers;
        oldNumbers.parentNode.replaceChild(newNumbers,oldNumbers);
        this.domRefs.numbers = newNumbers;
    }
    initHtml(){
        let pager = (this.domRefs.pager  = dom.create('<div class="pager-wrapper"></div>'));
        this.domRefs.next = dom.create(this.options.template.next);
        this.domRefs.prev = dom.create(this.options.template.prev);
        this.domRefs.first = dom.create(this.options.template.first);
        this.domRefs.last = dom.create(this.options.template.last);
        this.checkButton();
        this.domRefs.numbers = this.createNumber();
        dom.append(pager,this.domRefs.first);
        dom.append(pager,this.domRefs.prev);
        dom.append(pager,this.domRefs.numbers);
        dom.append(pager,this.domRefs.next);
        dom.append(pager,this.domRefs.last);
        dom.append(this.options.element,pager);
        return this;
    }
    checkButton(){
        if(this.currentPage===1){
            this.domRefs.first.setAttribute('disabled','');
            this.domRefs.prev.setAttribute('disabled','');
        }else{
            this.domRefs.first.removeAttribute('disabled');
            this.domRefs.prev.removeAttribute('disabled');  
        }
        if(this.currentPage===this.options.totalPage){
            this.domRefs.last.setAttribute('disabled','');
            this.domRefs.next.setAttribute('disabled','');
        }else{
            this.domRefs.last.removeAttribute('disabled');
            this.domRefs.next.removeAttribute('disabled');  
        }
    }
    createNumber(){
        const {totalPage,buttonCount} = this.options;
        const currentPage = this.currentPage;

        let start1 = Math.max(currentPage-Math.round(buttonCount/2),1);
        let end1 = Math.min(start1+buttonCount-1,totalPage);
        let end2 = Math.min(currentPage+Math.round(buttonCount/2)-1,totalPage);
        let start2 = Math.max(end2-buttonCount+1,1);
        let start = Math.min(start1,start2);
        let end = Math.max(end1,end2);
        let pageNumbers = dom.create('<div class="pageNumbers"></div>');
        for(let i=start;i<=end;i++){
            let li = dom.create(`<li data-page="${i}">${this.options.template.number.replace('%page%',i)}</li>`);
            if(i===currentPage){
                li.classList.add('current');
            }
            dom.append(pageNumbers,li);
        }
        return pageNumbers;
    }
}