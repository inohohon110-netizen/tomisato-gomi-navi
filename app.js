let model;

let garbageData = [];

let currentKana = "";
let currentKubun = "";
let displayLimit = 50;
let currentResults = [];



async function loadModel(){

  document.getElementById("aiResult").innerHTML =
    "AIモデル読込中...";

  model = await mobilenet.load();

  document.getElementById("aiResult").innerHTML =
    "AI準備完了";
}



// --------------------
// JSON読込
// --------------------

fetch("gomi.json")
.then(response => response.json())
.then(data => {

    garbageData = data;

    console.log(
        "読込件数:",
        garbageData.length
    );

    document
    .getElementById("count")
    .innerHTML =
    `登録品目数：${garbageData.length}件`;

    updateGojuonCounts();

});

// --------------------
// 検索イベント
// --------------------

document
.getElementById("searchBox")
.addEventListener("input", searchItem);

// --------------------
// 通常検索
// --------------------

function searchItem(){

    displayLimit = 50;

    currentKana = "";
    currentKubun = "";

    const word =
        document
        .getElementById("searchBox")
        .value
        .trim()
        .toLowerCase();

    const results =
        garbageData
        .filter(item => {

            return (

                item.name
                    .toLowerCase()
                    .includes(word)

                ||

                item.yomi
                    .toLowerCase()
                    .includes(word)

            );

        })
        .sort((a,b) => {

            const yomiA =
                a.yomi || a.name;

            const yomiB =
                b.yomi || b.name;

            return yomiA.localeCompare(
                yomiB,
                "ja"
            );

        });

    if(word === ""){

        document
        .getElementById("resultCount")
        .innerHTML = "";

    }
    else{

        document
        .getElementById("resultCount")
        .innerHTML =
        `検索結果：${results.length}件`;

    }


    currentResults = results;

    displayResults(results);

}

// --------------------
// 五十音ボタン検索
// --------------------

function setKana(kana){

clearActiveButtons();

    currentKana = kana;

   // 以前の選択状態を解除

    document
    .querySelectorAll("#gojuon button")
    .forEach(btn => {

        btn.classList.remove(
            "activeKana"
        );

    });

     

    document
    .getElementById("searchBox")
    .value = kana;

    const results =
        garbageData
        .filter(item => {

const yomi =
    item.yomi || "";

const kanaMap = {

    "あ":["あ","い","う","え","お"],
    "か":["か","き","く","け","こ"],
    "さ":["さ","し","す","せ","そ"],
    "た":["た","ち","つ","て","と"],
    "な":["な","に","ぬ","ね","の"],
    "は":["は","ひ","ふ","へ","ほ"],
    "ま":["ま","み","む","め","も"],
    "や":["や","ゆ","よ"],
    "ら":["ら","り","る","れ","ろ"],
    "わ":["わ","を","ん"]

};

return kanaMap[currentKana]
    .includes(yomi);








})



        .sort((a,b) => {

            const yomiA =
                a.yomi || a.name;

            const yomiB =
                b.yomi || b.name;

            return yomiA.localeCompare(
                yomiB,
                "ja"
            );

        });

    document
    .getElementById("resultCount")
    .innerHTML =
    `${kana}行：${results.length}件`;

    currentResults = results;

    displayResults(results);

    // 今押したボタンだけ緑にする

    const btn =
        document.getElementById(
            "btn-" + kana
        );

    if(btn){

        btn.classList.add(
            "activeKana"
        );

    }

}



// --------------------
// 結果表示共通処理
// --------------------

function displayResults(results){

    let html = "";

    results
.slice(0,displayLimit)
.forEach(item => {






        let colorClass = "moeru";

        if(
            item.kubun &&
            item.kubun.includes("燃えない")
        ){
            colorClass = "moenai";
        }
        else if(
            item.kubun &&
            item.kubun.includes("資源")
        ){
            colorClass = "shigen";
        }
        else if(
            item.kubun &&
            item.kubun.includes("粗大")
        ){
            colorClass = "sodai";
        }

      html += `
<div class="card">

    <div
    class="cardTitle"
    onclick="toggleCard(this)">







        ▶ ${item.name}

    </div>

    <div class="cardBody">



        <div class="badge ${colorClass}">
            ${item.kubun}
        </div>

        <div class="info">
            <span class="label">
            種類
            </span>
            
            ${item.type}
        </div>

        <div class="info">
            <span class="label">
            区分品目
            </span>
            
            ${item.hinmoku}
        </div>

        <div class="info">
            <span class="label">
            出し方
            </span>
            
            ${item.method}
        </div>

        <div class="info">
            <span class="label">
            持込先
            </span>
            
            ${item.carry}
        </div>

    </div>

</div>

`;








    });

    if(
        results.length === 0
    ){

        html = `

        <div class="card">

            該当する品目がありません

        </div>

        `;

    }

if(results.length > displayLimit){

    html += `

    <div style="text-align:center;margin-top:20px;">

        <button
        onclick="showMore()">

        もっと見る

        </button>

    </div>

    `;

}



    document
    .getElementById("result")
    .innerHTML = html;

}


function filterKubun(kubun){

    currentKubun = kubun;

    let results = garbageData;

    // 五十音フィルター

if(currentKana !== ""){

    const kanaMap = {

        "あ":["あ","い","う","え","お"],

        "か":["か","き","く","け","こ"],

        "さ":["さ","し","す","せ","そ"],

        "た":["た","ち","つ","て","と"],

        "な":["な","に","ぬ","ね","の"],

        "は":["は","ひ","ふ","へ","ほ"],

        "ま":["ま","み","む","め","も"],

        "や":["や","ゆ","よ"],

        "ら":["ら","り","る","れ","ろ"],

        "わ":["わ","を","ん"]

    };

    results =
        results.filter(item => {

            const yomi =
                item.yomi || "";

            return kanaMap[currentKana]
                .includes(yomi);

        });

}


    

    // 区分フィルター

    if(kubun !== ""){

        results =
            results.filter(item => {

                return (
                    item.kubun === kubun
                );

            });

    }

    results.sort((a,b) => {

        const yomiA =
            a.yomi || a.name;

        const yomiB =
            b.yomi || b.name;

        return yomiA.localeCompare(
            yomiB,
            "ja"
        );

    });

    let title = "";

    if(currentKana !== ""){

        title +=
            currentKana + "行 ";

    }

    if(kubun !== ""){

        title += kubun;

    }
    else{

        title += "全区分";

    }

 document
.getElementById("resultCount")
.innerHTML =
`${title}：${results.length}件`;

currentResults = results;

displayResults(results);

// フィルターボタンの選択表示

document
.querySelectorAll(
    "#filterButtons button"
)
.forEach(btn => {

    btn.classList.remove(
        "activeFilter"
    );

});

let filterId = "btn-all";

if(kubun === "燃えるごみ"){
    filterId = "btn-burn";
}
else if(kubun === "燃えないごみ"){
    filterId = "btn-nonburn";
}
else if(kubun === "資源物"){
    filterId = "btn-resource";
}
else if(kubun === "粗大ごみ"){
    filterId = "btn-bulky";
}

document
.getElementById(filterId)
.classList.add(
    "activeFilter"
);

}








function updateGojuonCounts(){

    const kanaList = [
        "あ","か","さ","た","な",
        "は","ま","や","ら","わ"
    ];

    kanaList.forEach(kana => {

 const kanaMap = {

    "あ":["あ","い","う","え","お"],

    "か":["か","き","く","け","こ"],

    "さ":["さ","し","す","せ","そ"],

    "た":["た","ち","つ","て","と"],

    "な":["な","に","ぬ","ね","の"],

    "は":["は","ひ","ふ","へ","ほ"],

    "ま":["ま","み","む","め","も"],

    "や":["や","ゆ","よ"],

    "ら":["ら","り","る","れ","ろ"],

    "わ":["わ","を","ん"]

};

const count = garbageData.filter(item => {

    const yomi =
        item.yomi || "";

    return kanaMap[kana].includes(yomi);

}).length;      




        const btn =
            document.getElementById(
                "btn-" + kana
            );

        if(btn){

            btn.innerHTML =
`${kana}行<br>(${count})`;

        }

    });

}

function clearActiveButtons(){

    document
    .querySelectorAll("#gojuon button")
    .forEach(btn => {

        btn.classList.remove(
            "activeKana"
        );

    });

    document
    .querySelectorAll(
        "#filterButtons button"
    )
    .forEach(btn => {

        btn.classList.remove(
            "activeFilter"
        );

    });

}

function clearFilter(){

    displayLimit = 50;

    currentKana = "";
    currentKubun = "";





    document
    .getElementById("searchBox")
    .value = "";

    document
    .getElementById("resultCount")
    .innerHTML = "";

    document
    .querySelectorAll("#gojuon button")
    .forEach(btn => {

        btn.classList.remove(
            "activeKana"
        );

    });

    document
    .querySelectorAll(
        "#filterButtons button"
    )
    .forEach(btn => {

        btn.classList.remove(
            "activeFilter"
        );

    });

    const results =
        [...garbageData]
        .sort((a,b)=>{

            const yomiA =
                a.yomi || a.name;

            const yomiB =
                b.yomi || b.name;

            return yomiA.localeCompare(
                yomiB,
                "ja"
            );

        });

    displayResults(results);

}

function showMore(){

    displayLimit += 50;

    displayResults(
        currentResults
    );

}


function goTop(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

function toggleCard(title){

    const body =
        title.nextElementSibling;

    // 他を閉じる

    document
    .querySelectorAll(".cardBody")
    .forEach(item => {

        if(item !== body){

            item.classList.remove(
                "open"
            );

        }

    });

    document
    .querySelectorAll(".cardTitle")
    .forEach(item => {

        item.innerHTML =
            item.innerHTML
            .replace("▼","▶");

    });

    // 開閉

    if(
        body.classList.contains(
            "open"
        )
    ){

        body.classList.remove(
            "open"
        );

        title.innerHTML =
            title.innerHTML
            .replace("▼","▶");

    }
    else{

        body.classList.add(
            "open"
        );

        title.innerHTML =
            title.innerHTML
            .replace("▶","▼");

    }

}





document.addEventListener("DOMContentLoaded", () => {

  const cameraInput =
    document.getElementById("cameraInput");

  const preview =
    document.getElementById("preview");

  if(!cameraInput || !preview){
    console.log("cameraInput または preview が見つかりません");
    return;
  }

  cameraInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if(!file) return;

    preview.src =
      URL.createObjectURL(file);

    preview.style.display = "block";
  });

});



/* 一番最後に追加 */
document.addEventListener("DOMContentLoaded", () => {
    loadModel();
});

async function analyzeImage(){

  const preview =
    document.getElementById("preview");

  if(!preview.src){

    alert("写真を選択してください");
    return;
  }

  const predictions =
    await model.classify(preview);


  const result =
    predictions[0].className
    .split(",")[0]
    .trim();

let candidateHtml =
  "<h3>🔍 AI候補 TOP5</h3>";

predictions.forEach((p, index) => {

  const name =
    p.className.split(",")[0].trim();

  const percent =
    Math.round(p.probability * 100);

  candidateHtml +=
    `${index + 1}位：${name} (${percent}%)<br>`;
});

document.getElementById("aiKubun")
.innerHTML = candidateHtml;






  const itemMap = {

  "water bottle":"ペットボトル",
  "bottle":"びん",
  "beer bottle":"びん",

  "can":"缶",
  "soda can":"缶",

  "newspaper":"新聞紙",
  "book":"本",
  "carton":"紙パック",
  "cardboard":"段ボール",

  "plastic bag":"レジ袋",

  "remote control":"リモコン",
  "keyboard":"キーボード",
  "mouse":"マウス",

  "cellular telephone":"携帯電話",
  "mobile phone":"携帯電話",

  "vacuum":"掃除機",
  "hair dryer":"ドライヤー",
  "fan":"扇風機",

  "television":"テレビ",

  "battery":"乾電池"
};





const jpName =
  itemMap[result] || result;

document
  .getElementById("aiResult")
  .innerHTML =
  "AI判定：" + jpName;


/* AIおすすめ表示 */
const exact =
  garbageData.find(
    item => item.name === jpName
  );

if(exact){

  let top5Html =
    "<h3>🔍 AI候補 TOP5</h3>";

  predictions.forEach((p, index) => {

    const enName =
      p.className.split(",")[0].trim();

    const jpCandidate =
      itemMap[enName] || enName;

    const percent =
      Math.round(p.probability * 100);

    top5Html += `
<button
  class="aiCandidateBtn"
  onclick="selectAIItem('${jpCandidate}')">

  ${index + 1}位：
  ${jpCandidate}
  (${percent}%)

</button><br>
`;
  
  });   // ←これを追加
  
  
  
  document
    .getElementById("aiKubun")
    .innerHTML = `
      <div class="aiRecommend">

        <h3>✅ AIおすすめ</h3>

        <p><b>品目：</b>${exact.name}</p>

        <p><b>区分：</b>${exact.kubun}</p>

        <p><b>出し方：</b>${exact.method}</p>

        <hr>

        ${top5Html}

      </div>
    `;

}
else{

  document
    .getElementById("aiKubun")
    .innerHTML = "";

}




  
  document
    .getElementById("searchBox")
    .value =
    jpName;

  document
    .getElementById("searchBox")
    .dispatchEvent(
      new Event("input")
    );

}

function selectAIItem(name){

  document
    .getElementById("searchBox")
    .value = name;

  document
    .getElementById("searchBox")
    .dispatchEvent(
      new Event("input")
    );

}

