import jquery from "jquery";
import {  addStyle  } from '../utils'
(function () {
  "use strict";
  window.$ = jquery;
  window.GM_addStyle = addStyle

  $(window).on("load", function () {
    console.log("jquery", jquery);
  });
})();
