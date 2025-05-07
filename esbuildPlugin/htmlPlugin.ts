import esbuild from "esbuild";
// 定义一个 esbuild 插件
const htmlPlugin = (): esbuild.Plugin => {
  return {
    name: "html-create-plugin",
    setup(build) {
      build.onEnd((result) => {
        const startTime = Date.now();

        // All output files relevant for this html file
        let collectedOutputFiles = result.outputFiles?.map((file) => file.path);
        console.log("-- [ result.outputFiles ] --", collectedOutputFiles);
      });
    },
  };
};

export default htmlPlugin;
