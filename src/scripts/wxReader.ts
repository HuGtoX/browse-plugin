$(window).on("load", function () {
  // 检测文章内容发生变化
  $("body").append(`
        <div id="module_box" style="
        position: fixed;
        left:0;
        top:200px;
        bottom:0;
        right:0;
        margin:auto;
        width: 200px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        background-color: rgba(0, 0, 0, 0.3);
        font-size: 24px;
        z-index:999999;
        display:none;">复制成功</div>
        `);
});
