const $ = selector => document.querySelector(selector);

class Validator{
    constructor(config){
        this._validatorConfig = config.validatorConfig
        this._targetConfig    = config.targetConfig
        this._allTarget       = this._targetConfig.map(config => config.target)
    }
    run(target){
        const currentConfig = this._targetConfig.filter(item=>item.target==='#'+target)[0];
        this._check(currentConfig);
    }
    _check(config){
        const validatorConfig = this._validatorConfig;
        let $target = $(config.target);
        let value = $target.value;
        let $message = $(config.message.target);
        let validators = config.validators;
        let result = [];
        let required = false;
        validators.forEach((item,index)=>{
            if(item.name==="required") required = true;
            let temp = Validators[item.name](value,item.args);
            if(!temp.status){
                result.push(temp.message)
            }
        })
        if(!required&&value.length===0){
            return;
        }
        if(result.length>0){
            validatorConfig.error&&validatorConfig.error($target);
            $message.textContent = result[0];
        }else{
            validatorConfig.success&&validatorConfig.success($target);
            $message.textContent = config.message.success||'';
        }
    }
    runAll(){
        this._targetConfig.forEach((item)=>{
            this._check(item);
        })
    }
    reset(){
        this._targetConfig.forEach((item)=>{
            let $target = $(item.target);
            let $message = $(item.message.target);
            $target.value = '';
            $message.textContent = item.message.placeholder||'';
        })
        this._validatorConfig.reset(this._allTarget);
    }

}