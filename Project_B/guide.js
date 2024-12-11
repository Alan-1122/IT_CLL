window.onload = function() {
    // 获取按钮元素
    var nextButton = document.getElementById("nextButton");
    
    // 为按钮添加点击事件监听器
    nextButton.addEventListener("click", function() {
        // 指定要跳转到的URL
        var targetURL = "./index.html"; // 替换为你想跳转到的实际URL
        
        // 执行跳转
        window.location.href = targetURL;
    });
};