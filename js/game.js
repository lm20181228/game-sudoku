var Game = function(){
    // 初始化配置
    // 分数
    this.score = 0;
    // 待渲染的数独数组
    this.sdArr=[];
    // 待渲染区域的元素id
    this.contentId = '';
    // 调用生成数独方法
    let create = new Create(this);
    // 调用难度系数选项方法
    create.renderSelect();
    // 调用难度系数选项选择事件方法
    this.selectChange = function(){
        create.selectChange();
    };
    /**
     * @description 画布初始化
     * @param {contentId} 数独画布渲染id
    */
    function init(contentId){
        this.contentId = contentId;
        // 初始化创建一个二维数据 9*9来进行画布渲染
        for(let i=0;i<9;i++){
            this.sdArr[i] = new Array(9).fill(0)
        }
        // 调用创建数独方法生成数独二维数组
        create.createSudu(this.contentId,this.sdArr)
    }
    /**
     * @description 用于渲染游戏区域
     * @param{contentId} 需要渲染的游戏区域的元素id
     * @param{Arr} 用于渲染游戏区域的数组对象
     * */ 
     function renderGame(Arr){
        this.sdArr = Arr;
        const content = document.getElementById(this.contentId);
        let str = '';
        for(let i=0;i<9;i++){
            str +=`<div class='canvas-row'>`
            for(let j=0;j<9;j++){
                if(Arr[i][j]){
                    str += `<span class='cell'>${Arr[i][j]}</span>`
                }else{
                    str += `<span class='cell cell${i}${j} cell-color' contenteditable="true" data='${i},${j}'>${Arr[i][j]}</span>`
                }
            }
            str +=`</div>`
            if((i+1)%3 == 0){
                str +=`<hr class="grap-hr"/>`
            }
        }
        content.innerHTML = str;
        editCell();
    }
    /**
     * @description 输入过程中，样式动态修改
    */
    function editCell(){
        document.getElementById("canvasContent").addEventListener("click", function(e) {
            // 检查事件源e.targe是否为A
            if(e.target && e.target.className.includes('cell-color')) {
                let elementData = e.target.getAttribute('data');
                // 获取到当前点击的行列坐标
                let row = elementData[0];
                let colum = elementData[2];
                // 现在需要做样式渲染
                let cellList = document.getElementsByClassName("cell");
                let cellBox = 0;
                for(let i=0;i<cellList.length;i++){
                    cellList[i].classList.remove("cell-item")
                    // 同行同列开始渲染颜色
                    if((i>=row*9 && i<(row*9+9)) || i%9 == colum){
                        cellList[i].classList.add("cell-item")
                    }
                    // 3*3格子开始渲染颜色
                    if(Math.floor(i/27) == Math.floor(row/3)){
                        if(Math.floor((i%9)/3)>=Math.floor(colum/3) && Math.floor((i%9)/3)<Math.floor(colum/3)+1){
                            cellList[i].classList.add("cell-item")
                        }
                    }
                }
            }
          });
    }
    /**
     * @description 游戏可编辑块输入内容捕捉,并进行空和正确输入内容校验
     * */ 
     function editable(className){
        // 获取所有填写的cell元素，组合数组元素
        let num = create.difficulty[create.difficultyType].nums;//提取难度对应的空缺位数
        let flag = true;
        for(i=0;i<num;i++){
            const editE = document.getElementsByClassName(className+create.hollowingArr[i].row+create.hollowingArr[i].colum)[0];
            if(editE.innerText){
                if(create.numArray.includes(editE.innerText)){
                    this.sdArr[create.hollowingArr[i].row][create.hollowingArr[i].colum] = editE.innerText;
                }else{
                    alert("请正确填写第"+(parseInt(create.hollowingArr[i].row)+1)+'行，第'+(parseInt(create.hollowingArr[i].colum)+1)+'列内容');
                    flag = false;
                    return false;
                }
            }else{
                alert("第"+(parseInt(create.hollowingArr[i].row)+1)+'行，第'+(parseInt(create.hollowingArr[i].colum)+1)+'列未填写');
                flag = false;
                return false;
            }
        }
        return flag;
    }
    /**
     * @description 用于检验是否是一个合法的数独数组
     * */ 
     function submitRule(Arr){
        let blockSet = {};
        let blockFlag =true;
        for(let i=0;i<9;i++){
            let columSet = new Set();
            let rowIndex = Math.floor(i/3)*3;
            for(let j=0;j<9;j++){
                let columnIndex = Math.floor(j/3)*3;
                columSet.add(Arr[i][j]);
                if(i%3 == 0 && j%3 == 0){
                    blockSet[rowIndex+''+columnIndex] = new Set();
                }
                blockSet[rowIndex+''+columnIndex].add(Arr[i][j]);
            }
            let rowSet = new Set(Arr[i]);
            if(rowSet.size<9 || columSet.size<9){
                return false;
            }
        }
        for(item in blockSet){
            if(item.size<9){
                blockFlag = false;
            }
        }
        return blockFlag
    }
    /**
     * @description 提交数独进行验证，验证数独是否为有效数独，判断是否通关。
     * */ 
    function submit(){
        // 填充完数组
        if(this.editable("cell")){
            // 校验数组
            if(submitRule(this.sdArr)){
                
                this.score+=Number(create.difficulty[create.difficultyType].nums) || 1;
                this.setScore();
                if(confirm("恭喜通关,是否继续挑战？")){
                    this.reStart();
                }else{
                    // 点击取消按钮
                }
            }else{
                alert("抱歉通关失败")
            };
        };
    }
    /**
     * @description 设置分数
     * */ 
    function setScore(){
        const scoreE = document.getElementsByClassName('score')[0];
        scoreE.innerText = this.score;
        
    }
    /**
     * @description 重新开始游戏
     * */ 
    function reStart(){
        this.sdArr=[];
        this.init(this.contentId);
    }
    // 导出API
    this.init = init;
    this.reStart = reStart;
    this.renderGame = renderGame;
    this.setScore = setScore;
    this.submit = submit;
    this.editable = editable;
}
