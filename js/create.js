var Create = function(game,difficultyOptions){
     // 待填充的数字数组
     this.numArray = ['1','2','3','4','5','6','7','8','9'];
     // 默认难度系数
    this.difficulty = difficultyOptions || {
        simple:{
            nums:4,
            name:'简单',
            type:"simple",
            score:1,
        },
        intermediate:{
            nums:6,
            name:'中等',
            type:"intermediate",
            score:2,
        },
        difficulty:{
            nums:8,
            name:'困难一级',
            type:"difficulty",
            score:3,
        },
        superDifficulty:{
            nums:10,
            name:'困难二级',
            type:"superDifficulty",
            score:5,
        },
    }
    // 数独二维数组
    this.sdArr = [];
    // 待挖空位置的数组集合
    this.hollowingArr = [];
    // 默认难度系数
    this.difficultyType='simple';
     /**
     * @description 生成数独数组时需要判断数独的合理性，一行不能出现重复数字，一列不能出现重复数字,一个3*3方格不能出现重复的数字
    */
    this.rule = function(number,row,column){
        // 一列
        for(let i=0;i<9;i++){
           if( this.sdArr[i][column] == number || this.sdArr[row][i] == number){
            return false;
           }
        }
        // 一个3*3
        let rowStart = Math.floor(row/3)*3;
        let cloumStart = Math.floor(column/3)*3;
        let rowS = row%3;
        if(rowS != 0){
            for(let i=0;i<3;i++){
                for(let j=0;j<3;j++){
                    if(this.sdArr[rowStart+i][cloumStart+j] == number){
                        return false
                    }
                }
            }
        }
        return true;
    }
     /**
     * @description 进行游戏挖空，根据选定难度来
     * */ 
    this.hollowing = function (contentId,Arr){
        let num = this.difficulty[this.difficultyType].nums;//提取难度对应的空缺位数
        while(num>0){
            // 取随机数
            let row =  Math.floor(Math.random()*9)
            let colum = Math.floor(Math.random()*9)
            if(this.hollowingArr.length == 0){
                this.hollowingArr.push({row,colum});
                Arr[row][colum] = ''
                num--;
            }else{
                let hasRow = this.hollowingArr.some((item)=>{
                    return item.row == row && item.colum == colum
                });
                if(!hasRow){
                    this.hollowingArr.push({row,colum});
                    Arr[row][colum] = ''
                    num--;
                }
            }
        }
        game.renderGame(Arr);
    }
}
// 导出API
/**
 * @description 创建数独二维数组方法.是最重要的一个方法,内部算法可能还需要优化.
 * @param {contentId} 数独画布渲染id
 * @param {sdArr} 初始化生成的数独二维数组
 * */ 
Create.prototype.createSudu = function createSudu(contentId,sdArr){
    this.sdArr = sdArr;
    // 创建数独二维数组
    // 数独规则，每一行，每一列数字不能重复（1-9）。每一个3*3的正方形格子中，数字不能重复（1-9）
    for(let row=0;row<9;row++){
        let column = 0;
        let numArr = [...this.numArray];
        let newObj = new Map();
        while(column<9){
            if(column == 0){
                newObj = new Map();
            }
            let cellItem = Math.floor(Math.random()*numArr.length);
            newObj[column]?'':newObj[column] = new Set();
            newObj[column].add(numArr[cellItem])
            if(!this.rule(numArr[cellItem],row,column)){ 
                if(numArr.length == newObj[column].size){
                    // 表示陷入死循环中,需要重新开始计算这一对数据
                    numArr =  [...this.numArray];
                    column=0;
                    this.sdArr[row] = new Array(9).fill(0)
                }
            }else{
                this.sdArr[row][column] = numArr[cellItem];
                numArr.splice(cellItem,1)
                column++;
            }
        }
    }
    this.hollowing(contentId,this.sdArr);
 };
/**
 * @description 渲染选择下拉
 * */ 
 Create.prototype.renderSelect = function renderSelect(){
    let str='';
    for(item in this.difficulty){
        str+=`<option value="${this.difficulty[item].type}">${this.difficulty[item].name}</option>`;
    }
    const selectBox = document.getElementById('select');
    selectBox.innerHTML = str;
}
/**
 * @description 下拉选着事件
 * */ 
Create.prototype.selectChange = function selectChange(e){
    const selectBox = document.getElementById('select');
    var index = selectBox.selectedIndex; // 选中索引
    this.difficultyType = selectBox.options[index].value; // 选中值
}
