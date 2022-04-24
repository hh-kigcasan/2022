class String{

    static explode_string(route,delimiter){
    
        let newArr = [];
        let word = "";
    
        for(let i = 0; i < route.length; i ++){
    
            if(route[i] == delimiter){
                newArr.push(word);
                word = "";
            }
            else if(i == route.length-1){
                word += route[i];
                newArr.push(word);
            }else{
                word += route[i];
            }
            
        }
    
        return newArr;
    }

    static stringify(arr,string_word = []){   
       

        for(let index in arr){
            
            if(arr[index] == '[object Object]'){
                string_word.push(this.stringify(arr[index],string_word));
            }else{
                string_word.push(arr[index]);
            }
            
        }
        
        return string_word;
    }

}

module.exports = String;
