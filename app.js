let model = null;

let garbageData = [];

let currentKana = "";
let currentKubun = "";
let displayLimit = 50;
let currentResults = [];

let searchHistory = [];








function searchGarbage(keyword){

    if(!keyword) return;

   const normalizedKeyword =
    normalizeText(keyword);

const results = garbageData.filter(item => {

    const normalizedName =
        normalizeText(item.name);

    return normalizedName.includes(
        normalizedKeyword
    );

});

results.sort((a, b) => {

    const aName =
        normalizeText(a.name);

    const bName =
        normalizeText(b.name);

    const aStarts =
        aName.startsWith(normalizedKeyword);

    const bStarts =
        bName.startsWith(normalizedKeyword);

    if (aStarts && !bStarts) return -1;

    if (!aStarts && bStarts) return 1;

    return aName.length - bName.length;

});

results.sort((a, b) => {

    const aName =
        normalizeText(a.name);

    const bName =
        normalizeText(b.name);

    const aStarts =
        aName.startsWith(normalizedKeyword);

    const bStarts =
        bName.startsWith(normalizedKeyword);

    if (aStarts && !bStarts) return -1;

    if (!aStarts && bStarts) return 1;

    return aName.length - bName.length;

});

    currentResults = results;

    displayResults(results);
}





async function loadModel() {

    document.getElementById("aiResult").innerHTML =
        "AIモデル読込中...";

    model = await mobilenet.load();

    document.getElementById("aiResult").innerHTML =
        "AI準備完了";
}

// 検索欄へ反映
const searchInput =
    document.getElementById("searchInput");

if (searchInput) {
    searchInput.value = name;
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
// 文字正規化
// --------------------

function normalizeText(str){

    let text = str.toLowerCase();

    const searchAlias = {

        "pet":"ペット",
        "bottle":"ボトル",
        "plastic":"プラスチック",

        "can":"缶",
        "glass":"コップ",
        "cup":"コップ",

        "paper":"紙",
        "newspaper":"新聞",
        "magazine":"雑誌",

        "battery":"電池",

        "spray":"スプレー",
        "lighter":"ライター",

        "umbrella":"傘",

        "vinyl":"ビニール"

    };

    Object.keys(searchAlias).forEach(key => {

        text = text.replaceAll(
            key,
            searchAlias[key]
        );

    });

    return text
        .replace(/[ァ-ヶ]/g, s =>
            String.fromCharCode(
                s.charCodeAt(0) - 0x60
            )
        );

}

function updateHistory(){

    const area =
        document.getElementById("searchHistory");

    let html =
    `
    <h4>🕒 最近の検索</h4>
    
    <button onclick="clearHistory()">
    🔄 画面リセット
</button>
    
    
    <br><br>
    `;

if(searchHistory.length === 0){

    html += "履歴なし";

}



    searchHistory.forEach(word => {

        html += `
        <button
            onclick="selectHistory('${word}')">
            ${word}
        </button>
        `;

    });

    area.innerHTML = html;

}


function selectHistory(word){

    document.getElementById("searchBox").value =
        word;

    searchItem();

}

function clearHistory(){

    searchHistory = [];

    updateHistory();

    currentResults = [];

    displayResults([]);

    document.getElementById("resultCount")
        .innerHTML = "";

    document.getElementById("searchBox")
        .value = "";

}


// --------------------
// 通常検索
// --------------------

function searchItem() {

    displayLimit = 50;

    currentKana = "";
    currentKubun = "";

    const word =
    normalizeText(
        document
            .getElementById("searchBox")
            .value
            .trim()
    );

if(word){

    searchHistory =
        searchHistory.filter(
            item => item !== word
        );

    searchHistory.unshift(word);

    searchHistory =
        searchHistory.slice(0, 10);

    updateHistory();

}







const results =
    garbageData.filter(item => {

        return (

            normalizeText(item.name)
                .includes(word)

            ||

            normalizeText(item.yomi)
                .includes(word)

        );

    });
               
            results.sort((a, b) => {

                const yomiA =
                    a.yomi || a.name;

                const yomiB =
                    b.yomi || b.name;

                return yomiA.localeCompare(
                    yomiB,
                    "ja"
                );

            });

    if (word === "") {

        document
            .getElementById("resultCount")
            .innerHTML = "";

    }
    else {

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

function setKana(kana) {

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

                    "あ": ["あ", "い", "う", "え", "お"],
                    "か": ["か", "き", "く", "け", "こ"],
                    "さ": ["さ", "し", "す", "せ", "そ"],
                    "た": ["た", "ち", "つ", "て", "と"],
                    "な": ["な", "に", "ぬ", "ね", "の"],
                    "は": ["は", "ひ", "ふ", "へ", "ほ"],
                    "ま": ["ま", "み", "む", "め", "も"],
                    "や": ["や", "ゆ", "よ"],
                    "ら": ["ら", "り", "る", "れ", "ろ"],
                    "わ": ["わ", "を", "ん"]

                };

                return kanaMap[currentKana]
                    .includes(yomi);








            })



            .sort((a, b) => {

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

    if (btn) {

        btn.classList.add(
            "activeKana"
        );

    }

}



// --------------------
// 結果表示共通処理
// --------------------

function displayResults(results) {

    let html = "";

    results
        .slice(0, displayLimit)
        .forEach(item => {






            let colorClass = "moeru";

            if (
                item.kubun &&
                item.kubun.includes("燃えない")
            ) {
                colorClass = "moenai";
            }
            else if (
                item.kubun &&
                item.kubun.includes("資源")
            ) {
                colorClass = "shigen";
            }
            else if (
                item.kubun &&
                item.kubun.includes("粗大")
            ) {
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

    if (
        results.length === 0
    ) {

        html = `

        <div class="card">

            該当する品目がありません

        </div>

        `;

    }

    if (results.length > displayLimit) {

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


function filterKubun(kubun) {

    currentKubun = kubun;

    let results = garbageData;

    // 五十音フィルター

    if (currentKana !== "") {

        const kanaMap = {

            "あ": ["あ", "い", "う", "え", "お"],

            "か": ["か", "き", "く", "け", "こ"],

            "さ": ["さ", "し", "す", "せ", "そ"],

            "た": ["た", "ち", "つ", "て", "と"],

            "な": ["な", "に", "ぬ", "ね", "の"],

            "は": ["は", "ひ", "ふ", "へ", "ほ"],

            "ま": ["ま", "み", "む", "め", "も"],

            "や": ["や", "ゆ", "よ"],

            "ら": ["ら", "り", "る", "れ", "ろ"],

            "わ": ["わ", "を", "ん"]

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

    if (kubun !== "") {

        results =
            results.filter(item => {

                return (
                    item.kubun === kubun
                );

            });

    }

    results.sort((a, b) => {

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

    if (currentKana !== "") {

        title +=
            currentKana + "行 ";

    }

    if (kubun !== "") {

        title += kubun;

    }
    else {

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

    if (kubun === "燃えるごみ") {
        filterId = "btn-burn";
    }
    else if (kubun === "燃えないごみ") {
        filterId = "btn-nonburn";
    }
    else if (kubun === "資源物") {
        filterId = "btn-resource";
    }
    else if (kubun === "粗大ごみ") {
        filterId = "btn-bulky";
    }

    document
        .getElementById(filterId)
        .classList.add(
            "activeFilter"
        );

}








function updateGojuonCounts() {

    const kanaList = [
        "あ", "か", "さ", "た", "な",
        "は", "ま", "や", "ら", "わ"
    ];

    kanaList.forEach(kana => {

        const kanaMap = {

            "あ": ["あ", "い", "う", "え", "お"],

            "か": ["か", "き", "く", "け", "こ"],

            "さ": ["さ", "し", "す", "せ", "そ"],

            "た": ["た", "ち", "つ", "て", "と"],

            "な": ["な", "に", "ぬ", "ね", "の"],

            "は": ["は", "ひ", "ふ", "へ", "ほ"],

            "ま": ["ま", "み", "む", "め", "も"],

            "や": ["や", "ゆ", "よ"],

            "ら": ["ら", "り", "る", "れ", "ろ"],

            "わ": ["わ", "を", "ん"]

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

        if (btn) {

            btn.innerHTML =
                `${kana}行<br>(${count})`;

        }

    });

}

function clearActiveButtons() {

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

function clearFilter() {

    displayLimit = 50;

    currentKana = "";
    currentKubun = "";

    // 検索欄クリア
    document.getElementById("searchBox").value = "";

    // 件数クリア
    document.getElementById("resultCount").innerHTML = "";

    // AI結果クリア
    document.getElementById("aiResult").innerHTML = "";
    document.getElementById("aiKubun").innerHTML = "";

    // 画像クリア
    document.getElementById("preview").src = "";
    document.getElementById("preview").style.display = "none";

    // ファイル選択クリア
    document.getElementById("cameraInput").value = "";

    // 五十音選択解除
    document
        .querySelectorAll("#gojuon button")
        .forEach(btn => {
            btn.classList.remove("activeKana");
        });

    // 区分選択解除
    document
        .querySelectorAll("#filterButtons button")
        .forEach(btn => {
            btn.classList.remove("activeFilter");
        });

    // 検索結果クリア
    displayResults([]);
}



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
        .sort((a, b) => {

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



function showMore() {

    displayLimit += 50;

    displayResults(
        currentResults
    );

}


function goTop() {

    const resultArea =
        document.getElementById("result");

    if (resultArea) {
        resultArea.scrollIntoView({
            behavior: "smooth"
        });
    }

}





    function toggleCard(title) {

        const body =
            title.nextElementSibling;

        // 他を閉じる

        document
            .querySelectorAll(".cardBody")
            .forEach(item => {

                if (item !== body) {

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
                        .replace("▼", "▶");

            });

        // 開閉

        if (
            body.classList.contains(
                "open"
            )
        ) {

            body.classList.remove(
                "open"
            );

            title.innerHTML =
                title.innerHTML
                    .replace("▼", "▶");

        }
        else {

            body.classList.add(
                "open"
            );

            title.innerHTML =
                title.innerHTML
                    .replace("▶", "▼");

        }

    }





    document.addEventListener("DOMContentLoaded", () => {

        const cameraInput =
            document.getElementById("cameraInput");

        const preview =
            document.getElementById("preview");

        if (!cameraInput || !preview) {
            console.log("cameraInput または preview が見つかりません");
            return;
        }

        cameraInput.addEventListener("change", (e) => {

            const file = e.target.files[0];

            if (!file) return;

            preview.src =
                URL.createObjectURL(file);

            preview.style.display = "block";
        });

    });



    /* 一番最後に追加 */
    document.addEventListener("DOMContentLoaded", () => {
        loadModel();
    });

    async function analyzeImage() {



        const preview =
            document.getElementById("preview");





        if (!preview.src) {


            return;
        }





        const predictions =
            await model.classify(preview);







        const itemMap = {



            // =====================
            // アルミ缶へ統合
            // =====================

            "beer can": "アルミ缶",
            "aluminum can": "アルミ缶",
            "soda can": "アルミ缶",
            "drink can": "アルミ缶",

            "oil filter": "アルミ缶",
            "fuel filter": "アルミ缶",
            "air filter": "アルミ缶",
            "cartridge": "アルミ缶",

            "metal cylinder": "アルミ缶",
            "cylinder": "アルミ缶",

            "measuring cup": "アルミ缶",
            "beaker": "アルミ缶",

            // =====================
            // スチール缶
            // =====================

            "tin can": "スチール缶",
            "steel can": "スチール缶",
            "metal can": "スチール缶",

            // =====================
            // ペットボトルへ統合
            // =====================

            "water bottle": "ペットボトル",
            "plastic bottle": "ペットボトル",
            "sports bottle": "ペットボトル",
            "drink bottle": "ペットボトル",

            "water jug": "ペットボトル",
            "jug": "ペットボトル",
            "pitcher": "ペットボトル",
            "carafe": "ペットボトル",

            "thermos": "ペットボトル",
            "vacuum bottle": "ペットボトル",
            "flask": "ペットボトル",

            // =====================
            // ガラスびんへ統合
            // =====================

            "beer bottle": "びん",
            "wine bottle": "びん",
            "medicine bottle": "びん",
            "perfume bottle": "びん",

            "glass bottle": "びん",
            "milk bottle": "びん",
            "juice bottle": "びん",

            "jar": "びん",
            "glass jar": "びん",

            // =====================
            // 紙類へ統合
            // =====================

            "newspaper": "新聞紙",

            "magazine": "雑誌",
            "comic book": "雑誌",

            "book": "本",
            "textbook": "本",
            "notebook": "本",

            "envelope": "紙類",
            "document": "紙類",
            "folder": "紙類",

            "paper bag": "紙袋",

            "cardboard": "段ボール",

            "carton": "紙パック",

            // =====================
            // プラ容器へ統合
            // =====================

            "plastic container": "プラ容器",
            "food container": "プラ容器",
            "storage container": "プラ容器",

            "plastic tray": "食品トレー",
            "food tray": "食品トレー",

            "plastic cup": "プラカップ",

            "plastic lid": "プラふた",

            "plastic wrap": "ラップ",

            // =====================
            // コップ類
            // =====================

            "coffee mug": "マグカップ",
            "mug": "マグカップ",

            "cup": "コップ",
            "drinking glass": "コップ",

            "glass": "ガラスコップ",

            "wine glass": "ワイングラス",

            // =====================
            // 家電
            // =====================

            "television": "テレビ",
            "radio": "ラジオ",

            "speaker": "スピーカー",

            "headphone": "ヘッドホン",
            "earphone": "イヤホン",

            "laptop": "ノートパソコン",

            "computer": "パソコン",
            "desktop computer": "パソコン",

            "monitor": "モニター",
            "display": "モニター",
            "screen": "モニター",

            "printer": "プリンター",

            "keyboard": "キーボード",
            "mouse": "マウス",

            "scanner": "スキャナー",

            "cellular telephone": "携帯電話",
            "mobile phone": "携帯電話",
            "smartphone": "スマートフォン",

            "telephone": "電話機",

            "camera": "カメラ",
            "digital camera": "カメラ",

            // =====================
            // 調理器具
            // =====================

            "frying pan": "フライパン",
            "pan": "フライパン",

            "pot": "鍋",
            "saucepan": "鍋",

            "kettle": "やかん",

            "teapot": "急須",

            "tray": "トレー",

            "cutting board": "まな板",

            // =====================
            // 家具
            // =====================

            "chair": "椅子",
            "office chair": "椅子",

            "table": "テーブル",

            "desk": "机",

            "cabinet": "収納棚",

            "shelf": "棚",

            "bookcase": "本棚",

            "drawer": "引き出し",

            // =====================
            // 日用品
            // =====================

            "umbrella": "傘",

            "backpack": "リュック",

            "handbag": "バッグ",

            "wallet": "財布",

            "suitcase": "スーツケース",

            "basket": "かご",

            "box": "箱",

            "clock": "時計",

            "watch": "腕時計",

            "mirror": "鏡",

            "toy": "おもちゃ",


            "coffee mug": "カップ",
            "mug": "カップ",

            "coffee mug": "ガラスコップ",
            "mug": "ガラスコップ",





        };

        const result =
            predictions[0].className
                .split(",")[0]
                .trim();

        let finalResult = result;

        const topLabels =
            predictions.map(p =>
                p.className.toLowerCase()
            );

        // 缶優先
        if (
            topLabels.some(label =>
                label.includes("beer can") ||
                label.includes("aluminum can") ||
                label.includes("soda can") ||
                label.includes("drink can") ||
                label.includes("oil filter") ||
                label.includes("fuel filter") ||
                label.includes("air filter") ||
                label.includes("measuring cup")
            )
        ) {
            finalResult = "beer can";
        }

        // ペットボトル優先
        else if (
            topLabels.some(label =>
                label.includes("water bottle") ||
                label.includes("plastic bottle") ||
                label.includes("sports bottle") ||
                label.includes("drink bottle")
            )
        ) {
            finalResult = "water bottle";
        }

        // びん優先
        else if (
            topLabels.some(label =>
                label.includes("beer bottle") ||
                label.includes("wine bottle") ||
                label.includes("glass bottle")
            )
        ) {
            finalResult = "beer bottle";
        }


        const jpName =
            itemMap[finalResult] || finalResult;

        document
            .getElementById("aiResult")
            .innerHTML =
            "AI判定：" + jpName;


        /* AIおすすめ表示 */
        const exact =
            garbageData.find(
                item => item.name === jpName
            );


        if (exact) {

            let top5Html =

                "<h3>🔍 AI候補</h3>";

            const displayedNames = [];

            predictions.forEach((p, index) => {

                const enName =
                    p.className.split(",")[0].trim();



                const jpCandidate =
                    itemMap[enName] || enName;

                if (displayedNames.includes(jpCandidate)) {
                    return;
                }

                displayedNames.push(jpCandidate);

                const rank =
                    displayedNames.length;





                const percent =
                    Math.round(p.probability * 100);

                top5Html += `
<button
  class="aiCandidateBtn"
  onclick="selectAIItem('${jpCandidate}')">

  ${rank}位：
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

            document
                .getElementById("aiResult")
                .scrollIntoView({
                    behavior: "smooth"
                });




        }
        else {

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

    function selectAIItem(name) {



        // AI候補名 → ごみデータ名へ変換
        const aliasMap = {

            "マグカップ": "カップ",
            "ビーカー": "カップ",
            "ガラスコップ": "カップ",
            "ワイングラス": "カップ",


            "ワイングラス": "コップ",

            "給水ポット": "ポット",
            "やかん": "ポット",

            "アルミ缶": "缶",
            "スチール缶": "缶",

            "スマートフォン": "携帯電話",
            "ノートパソコン": "パソコン",

            "漫画本": "雑誌"
        };





        const searchName =
            aliasMap[name] || name;

        document
            .getElementById("searchBox")
            .value = searchName;

        document
            .getElementById("searchBox")
            .dispatchEvent(
                new Event("input")
            );



        const hitList =
            garbageData.filter(
                item =>
                    item.name.includes(searchName) ||
                    searchName.includes(item.name)
            );

        console.log(
            garbageData.filter(
                item =>
                    JSON.stringify(item)
                        .includes("マグカップ")
            )
        );


        // ↓ここから追加
        const glassList =
            garbageData.filter(
                item =>
                    item.name.includes("ガラス")
            );

        console.table(glassList);
        // ↑ここまで追加


        if (hitList.length > 0) {


        }

        const exact =
            garbageData.find(
                item =>
                    item.name.includes(searchName) ||
                    searchName.includes(item.name)
            );


        if (hitList.length > 0) {


        }

        if (exact) {

            document
                .getElementById("aiResult")
                .innerHTML =
                "AI判定：" + exact.name;

            document
                .getElementById("aiKubun")
                .innerHTML = `
      <div class="aiRecommend">
        <h3>✅ AIおすすめ</h3>
        <p><b>品目：</b>${exact.name}</p>
        <p><b>区分：</b>${exact.kubun}</p>
        <p><b>出し方：</b>${exact.method}</p>
      </div>
    `;

            const resultArea =
                document.getElementById("result");

            if (resultArea) {
                resultArea.scrollIntoView({
                    behavior: "smooth"
                });
            }

        } else {

        }

    }
