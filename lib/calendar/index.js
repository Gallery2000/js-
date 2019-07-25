class Calendar{
    constructor(options){
        const defaultOptions = {
            element:null,
            startOfWeek:1,
            strings:{
                weekdays:n=>{
                    let map = { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' }
                    return map[n]
                },
                days: n => `${n}`,
                dayTemplate: `
                <li>
                  <span class="dayLabel">
                    <span class="day">%day%</span><span class="unit">日</span>
                  </span>
                </li>
              `,
                output: d => `${d.getFullYear()}年${d.getMonth() + 1}月`,
            },
        }
        this.options = Object.assign({},defaultOptions,options);
        this.currentDate = new Date();
        this.checkOptions()._generateCalendar()
    }
    checkOptions(){
        if(!this.options.element){
            throw new Error('element is required');
        }
        return this;
    }
    nextMonth(){
        this.currentDate = new Date2(this.currentDate).nextMonth.date;
        this._generateCalendar();
    }
    previousMonth(){
        this.currentDate = new Date2(this.currentDate).previousMonth.date;
        this._generateCalendar();
    }
    resetMonth(){
        this.currentDate = new Date();
        this._generateCalendar();
    }
    //_generateCalendar _generateWeekdays _generateDays _generatePreviousMonth _generateCurrentMonth _generateNextMonth
    _generateCalendar(){
        const {element,output,strings} = this.options;
        dom.removeChildren(element);
        dom.append(element,this._generateWeekdays());
        dom.append(element,this._generateDays());
        output.textContent = strings.output(this.currentDate);
    }
    _generateWeekdays(){
        const {startOfWeek,strings} = this.options;
        let items = createArray({length:7,value:startOfWeek}).map((day,index)=>{
            let weekday = day+index>=7?day+index-7:day+index;
            let weekdayText = strings.weekdays(weekday);
            let li  = dom.create('<li>'+weekdayText+'</li>');
            if([0,6].indexOf(weekday)>0){
                li.className = 'weekend';
            }
            return li;
        })
        let ol = dom.create('<ol class="weekdays"></ol>',items);
        return ol;
    }
    _generateDays(){
        let days = this._generateCurrentMonth();
        days  = this._generatePreviousMonth().concat(days);
        days  = days.concat(this._generateNextMonth())
        let ol = dom.create('<ol class="days"></ol>',days);
        return ol;
    }
    _generateCurrentMonth(){
        const {strings,startOfWeek} = this.options;
        const date2 = new Date2(this.currentDate);
        let days = date2.monthEnding.day();
        let items = createArray({length:days}).map((_,index)=>{
            let currentDay =date2.day(index+1) ;
            let li = dom.create(strings.dayTemplate.replace('%day%',currentDay.day()));
            li.className = 'currentMonth';
            if([0,6].indexOf(currentDay.weekday())>0){
                li.classList.add('weekend');
            }
            if(currentDay.isSameDayAs(new Date())){
                li.classList.add('today');
            }
            return li;
        })
        return items;
    }
    _generatePreviousMonth(){
        const {strings,startOfWeek} = this.options;
        const date2 = new Date2(this.currentDate);
        let monthBeginning = date2.monthBeginning;
        let days = monthBeginning.weekday()>=startOfWeek?monthBeginning.weekday()-startOfWeek:7+monthBeginning.weekday()-startOfWeek;
        let items = createArray({length:days}).map((_,index)=>{
            let currentDay = date2.day(-index);
            let li = dom.create(strings.dayTemplate.replace('%day%',currentDay.day()));
            li.className = 'previousMonth';
            if([0,6].indexOf(currentDay.weekday())>0){
                li.classList.add('weekend');
            }
            return li;
        }).reverse();
        return items;
    }
    _generateNextMonth(){
        const {strings,startOfWeek} = this.options;
        const date2 = new Date2(this.currentDate);
        let monthEnding = date2.monthEnding;
        //7-(2-2+1)
        //7 - (1+7-2+1)
        let days = monthEnding.weekday()>=startOfWeek?7-(monthEnding.weekday()-startOfWeek+1):7-(monthEnding.weekday()+7-startOfWeek+1);
        let items = createArray({length:days}).map((_,index)=>{
            let currentDay = date2.nextMonth.day(index+1);
            let li = dom.create(strings.dayTemplate.replace('%day%',currentDay.day()));
            li.className = 'nextMonth';
            if([0,6].indexOf(currentDay.weekday())>0){
                li.classList.add('weekend');
            }
            return li;
        })
        return items;
    }
}
function createArray({length,value}){
    let array = Array.apply(null,{length});
    if(value){
        array = array.map(()=>value);
    }
    return array;
}