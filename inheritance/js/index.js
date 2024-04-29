//結果エリアを非表示
$("#result_area").hide();
$(".child_check").hide();
$(".parents_check").hide();
$(".brothers_check").hide();
$(".brothers_n_check").hide();


// 子供の有無が変更されたときに処理を実行
$("[name=child]").change(function() {
    if ($(this).val() === "いる") {
        $(".child_check").show().find("input").prop('required', true);
        $(".parents_check").hide().find("input").prop('required', false);
        $(".brothers_check").hide().find("input").prop('required', false);
        $("input[name='parents']").prop('checked', false); // 両親の状態をリセット
        $("input[name='brothers']").prop('checked', false); // 兄弟姉妹の有無をリセット
        $("input[name='brothers_n']").val(''); // 兄弟姉妹の人数をリセット
    } else if ($(this).val() === "いない") {
        $(".child_check").hide().find("input").prop('required', false);
        $(".parents_check").show().find("input").prop('required', true);
        $("input[name='child_n']").val(''); // 子供の人数をリセット
        $("input[name='parents']").prop('checked', false); // 両親の状態の選択をリセット
        $("input[name='brothers']").prop('checked', false); // 兄弟姉妹の有無の選択をリセット
        $("input[name='brothers_n']").val(''); // 兄弟姉妹の人数をリセット
    }
});

// 両親の有無が変更されたときの処理
$("[name=parents]").change(function() {
    if ($(this).val() === "いない") {
        $(".brothers_check").show().find("input").prop('required', true);
    } else {
        $(".brothers_check").hide().find("input").prop('required', false);
        $("input[name='brothers']").prop('checked', false); // 兄弟姉妹の有無の選択をリセット
        $("input[name='brothers_n']").val(''); // 兄弟姉妹の人数をリセット
    }
});

//兄弟姉妹の有無が変更されたときの処理
$("[name=brothers]").change(function() {
    if ($(this).val() === "いる") {
        $(".brothers_n_check").show().find("input").prop('required', true);
    } else if ($(this).val() === "いない") {
        $(".brothers_n_check").hide().find("input").prop('required', false);
        $("input[name='brothers_n']").val(''); // 兄弟姉妹の人数をリセット
    }
});

//必須項目が入力されたら活性化する
const form = document.getElementById("sozokusimyuform");
const button = document.getElementById("sozokuform_btn");
form.addEventListener("input", update);
form.addEventListener("change", update);
function update() {
    const isRequired = form.checkValidity();
    if (isRequired) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}


//相談ボタンを押された時の処理
$("#sozokuform_btn").on("click",function(){
    $("#result_area").show();

    // STEP1総資産を確認
    const totalAssets = parseInt($("input[name='totalassets']").val() || 0); // 総資産の金額
    
    // STEP2 推定相続人の人数を確認
    const spouse = $('[name=spouse]:checked').val(); // 配偶者の有無
    const child = $('[name=child]:checked').val(); // 子供の有無
    const childN = parseInt($('[name=child_n]').val() || 0); // 子供の人数
    const parents = $('[name=parents]:checked').val(); // 両親の有無
    const brothers = $('[name=brothers]:checked').val(); // 兄弟姉妹の有無
    const brothersN = parseInt($('[name=brothers_n]').val() || 0); // 兄弟姉妹の人数
    

    // 相続資産を表示
    $(".total_asset_dp").html(totalAssets.toLocaleString());

    // 基礎控除を計算して表示
    let basicDeduction = 3000; // 基礎控除の初期値は3000万円
    let inheritorsCount = 0; // 法定相続人の数
    // 配偶者がいる場合、法定相続人に1人追加
    if (spouse === "いる") {
        inheritorsCount += 1;
    }
    // 子供の人数を追加
    inheritorsCount += childN;
    // 両親がいる場合、その数を追加
    if (parents === "いる") {
        inheritorsCount += 2; // 両親が生きている場合は2人
    } else if (parents === "片方") {
        inheritorsCount += 1; // 片親の場合は1人
    }
    // 兄弟姉妹の人数を追加
    inheritorsCount += brothersN;
    // 法定相続人の数に基づいて基礎控除を計算
    basicDeduction += 600 * inheritorsCount; // 600万円を法定相続人の数だけ加算
    // HTMLに基礎控除額を表示
    $(".basic_deduction").html(basicDeduction.toLocaleString());

    //相続税を計算
    let netInheritance = totalAssets - basicDeduction; // 総資産から基礎控除を引いた相続税の対象額を計算
    $(".inheritance_tax").empty(); // 相続税の結果を空にする
    if (netInheritance > 0) {
        $(".inheritance_tax").append('課税遺産総額は<span>'+ netInheritance.toLocaleString() + "</span>" + "万円です。"); // 相続税の対象額を表示
    } else {
        $(".inheritance_tax").append("相続税はかかりません。"); // 相続税がかからない場合のメッセージを表示
    }


    //課税分に応ずる税額の計算
    function calculateInheritanceAmount(netInheritance) {
        let inheritanceAmount = netInheritance; // 相続税の対象額を初期値とする
    
        if (inheritanceAmount <= 1000) {
            inheritanceAmount *= 0.1; // 10%をかける
        } else if (inheritanceAmount <= 3000) {
            inheritanceAmount = Math.floor((inheritanceAmount * 0.15) - 50); // マイナス50万円をして15%をかける
        } else if (inheritanceAmount <= 5000) {
            inheritanceAmount = Math.floor((inheritanceAmount * 0.2) - 200); // マイナス200万円をして20%をかける
        } else if (inheritanceAmount <= 10000) {
            inheritanceAmount = Math.floor((inheritanceAmount * 0.3) - 700); // マイナス700万円をして30%をかける
        } else if (inheritanceAmount <= 20000) {
            inheritanceAmount = Math.floor((inheritanceAmount * 0.4) - 1700); // マイナス1700万円をして40%をかける
        } else if (inheritanceAmount <= 30000) {
            inheritanceAmount = Math.floor((inheritanceAmount * 0.45) - 2700); // マイナス2700万円をして45%をかける
        } else if (inheritanceAmount <= 60000) {
            inheritanceAmount = Math.floor((inheritanceAmount * 0.50) - 4200); // マイナス4200万円をして50%をかける
        } else {
            inheritanceAmount = Math.floor((inheritanceAmount * 0.55) - 7200); // マイナス7200万円をして55%をかける
        }
    
        return inheritanceAmount;
    }


    // 相続額を計算してテーブルに表示する準備
    let inheritanceTable = $("#inheritance table");
    inheritanceTable.empty(); // テーブルを空にする
    // テーブルの見出しを再度追加
    inheritanceTable.append(`
        <tr>
            <th class="p-2 border">相続人</th>
            <th class="p-2 border">相続金額</th>
            <th class="p-2 border">課税額</th>
            <th class="p-2 border">相続税額</th>
        </tr>
    `);

    //処理１　配偶者いる、子供いない、両親いない、兄弟姉妹いない場合
    if(spouse === "いる" && child === "いない" && (!parents || parents === "いない") && (!brothers || brothers === "いない")){
        let spousePercentage = 1.0; // 100%を1.0として表現
        let spouseInherit = Math.round(totalAssets * spousePercentage); // 総資産の100%
        let taxableAmount = netInheritance > 0 ? Math.round(netInheritance * spousePercentage) : 0;
        let taxAmount = calculateInheritanceAmount(taxableAmount);
        inheritanceTable.append(`<tr><td class="p-2 border">配偶者</td><td class="p-2 border">${spouseInherit.toLocaleString()}万円</td><td class="p-2 border">${taxableAmount.toLocaleString()}万円</td><td class="p-2 border">${taxAmount.toLocaleString()}万円</td></tr>`);
    }

    //処理２　配偶者いない、子供いる場合
    if(spouse === "いない" && child === "いる"){
        let childShare = 1.0 / childN; // 子供の人数で等分
        for (let i = 0; i < childN; i++) {
            let childInherit = Math.round(totalAssets * childShare); // 総資産を子供の人数で等分した相続額
            let taxableAmount = netInheritance > 0 ? Math.round(netInheritance * childShare) : 0;
            let taxAmount = calculateInheritanceAmount(taxableAmount);
            inheritanceTable.append(`<tr><td class="p-2 border">子供${i + 1}</td><td class="p-2 border">${childInherit.toLocaleString()}万円</td><td class="p-2 border">${taxableAmount.toLocaleString()}万円</td><td class="p-2 border">${taxAmount.toLocaleString()}万円</td></tr>`);
        }
    }

    //処理３　配偶者いる、子供いる場合
    if(spouse === "いる" && child === "いる"){
        let spousePercentage = 0.5; // 配偶者に50%
        let spouseInherit = Math.round(totalAssets * spousePercentage); // 総資産の50%
        let spouseTaxable = netInheritance > 0 ? Math.round(netInheritance * spousePercentage) : 0;
        let taxAmount = calculateInheritanceAmount(spouseTaxable);
        inheritanceTable.append(`<tr><td class="p-2 border">配偶者</td><td class="p-2 border">${spouseInherit.toLocaleString()}万円</td><td class="p-2 border">${spouseTaxable.toLocaleString()}万円</td><td class="p-2 border">${taxAmount.toLocaleString()}万円</td></tr>`);

        let childShare = 0.5 / childN; // 残り50%を子供の人数で等分
        for (let i = 0; i < childN; i++) {
            let childInherit = Math.round(totalAssets * childShare); // 総資産の残り50%を子供の人数で等分した相続額
            let childTaxable = netInheritance > 0 ? Math.round(netInheritance * childShare) : 0;
            let taxAmount = calculateInheritanceAmount(childTaxable);
            inheritanceTable.append(`<tr><td class="p-2 border">子供${i + 1}</td><td class="p-2 border">${childInherit.toLocaleString()}万円</td><td class="p-2 border">${childTaxable.toLocaleString()}万円</td><td class="p-2 border">${taxAmount.toLocaleString()}万円</td></tr>`);
        }
    }

    //処理４　配偶者いない、子供いない、親いる場合
    if(spouse === "いない" && child === "いない" && (parents === "いる" || parents === "片方")){
        let parentsCount = (parents === "いる") ? 2 : 1; // 両親いる場合は2人、片親の場合は1人
        let parentShare = 1.0 / parentsCount; // 100%を親の人数で等分
        for (let i = 0; i < parentsCount; i++) {
            let parentInherit = Math.round(totalAssets * parentShare); // 総資産を親の人数で等分した相続額
            let parentTaxable = netInheritance > 0 ? Math.round(netInheritance * parentShare) : 0;
            let taxAmount = calculateInheritanceAmount(parentTaxable);
            inheritanceTable.append(`<tr><td class="p-2 border">親${i + 1}</td><td class="p-2 border">${parentInherit.toLocaleString()}万円</td><td class="p-2 border">${parentTaxable.toLocaleString()}万円</td><td class="p-2 border">${taxAmount.toLocaleString()}万円</td></tr>`);
        }
    }

    //処理５　配偶者いる、子供いない、親いる場合
    if(spouse === "いる" && child === "いない" && (parents === "いる" || parents === "片方")){
        let spousePercentage = 2 / 3; // 配偶者に2/3
        let spouseInherit = Math.round(totalAssets * spousePercentage); // 総資産の2/3
        let spouseTaxable = netInheritance > 0 ? Math.round(netInheritance * spousePercentage) : 0;
        let taxAmount = calculateInheritanceAmount(spouseTaxable);
        inheritanceTable.append(`<tr><td class="p-2 border">配偶者</td><td class="p-2 border">${spouseInherit.toLocaleString()}万円</td><td class="p-2 border">${spouseTaxable.toLocaleString()}万円</td><td class="p-2 border">${taxAmount.toLocaleString()}万円</td></tr>`);

        let parentsCount = (parents === "いる") ? 2 : 1; // 両親いる場合は2人、片親の場合は1人
        let parentShare = (1 - spousePercentage) / parentsCount; // 残り1/3を親の人数で等分
        for (let i = 0; i < parentsCount; i++) {
            let parentInherit = Math.round(totalAssets * parentShare); // 総資産の残り1/3を親の人数で等分した相続額
            let parentTaxable = netInheritance > 0 ? Math.round(netInheritance * parentShare) : 0;
            let taxAmount = calculateInheritanceAmount(parentTaxable);
            inheritanceTable.append(`<tr><td class="p-2 border">親${i + 1}</td><td class="p-2 border">${parentInherit.toLocaleString()}万円</td><td class="p-2 border">${parentTaxable.toLocaleString()}万円</td><td class="p-2 border">${taxAmount.toLocaleString()}万円</td></tr>`);
        }
    }

    //処理６　配偶者いない、子供いない、両親いない、兄弟いる場合
    if(spouse === "いない" && child === "いない" && parents === "いない" && brothers === "いる"){
        let brotherShare = 1.0 / brothersN; // 兄弟の人数で100%等分
        for (let i = 0; i < brothersN; i++) {
            let brotherInherit = Math.round(totalAssets * brotherShare); // 総資産を兄弟の人数で等分した相続額
            let brotherTaxable = netInheritance > 0 ? Math.round(netInheritance * brotherShare) : 0;
            let taxAmount = calculateInheritanceAmount(brotherTaxable);
            inheritanceTable.append(`<tr><td class="p-2 border">兄弟姉妹${i + 1}</td><td class="p-2 border">${brotherInherit.toLocaleString()}万円</td><td class="p-2 border">${brotherTaxable.toLocaleString()}万円</td><td class="p-2 border">${taxAmount.toLocaleString()}万円</td></tr>`);
        }
    }

    //処理７　配偶者いる、子供いない、親いない、兄弟いる場合
    if(spouse === "いる" && child === "いない" && parents === "いない" && brothers === "いる"){
        let spousePercentage = 0.75; // 配偶者に75%
        let spouseInherit = Math.round(totalAssets * spousePercentage); // 総資産の75%
        let spouseTaxable = netInheritance > 0 ? Math.round(netInheritance * spousePercentage) : 0;
        let taxAmount = calculateInheritanceAmount(spouseTaxable);
        inheritanceTable.append(`<tr><td class="p-2 border">配偶者</td><td class="p-2 border">${spouseInherit.toLocaleString()}万円</td><td class="p-2 border">${spouseTaxable.toLocaleString()}万円</td><td class="p-2 border">${taxAmount.toLocaleString()}万円</td></tr>`);

        let brotherShare = (1 - spousePercentage) / brothersN; // 残り25%を兄弟の人数で等分
        for (let i = 0; i < brothersN; i++) {
            let brotherInherit = Math.round(totalAssets * brotherShare); // 総資産の残り25%を兄弟の人数で等分した相続額
            let brotherTaxable = netInheritance > 0 ? Math.round(netInheritance * brotherShare) : 0;
            let taxAmount = calculateInheritanceAmount(brotherTaxable);
            inheritanceTable.append(`<tr><td class="p-2 border">兄弟姉妹${i + 1}</td><td class="p-2 border">${brotherInherit.toLocaleString()}万円</td><td class="p-2 border">${brotherTaxable.toLocaleString()}万円</td><td class="p-2 border">${taxAmount.toLocaleString()}万円</td></tr>`);
        }
    }

    //処理８　配偶者いない、子供いない、両親いない、兄弟いない場合
    if(spouse === "いない" && child === "いない" && parents === "いない" && brothers === "いない"){
        $("#inheritance_none").show();
        $("#inheritance").hide();
    } else {
        $("#inheritance_none").hide();
        $("#inheritance").show();
    }
    
    // #result_areaまでスクロールする
    $("#result_area").get(0).scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

return false;
});


