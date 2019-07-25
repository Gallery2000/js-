class ImagePicker{
    constructor(options){
        const defaultOptions = {
            element:null,
            upload:{
                url:'',
                methods:'',
                inputName:''
            },
            parseResponse:null,
            fallbackImage:''
        }
        this.options = Object.assign({},defaultOptions,options);
        this.domRefs = {
            image:this.options.element.querySelector('img')
        }
        this.checkOptions().initHtml().bindEvents()
    }
    checkOptions(){
        const {element,upload:{url,methods,inputName}} = this.options;
        if(!element||!url||!methods||!inputName){
            throw new Error('some options is required');
        }
        return this;
    }
    initHtml(){
        const {element} = this.options;
        let fileInput = (this.domRefs.fileInput = dom.create('<input type="file"/>'));
        dom.append(element,fileInput);
        return this;
    }
    bindEvents(){
        this.domRefs.fileInput.addEventListener('change',(e)=>{
            let {upload} = this.options;
            let formData = new FormData();
            formData.append(upload.inputName,e.target.files[0]);
            this.willUpload();
            this.upload(formData);
        },false);
        // formData.append(upload.inputName)
    }
    //添加正在上传状态，禁用file
    willUpload(){
        this.options.element.classList.add('uploading');
        this.domRefs.fileInput.disabled = true;
    }

    upload(formData){
        console.log(formData,'formData')
        const {element,upload,parseResponse} = this.options;
        this.http(upload.methods,upload.url,formData).then((responseBody)=>{
            console.log(responseBody);
            const result = JSON.parse(responseBody);
            // this.willDownload();
            // this.didUpload(result.url);
            this.options.element.classList.remove('failedupload','faileddownload','uploading');
            this.options.element.classList.add('downloading');
            this.prefetch(result.url).then(()=>{
                this.didDownload(result.url);
            }).catch(()=>{
                this.failedDownload();
            })
        },()=>{
            this.failedUpload();
        })
    }
    prefetch(url){
        return new Promise((resolve,reject)=>{
            let img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
        })
    }
    //下载成功
    didDownload(url){
        let {element} = this.options;
        this.domRefs.image.src = url;
        this.domRefs.fileInput.disabled = false;
        element.classList.remove('downloading');
        dom.dispatchEvent(element,'uploadedImageLoaded');
    }
    //下载失败
    failedDownload(){
        const {element,fallbackImage} = this.options;
        this.domRefs.fileInput.disabled = false
        this.domRefs.fileInput.value = ''
        element.classList.remove('downloading').add('faileddownload');
        if(!fallbackImage){
            this.domRefs.image.src = fallbackImage;
        }
    }
    //上传失败
    failedUpload(formData) {
        const {element} = this.options;
        this.domRefs.fileInput.disabled = false
        this.domRefs.fileInput.value = ''
        element.classList.add('failedupload');
        dom.dispatchEvent(element, 'uploadFailed')
      }
    http(methods,url,data){
        return new Promise((resolve,reject)=>{
            let xhr = new XMLHttpRequest();
            xhr.open(methods,url);
            xhr.onload = ()=>{
                if(xhr.readyState===4&&xhr.status===200){
                    return resolve(xhr.responseText,xhr);
                }else{
                    return reject(xhr);
                }
            }
            xhr.onerror = (err)=>reject(xhr,err);
            xhr.send(data);
        })
    }
}
