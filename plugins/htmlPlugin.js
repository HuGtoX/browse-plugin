// esbuildPlugin/htmlPlugin.ts
var htmlPlugin = () => {
  return {
    name: "html-create-plugin",
    setup(build) {
      build.onEnd((result) => {
        const startTime = Date.now();
        let collectedOutputFiles = result.outputFiles?.map((file) => file.path);
        console.log("-- [ result.outputFiles ] --", collectedOutputFiles);
      });
    }
  };
};
var htmlPlugin_default = htmlPlugin;
export {
  htmlPlugin_default as default
};
