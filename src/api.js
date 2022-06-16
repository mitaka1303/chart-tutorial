export async function fetchAllData(){
    //ファイルを取っている
    const response = await fetch(
        `https://assets.codepen.io/2004014/iris.json`
    );
    
    //編集できる形に変換
    const data = await response.json();
    
    return data;
}